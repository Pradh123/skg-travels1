import assert from "node:assert/strict";
import test from "node:test";
import {
  continueExternalNavigation,
  reserveExternalWindow,
  whatsappUrl,
} from "../src/lib/whatsapp.js";

test("whatsappUrl encodes the message", () => {
  assert.equal(
    whatsappUrl("Hello & welcome"),
    "https://wa.me/917506222999?text=Hello%20%26%20welcome"
  );
});

test("reserved popup is reused after the lead request finishes", () => {
  let destination = "";
  const popup = {
    closed: false,
    document: { title: "", body: { textContent: "" } },
    location: { replace: (url) => { destination = url; } },
    opener: {},
  };
  const windowRef = { open: () => popup };

  const reserved = reserveExternalWindow(windowRef);
  const result = continueExternalNavigation("https://wa.me/example", reserved, windowRef);

  assert.equal(reserved, popup);
  assert.equal(popup.opener, null);
  assert.match(popup.document.body.textContent, /Saving your request/);
  assert.equal(destination, "https://wa.me/example");
  assert.equal(result, "reserved-window");
});

test("blocked popups fall back to navigating the current window", () => {
  let destination = "";
  const windowRef = {
    open: () => null,
    location: { assign: (url) => { destination = url; } },
  };

  const result = continueExternalNavigation("https://wa.me/example", null, windowRef);

  assert.equal(destination, "https://wa.me/example");
  assert.equal(result, "same-window");
});

