import React from "react";

export default function CalButton({
  handle = "cedrick-carter-ndeqh2",
  event = "secret",
  label = "Get a Quote",
  metadata = {},
  className = "inline-flex items-center rounded-lg px-5 py-2.5 bg-blue-700 text-white hover:bg-blue-600 transition"
}) {
  const calLink = `${handle}/${event}`;

  const openCal = () => {
    if (window.Cal && typeof window.Cal === "function") {
      window.Cal("open", { calLink, config: { layout: "month_view", metadata } });
    } else {
      // Script didn’t bind yet or is blocked — open the booking page directly
      window.open(`https://cal.com/${calLink}`, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button type="button" className={className} onClick={openCal}>
      {label}
    </button>
  );
}

