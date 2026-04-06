import { motion } from 'framer-motion';

const CardNav = ({ categories, onSelect, activeCategory }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center py-8">
      {categories.map((cat, index) => {
        const isActive = activeCategory === cat.name;
        
        return (
          <motion.button
            key={cat.name}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(cat.name)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 rounded-2xl overflow-hidden min-w-[160px] flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
              isActive 
                ? 'bg-white/10 glow-indigo border-neon-indigo/50' 
                : 'glass-panel hover:bg-white/5 border-transparent'
            }`}
          >
            {isActive && (
              <motion.div 
                layoutId="cardNavActive" 
                className="absolute inset-0 border-2 border-neon-indigo rounded-2xl bg-neon-indigo/5"
              />
            )}
            <cat.icon size={28} className={isActive ? "text-neon-indigo" : "text-gray-400"} />
            <span className={`font-semibold tracking-wide ${isActive ? 'text-white' : 'text-gray-400'}`}>
              {cat.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default CardNav;
