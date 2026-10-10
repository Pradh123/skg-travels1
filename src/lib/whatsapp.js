const WHATSAPP_NUMBER = "917506222999";

export function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function reserveExternalWindow(windowRef = globalThis.window) {
  if (!windowRef?.open) return null;

  try {
    const popup = windowRef.open("", "_blank");
    if (!popup) return null;
    try {
      popup.document.title = "Opening WhatsApp";
      popup.document.body.textContent = "Saving your request. WhatsApp will open shortly...";
      popup.opener = null;
    } catch {
      // Navigation still works when a browser does not expose the temporary document.
    }
    return popup;
  } catch {
    return null;
  }
}

export function continueExternalNavigation(url, popup, windowRef = globalThis.window) {
  if (popup && !popup.closed) {
    try {
      popup.location.replace(url);
      return "reserved-window";
    } catch {
      try {
        popup.location.href = url;
        return "reserved-window";
      } catch {
        // Fall through to opening another tab or navigating the current page.
      }
    }
  }

  const opened = windowRef?.open?.(url, "_blank", "noopener,noreferrer");
  if (opened) return "new-window";

  windowRef?.location?.assign?.(url);
  return "same-window";
}

