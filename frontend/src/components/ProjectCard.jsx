import { motion } from 'framer-motion';
import { Globe, Code2, MessageSquare } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative h-[420px] rounded-24 glass-panel border-white/5 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,242,254,0.15)] hover:border-neon-cyan/30"
    >
      {/* Image Container */}
      <div className="relative h-1/2 overflow-hidden">
        <motion.img
          src={project.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-neon-cyan">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">
             by <span className="text-gray-300">{project.owner_username || "Anonymous"}</span>
          </p>
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag, i) => (
              <span 
                key={i} 
                className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-300 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/5">
          <div className="flex items-center gap-4 text-gray-500">
            <button className="hover:text-neon-cyan transition-colors">
              <Code2 size={18} />
            </button>
            <button className="hover:text-neon-cyan transition-colors">
              <Globe size={18} />
            </button>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors">
            <MessageSquare size={14} />
            6.4k
          </button>
        </div>
      </div>

      {/* Glow Effect Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

export default ProjectCard;
