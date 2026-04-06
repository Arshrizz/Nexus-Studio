import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const FlowingMenu = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const location = useLocation();

  const navItems = [
    { name: "Explore", path: "/explore" },
    { name: "Projects", path: "/projects" },
    { name: "Studio", path: "/studio" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="hidden md:flex items-center gap-6 glass-panel px-6 py-3 rounded-full">
      {navItems.map((item, index) => {
        const isActive = location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.name}
            to={item.path}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative px-4 py-2 font-medium transition-colors duration-300 ${
              isActive || hoveredIndex === index ? "text-neon-green" : "text-gray-400"
            }`}
          >
            {item.name}
            
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  layoutId="flowing-menu-bg"
                  className="absolute inset-0 bg-white/5 rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </AnimatePresence>

            {isActive && (
              <motion.div
                layoutId="active-nav-indicator"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-neon-green rounded-t-lg"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default FlowingMenu;
