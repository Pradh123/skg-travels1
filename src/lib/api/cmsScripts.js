// Only script elements from the explicit admin Head Scripts field are executable.
// Content/FAQ HTML continues to be rendered as text.
export function parseCmsScripts(value) {
  const scripts = [];
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  for (const match of String(value || "").matchAll(pattern)) {
    const attributes = {};
    for (const attribute of match[1].matchAll(
      /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g
    )) {
      attributes[attribute[1].toLowerCase()] = attribute[2] ?? attribute[3] ?? attribute[4];
    }
    const type = attributes.type || "text/javascript";
    if (
      !["text/javascript", "application/javascript", "module", "application/ld+json"].includes(type)
    )
      continue;
    const src = attributes.src;
    if (src && !/^https?:\/\//i.test(src) && !/^\/(?!\/)/.test(src)) continue;
    let code = match[2].trim();
    if (type === "application/ld+json") {
      if (src) continue;
      try {
        code = JSON.stringify(JSON.parse(code)).replace(/</g, "\\u003c");
      } catch {
        continue;
      }
    }
    if (!src && !code) continue;
    scripts.push({ type, ...(src ? { src } : { code }) });
  }
  return scripts;
}
