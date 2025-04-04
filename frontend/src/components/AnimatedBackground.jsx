import React from 'react';

const AnimatedBackground = () => {
  return (
    <>
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-float" style={{ animationDuration: '12s' }}></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-teal-400/10 rounded-full filter blur-2xl animate-pulse" style={{ animationDuration: '20s' }}></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl animate-float" style={{ animationDuration: '15s' }}></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-900/15 rounded-full filter blur-2xl animate-pulse" style={{ animationDuration: '25s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400/5 rounded-full filter blur-3xl animate-float" style={{ animationDuration: '18s' }}></div>
      
      {/* Additional Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/15 rounded-full filter blur-2xl animate-float" style={{ animationDuration: '22s' }}></div>
      <div className="absolute bottom-1/3 left-1/3 w-88 h-88 bg-rose-400/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '16s' }}></div>
      <div className="absolute top-3/4 right-3/4 w-72 h-72 bg-emerald-500/10 rounded-full filter blur-2xl animate-float" style={{ animationDuration: '19s' }}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '24s' }}></div>
      <div className="absolute top-0 left-0 w-80 h-80 bg-sky-400/15 rounded-full filter blur-2xl animate-float" style={{ animationDuration: '21s' }}></div>
      <div className="absolute bottom-1/2 right-1/2 w-64 h-64 bg-fuchsia-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '17s' }}></div>
      <div className="absolute top-1/5 left-1/5 w-88 h-88 bg-amber-400/10 rounded-full filter blur-2xl animate-float" style={{ animationDuration: '23s' }}></div>
      <div className="absolute bottom-3/4 right-3/4 w-72 h-72 bg-lime-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '20s' }}></div>
    </>
  );
};

export default AnimatedBackground; 