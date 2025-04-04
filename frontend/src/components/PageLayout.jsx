import React from 'react';
import AnimatedBackground from './AnimatedBackground';

const PageLayout = ({ children }) => {
  return (
    <div className="fixed inset-0 w-screen overflow-y-auto bg-gradient-to-b from-black via-black to-black">
      <div className="relative min-h-screen pt-16">
        <AnimatedBackground />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout; 