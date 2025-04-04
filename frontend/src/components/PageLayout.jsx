import React from 'react';
import AnimatedBackground from './AnimatedBackground';

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-black relative overflow-x-hidden">
      <AnimatedBackground />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export default PageLayout; 