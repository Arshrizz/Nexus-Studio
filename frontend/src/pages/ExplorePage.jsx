import { useState, useEffect } from 'react';
import CircularGallery from '../components/CircularGallery';
import CardNav from '../components/CardNav';
import PillNav from '../components/PillNav';
import AnimatedLists from '../components/AnimatedLists';
import { supabase } from '../lib/supabase';
import { Cpu, Atom, Sparkles, Code2, Rocket, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { name: 'Generative AI', icon: Sparkles },
  { name: 'Robotics', icon: Cpu },
  { name: 'Web Experiments', icon: Globe },
  { name: 'Data Sci', icon: Atom },
  { name: 'Systems', icon: Code2 },
];

const ALL_TAGS = ['Python', 'React', 'FastAPI', 'ThreeJS', 'GLSL', 'PyTorch', 'C++', 'Rust'];

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
  },
  {
    id: 'mock4',
    title: 'Neural Node Link',
    description: 'Real-time visualization layer for PyTorch tensor streams.',
    category: 'Data Sci',
    tags: ['Python', 'PyTorch', 'React'],
    image_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80',
  },
  {
    id: 'mock5',
    title: 'FastAPI Micro-Core',
    description: 'Blazing fast scalable server architecture template.',
    category: 'Systems',
    tags: ['FastAPI', 'Python'],
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  }
];

const ExplorePage = () => {
  const [activeCategory, setActiveCategory] = useState('Generative AI');
  const [selectedTags, setSelectedTags] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [activeCategory]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // First try to fetch from supabase (client may be null if env vars are missing)
      if (!supabase) throw new Error('Supabase not configured');

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('category', activeCategory)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // If DB is empty, use mock data to ensure fabulous UI
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(MOCK_DATA.filter(p => p.category === activeCategory));
      }
    } catch (err) {
      console.error("Supabase fetch failed, using mock data.", err);
      // Fallback to mock data for presentation
      setProjects(MOCK_DATA.filter(p => p.category === activeCategory));
    } finally {
      setTimeout(() => setLoading(false), 500); // smooth loading artificial delay
    }
  };

  const handleToggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredProjects = selectedTags.length > 0
    ? projects.filter(p => p.tags?.some(t => selectedTags.includes(t)))
    : projects;

  return (
    <div className="w-full pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 overflow-hidden mt-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[80vw] h-[80vh] bg-neon-indigo/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-neon-green/30 text-neon-green text-sm font-semibold mb-6">
            <Rocket size={16} /> Welcome to the bleeding edge
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
            Trending in <span className="text-gradient drop-shadow-lg">Nexus Studio</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover the most ambitious engineering projects, creative code, and hardware prototypes entirely built by the community.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <CircularGallery items={MOCK_DATA} />
        </motion.div>
      </section>

      {/* Discovery Layer */}
      <section className="w-full px-4 border-t border-white/5 bg-black/20 pt-16 pb-12 shadow-inner">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Explore Categories</h2>
          </div>

          <CardNav
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
      </section>

      {/* Filtering and Feed */}
      <section className="w-full px-4 py-12 relative">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <h3 className="text-gray-400 text-sm tracking-widest uppercase font-bold mb-4">Filter by Tech Stack</h3>
            <PillNav
              tags={ALL_TAGS}
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
            />
          </div>

          <div className="relative min-h-[400px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 rounded-full border-b-2 border-l-2 border-neon-indigo"
                />
              </div>
            ) : (
              <AnimatedLists items={filteredProjects} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
