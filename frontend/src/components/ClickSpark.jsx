import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ClickSpark = ({ children }) => {
  const [sparks, setSparks] = useState([]);

  const handleClick = useCallback((e) => {
    const id = Date.now();
    const newSpark = { id, x: e.clientX, y: e.clientY };
    setSparks((prev) => [...prev, newSpark]);
    
    // Clean up spark after animation duration
    setTimeout(() => {
      setSparks((prev) => prev.filter((spark) => spark.id !== id));
    }, 600);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [handleClick]);

  return (
    <>
      {children}
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none fixed z-50 rounded-full border-2 border-neon-green"
            style={{
              left: spark.x,
              top: spark.y,
              width: "40px",
              height: "40px",
              transform: "translate(-50%, -50%)"
            }}
          >
            {/* Inner glow or particle effects could go here, keeping simple for elegance */}
            <motion.div 
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-green w-4 h-4 blur-sm"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
};

export default ClickSpark;
