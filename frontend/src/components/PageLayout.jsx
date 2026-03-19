import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="relative min-h-screen pt-16 flex flex-col">
        <NetworkBackground />
        <div className="relative z-10 flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-gray-800 text-white py-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p>&copy; {new Date().getFullYear()} CodeByCed. All rights reserved.</p>
              </div>
              {/* Admin access */}
              <Link to="/admin/login" className="text-gray-600 hover:text-gray-400 transition-colors" aria-label="Admin">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PageLayout;
