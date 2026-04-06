import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';

const AnimatedLists = ({ items }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto w-full space-y-4 py-8"
    >
      {items.map((item, i) => (
        <motion.div 
          key={item.id || i}
          variants={itemVariants}
          whileHover={{ x: 8 }}
          className="glass-panel p-5 rounded-2xl flex items-center justify-between group overflow-hidden relative"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-green to-neon-indigo opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 relative">
              {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-tr from-neon-indigo/40 to-transparent mix-blend-overlay" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white group-hover:text-neon-green transition-colors">{item.title}</h4>
              <p className="text-sm text-gray-400 max-w-md truncate">{item.description}</p>
              <div className="flex gap-2">
                {item.tags?.map(tag => (
                   <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/5">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 hidden sm:flex">
             <button className="text-gray-400 hover:text-neon-indigo transition-colors p-2">
               <Star size={20} />
             </button>
             <button className="text-gray-400 hover:text-neon-green transition-colors p-2 glass-panel rounded-full hover:bg-white/10">
                <ExternalLink size={18} />
             </button>
          </div>
        </motion.div>
      ))}
      
      {items.length === 0 && (
        <div className="text-center text-gray-500 py-12 font-medium">
           No projects found matching the selected criteria.
        </div>
      )}
    </motion.div>
  );
};

export default AnimatedLists;
