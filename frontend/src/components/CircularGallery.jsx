import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CircularGallery = ({ items }) => {
  const [rotation, setRotation] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev - (360 / items.length));
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center perspective-[1000px] overflow-hidden">
      <motion.div
        animate={{ rotateY: rotation }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-64 h-80"
      >
        {items.map((item, index) => {
          const angle = (360 / items.length) * index;
          return (
            <div
              key={index}
              className="absolute inset-0 flex flex-col items-center justify-center p-4 rounded-2xl glass-panel shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10 overflow-hidden group cursor-pointer"
              style={{
                transform: `rotateY(${angle}deg) translateZ(300px)`,
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-dark/90 z-10" />
              {item.image_url ? (
                 <img src={item.image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 bg-neon-indigo/20 mix-blend-overlay group-hover:scale-110 transition-transform duration-500" />
              )}
              
              <div className="relative z-20 mt-auto text-center w-full">
                <h3 className="text-xl font-bold text-white tracking-wide truncate">{item.title}</h3>
                <span className="text-neon-green text-sm font-semibold">{item.category}</span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default CircularGallery;
