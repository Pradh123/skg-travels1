import { writeFile } from "node:fs/promises";

const pages = ["/", "/services", "/cities", "/blogs", "/about", "/contact", "/blogs/best-monsoon-getaways-from-mumbai"];
const targets = await fetch("http://localhost:9223/json/list").then((r) => r.json());
const target = targets.find((item) => item.type === "page");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let id = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const result = JSON.parse(data);
  if (pending.has(result.id)) {
    pending.get(result.id)(result.result);
    pending.delete(result.id);
  }
});
function send(method, params = {}) {
  return new Promise((resolve) => {
    const next = ++id;
    pending.set(next, resolve);
    socket.send(JSON.stringify({ id: next, method, params }));
  });
}
await send("Page.enable");
for (const width of [390, 768, 1440]) {
  await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
  for (const path of pages) {
    await send("Page.navigate", { url: `http://localhost:3102${path}` });
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const result = await send("Runtime.evaluate", {
      expression: `JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+2||r.left< -2)}).slice(0,8).map(e=>({tag:e.tagName,cls:String(e.className).slice(0,100),text:e.textContent.trim().slice(0,45)}))})`,
      returnByValue: true,
    });
    console.log(width, path, result.result.value);
    if (width === 390 && ["/", "/services", "/blogs", "/cities"].includes(path)) {
      const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
      await writeFile(new URL(`./${path === "/" ? "home" : path.slice(1)}-390.png`, import.meta.url), Buffer.from(shot.data, "base64"));
    }
  }
}
socket.close();
