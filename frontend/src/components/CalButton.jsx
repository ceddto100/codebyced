// src/components/CalButton.jsx
import React, { useEffect } from "react";

/**
 * CalButton
 * - Loads Cal.com embed script once
 * - Opens the popup for the given event slug on click
 *
 * Props:
 *   handle (string): your Cal.com handle, e.g. "codebyced"
 *   event   (string): event slug, e.g. "seo-quote"
 *   label   (string): button text
 *   metadata (object): optional Cal metadata (service, source, etc.)
 *   className (string): optional tailwind classes for styling
 */
export default function CalButton({
  handle = "your-handle",   // TODO: replace with your real Cal.com handle
  event,
  label = "Get a quote",
  metadata = {},
  className = "inline-flex items-center rounded-lg px-5 py-2.5 bg-blue-700 text-white hover:bg-blue-600 transition"
}) {
  useEffect(() => {
    const id = "cal-embed-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.async = true;
      s.src = "https://app.cal.com/embed/embed.js";
      document.body.appendChild(s);
    }
  }, []);

  return (
    // DATA ATTRS are what the Cal embed script reads
    <button
      type="button"
      data-cal-link={`${handle}/${event}`}
      data-cal-config={JSON.stringify({
        layout: "month_view",
        metadata
      })}
      className={className}
      // Fallback: if script hasn't loaded for any reason, open a normal link
      onClick={(e) => {
        const hasEmbed = !!document.querySelector("script[src*='app.cal.com/embed']");
        if (!hasEmbed) {
          window.open(`https://cal.com/${handle}/${event}`, "_blank", "noopener,noreferrer");
        }
      }}
    >
      {label}
    </button>
  );
}
