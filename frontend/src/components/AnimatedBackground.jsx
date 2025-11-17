import React from 'react';

/**
 * Optimized Animated Background
 * Reduced from 13 to 6 orbs for better performance
 * Added will-change and pointer-events for optimization
 */
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Primary Gradient Orbs - Reduced and optimized */}
      <div
        className="fixed top-1/3 -left-20 w-96 h-96 bg-blue-500/15 rounded-full filter blur-3xl animate-float will-change-transform"
        style={{ animationDuration: '12s' }}
      />
      <div
        className="fixed bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/12 rounded-full filter blur-3xl animate-pulse will-change-transform"
        style={{ animationDuration: '18s' }}
      />
      <div
        className="fixed -top-20 right-1/4 w-72 h-72 bg-cyan-400/10 rounded-full filter blur-3xl animate-float will-change-transform"
        style={{ animationDuration: '15s' }}
      />
      <div
        className="fixed -bottom-20 left-1/4 w-72 h-72 bg-purple-500/12 rounded-full filter blur-3xl animate-pulse will-change-transform"
        style={{ animationDuration: '20s' }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/8 rounded-full filter blur-3xl animate-float will-change-transform"
        style={{ animationDuration: '16s' }}
      />
      <div
        className="fixed top-1/4 -right-20 w-64 h-64 bg-fuchsia-500/10 rounded-full filter blur-2xl animate-pulse will-change-transform"
        style={{ animationDuration: '22s' }}
      />
    </div>
  );
};

export default AnimatedBackground; 