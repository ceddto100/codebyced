import React from 'react';
import AnimatedBackground from './AnimatedBackground';

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-gray-100 overflow-x-hidden w-full relative">
      <div className="overflow-x-hidden w-full">
        <AnimatedBackground />
        <div className="relative z-10 overflow-x-hidden w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout; 