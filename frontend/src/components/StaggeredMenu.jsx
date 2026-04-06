import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const StaggeredMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Explore", path: "/explore" },
    { name: "Projects", path: "/projects" },
    { name: "Studio", path: "/studio" },
    { name: "Profile", path: "/profile" },
  ];

  const menuVariants = {
    closed: { 
      opacity: 0,
      x: "100%",
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      }
    },
    open: { 
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 z-50 relative text-white"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-bg-dark/95 backdrop-blur-lg z-40 flex flex-col justify-center items-center gap-8"
          >
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <motion.div key={item.name} variants={itemVariants}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-3xl font-bold tracking-wider ${
                      isActive ? "text-neon-indigo" : "text-gray-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaggeredMenu;
