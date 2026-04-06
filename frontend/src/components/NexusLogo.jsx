import React from 'react';

const NexusLogo = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-16 h-16 text-3xl',
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      className={`
        ${selectedSize} 
        flex items-center justify-center 
        rounded-[24%] 
        bg-gradient-to-br from-[#00ff9d] via-[#1dbdc3] to-[#6366f1] 
        shadow-[0_4px_15px_rgba(0,255,157,0.3)] 
        transition-all duration-500 hover:scale-105 hover:rotate-3 
        ${className}
      `}
    >
      <span className="font-black text-white tracking-tighter select-none mb-[1px]">N</span>
    </div>
  );
};

export default NexusLogo;
