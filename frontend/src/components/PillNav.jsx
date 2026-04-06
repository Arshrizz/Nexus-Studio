import { motion } from 'framer-motion';

const PillNav = ({ tags, selectedTags, onToggleTag }) => {
  return (
    <div className="flex flex-wrap gap-3 py-6 justify-center">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <motion.button
            key={tag}
            onClick={() => onToggleTag(tag)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden ${
              isSelected 
                ? 'text-bg-dark font-bold' 
                : 'text-gray-300 glass-panel hover:bg-white/10'
            }`}
          >
            {isSelected && (
              <motion.div
                className="absolute inset-0 bg-neon-green"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
            <span className="relative z-10 tracking-wide">{tag}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default PillNav;
