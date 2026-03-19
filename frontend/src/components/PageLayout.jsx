import React, { useEffect } from 'react';
import NetworkBackground from './NetworkBackground';

const PageLayout = ({ children }) => {
  useEffect(() => {
    // Load Cal.com embed script once for the whole app
    if (typeof window === 'undefined') return;
    const ID = 'cal-embed-script';
    if (!document.getElementById(ID)) {
      const s = document.createElement('script');
      s.id = ID;
      s.async = true;
      s.src = 'https://app.cal.com/embed/embed.js';
      s.onload = () => console.log('[Cal] embed.js loaded');
      s.onerror = (e) => console.warn('[Cal] failed to load embed.js', e);
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div className="fixed inset-0 w-screen overflow-y-auto bg-black">
      <div className="relative min-h-screen pt-16">
        <NetworkBackground />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
