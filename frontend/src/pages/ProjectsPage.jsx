import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingLines from '../components/FloatingLines';
import SliceButton from '../components/SliceButton';
import ProjectCard from '../components/ProjectCard';
import AddProjectModal from '../components/AddProjectModal';
import { Rocket, Filter, Plus, Search } from 'lucide-react';

const MOCK_DATA = [
  {
    id: 'mock1',
    title: 'Neon Synapse',
    description: 'A generative AI artwork synthesizer running natively in WebGL using ThreeJS.',
    category: 'Generative AI',
    tags: ['React', 'ThreeJS', 'GLSL'],
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  },
  {
    id: 'mock2',
    title: 'Rusty Rover Controller',
    description: 'Low-latency telemetry and control dashboard for autonomous robots.',
    category: 'Robotics',
    tags: ['Rust', 'WebSockets', 'React'],
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
  },
  {
    id: 'mock3',
    title: 'Holographic Physics',
    description: 'Experimental interactive web interface simulating fluid dynamics.',
    category: 'Web Experiments',
    tags: ['React', 'GLSL', 'FastAPI'],
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
  }
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
    fetchProjects();
    
    // Check locally stored user as well
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } };
    setUser(session?.user ?? null);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/projects`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("Fetch failed:", err);
      // Fallback if needed, but we want real data now
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (newProject) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/projects/create?user_id=${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      setProjects([data, ...projects]);
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to add project. Please try again.");
      console.error(err);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 shadow-2xl shadow-neon-cyan/5">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
            >
              <Rocket size={12} className="animate-pulse" /> Community Showroom
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6"
            >
              The Next <span className="text-neon-cyan">Dimension</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 leading-relaxed"
            >
              Explore and contribute to the world's most advanced creative engineering projects.
              Built by visionaries, for visionaries.
            </motion.p>
          </div>

          {/* Action Bar: Search & Filter */}
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
             <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-neon-cyan transition-colors" size={20} />
                <input 
                   type="text" 
                   placeholder="Search visionaries, systems, or tech stacks..."
                   className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30 text-lg transition-all"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             
             {user && (
               <SliceButton onClick={() => setIsModalOpen(true)}>
                 <div className="flex items-center gap-2">
                    <Plus size={18} />
                    LAUNCH PROJECT
                 </div>
               </SliceButton>
             )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-12 h-12 rounded-full border-b-2 border-neon-cyan animate-spin" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredProjects.map((project, idx) => (
                  <ProjectCard key={project.id || idx} project={project} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-32 rounded-3xl border border-dashed border-white/10 bg-white/5">
              <p className="text-xl text-gray-400 mb-4">No projects yet. Be the first to launch!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddProject}
      />
    </div>
  );
};

export default ProjectsPage;
