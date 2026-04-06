import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Box, 
  Code, 
  Image as ImageIcon, 
  FileText, 
  Activity, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  MoreVertical
} from 'lucide-react';
import PillNav from '../components/PillNav';
import AnimatedLists from '../components/AnimatedLists';
import CardNav from '../components/CardNav';
import CircularGallery from '../components/CircularGallery';
import AddProjectModal from '../components/AddProjectModal';

const StudioPage = () => {
  const [activeTab, setActiveTab] = useState("Project Lab");
  const [workspaceFilter, setWorkspaceFilter] = useState("Drafts");
  const [assetCategory, setAssetCategory] = useState("3D Models");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [projects, setProjects] = useState([]);
  const [assets, setAssets] = useState([]);
  const [analytics, setAnalytics] = useState({
    project_views: 0,
    build_success: "0%",
    storage_used: "0 GB / 10 GB",
    recent_activity: []
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('nexus_user');
    if (!storedUser) {
      navigate('/auth');
      return;
    }
    const user = JSON.parse(storedUser);
    setUserId(user.id);
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const [projectsRes, assetsRes, analyticsRes] = await Promise.all([
          fetch(`${API_URL}/studio/workspace?user_id=${userId}`),
          fetch(`${API_URL}/studio/assets?user_id=${userId}`),
          fetch(`${API_URL}/studio/analytics?user_id=${userId}`)
        ]);

        const projectsData = await projectsRes.json();
        const assetsData = await assetsRes.json();
        const analyticsData = await analyticsRes.json();

        setProjects(projectsData);
        setAssets(assetsData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("Error fetching studio data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleAddProject = async (newProject) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/projects/create?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      setProjects([data, ...projects]);
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to create project.");
      console.error(err);
    }
  };

  const sidebarLinks = [
    { name: "Project Lab", icon: LayoutGrid },
    { name: "Asset Vault", icon: Box },
    { name: "Analytics Pulse", icon: Activity },
    { name: "Global Settings", icon: Settings },
  ];

  const assetCategories = [
    { name: "3D Models", icon: Box },
    { name: "Source Code", icon: Code },
    { name: "Textures", icon: ImageIcon },
    { name: "Documentation", icon: FileText },
  ];

  const filteredProjects = projects.filter(p => {
    if (workspaceFilter === "Drafts") return p.status === "draft";
    if (workspaceFilter === "Active Projects") return p.status === "active";
    if (workspaceFilter === "Archived") return p.status === "archived";
    return true;
  });

  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)] w-full gap-8">
      {/* 2-Column Grid: Left Sidebar (Staggered Menu as Lab Sidebar) */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="glass-panel border-r border-white/10 hidden lg:flex flex-col relative z-20 group transition-all duration-300 rounded-3xl"
        style={{ minHeight: '600px' }}
      >
        <div className="p-6 flex items-center justify-between">
           {!sidebarCollapsed && <span className="font-bold text-xl tracking-tighter text-neon-indigo">LAB v1.0</span>}
           <button 
             onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
             className="p-2 rounded-full hover:bg-white/5 text-gray-400"
           >
             {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
           </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-4">
          {sidebarLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                activeTab === link.name 
                  ? 'bg-neon-indigo/20 text-white border border-neon-indigo/50' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <link.icon size={22} className={activeTab === link.name ? "text-neon-indigo" : ""} />
              {!sidebarCollapsed && <span className="font-medium">{link.name}</span>}
              {activeTab === link.name && !sidebarCollapsed && (
                <motion.div layoutId="activeInd" className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-indigo shadow-[0_0_8px_#6366f1]" />
              )}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="p-6 bg-white/5 border-t border-white/5 space-y-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-neon-indigo" />
               <div className="flex flex-col">
                  <span className="text-sm font-bold">{JSON.parse(localStorage.getItem('nexus_user') || '{}').full_name || 'Nexus Creator'}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Lead Engineer</span>
               </div>
             </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-8 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === "Project Lab" && (
              <div className="space-y-8">
                {/* Header with Circular Gallery (3 most recent) */}
                <header className="pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                       <div>
                         <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Technical Lab</h1>
                         <p className="text-gray-400 text-sm sm:text-base">Welcome back, Engineer. Your projects are ready for deployment.</p>
                       </div>
                       <button 
                         onClick={() => setIsModalOpen(true)}
                         className="flex items-center gap-2 px-6 py-3 bg-neon-indigo hover:bg-indigo-600 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] whitespace-nowrap self-start sm:self-auto"
                       >
                         <Plus size={20} />
                         CREATE NEW
                       </button>
                    </div>

                   {/* Circular Gallery for recent projects */}
                   <div className="glass-panel p-8 rounded-3xl mb-12 flex flex-col items-center">
                     <h3 className="text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-4">Featured Recent Research</h3>
                     <CircularGallery items={featuredProjects} />
                   </div>
                </header>

                {/* Workspace Toggle (Pill Nav) */}
                <div className="space-y-4">
                   <div className="flex justify-between items-center px-4">
                      <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Workspace Buffer</h2>
                      <div className="flex gap-4">
                        <PillNav 
                          tags={["Drafts", "Active Projects", "Archived"]} 
                          selectedTags={[workspaceFilter]} 
                          onToggleTag={(tag) => setWorkspaceFilter(tag)} 
                        />
                      </div>
                   </div>

                   {/* WIP Feed (Animated Lists) */}
                   <AnimatedLists items={filteredProjects} />
                </div>
              </div>
            )}

            {activeTab === "Asset Vault" && (
              <div className="pt-8 space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-bold tracking-tight">Stored Assets</h1>
                  <div className="flex items-center gap-4">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          type="text" 
                          placeholder="Search deep storage..." 
                          className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neon-indigo w-64"
                        />
                     </div>
                     <button className="p-2 glass-panel rounded-lg text-gray-400 hover:text-white transition-colors">
                        <MoreVertical size={20} />
                     </button>
                  </div>
                </div>

                <CardNav 
                  categories={assetCategories} 
                  activeCategory={assetCategory}
                  onSelect={(cat) => setAssetCategory(cat)} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {assets.map(asset => (
                     <motion.div 
                       key={asset.id}
                       whileHover={{ y: -5 }}
                       className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-indigo/50 transition-all group"
                     >
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-neon-green">
                              {asset.type === "3D Models" && <Box size={24} />}
                              {asset.type === "Source Code" && <Code size={24} />}
                              {asset.type === "Textures" && <ImageIcon size={24} />}
                              {asset.type === "Documentation" && <FileText size={24} />}
                           </div>
                           <span className="text-[10px] text-gray-500 font-mono">{asset.size}</span>
                        </div>
                        <h4 className="font-bold text-lg mb-1 group-hover:text-neon-indigo transition-colors">{asset.name}</h4>
                        <p className="text-sm text-gray-400 mb-6">{asset.type} — Private Asset</p>
                        <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold tracking-widest uppercase transition-colors">
                           Download
                        </button>
                     </motion.div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === "Analytics Pulse" && (
              <div className="pt-8 space-y-12">
                 <h1 className="text-4xl font-bold tracking-tight">System Analytics</h1>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { label: "Total Project Views", value: analytics?.project_views || "...", icon: Activity, color: "text-neon-green" },
                      { label: "Build Success Rate", value: analytics?.build_success || "...", icon: Code, color: "text-neon-indigo" },
                      { label: "Storage Used", value: analytics?.storage_used || "...", icon: Box, color: "text-white" }
                    ].map((stat, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4 relative overflow-hidden"
                      >
                        <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                           <stat.icon size={32} />
                        </div>
                        <span className="text-4xl font-black">{stat.value}</span>
                        <span className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">{stat.label}</span>
                        
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-neon-indigo/10 blur-3xl rounded-full" />
                      </motion.div>
                    ))}
                 </div>

                 <div className="glass-panel p-8 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                       <Activity size={20} className="text-neon-green" />
                       Recent Protocol Activity
                    </h3>
                    <div className="space-y-4">
                       {analytics?.recent_activity.map((event, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                            <div className="w-2 h-2 rounded-full bg-neon-indigo animate-pulse" />
                            <span className="flex-1 font-medium">{event.event}</span>
                            <span className="text-xs text-gray-500">{event.date}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
            
            {activeTab === "Global Settings" && (
               <div className="pt-8 space-y-8 max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight">Lab Preferences</h1>
                  <div className="space-y-6">
                     {[
                       "Enable Background Parallax",
                       "High Fidelity Shader Rendering",
                       "Automatic Asset Compression",
                       "Public Profile Visibility"
                     ].map((setting, i) => (
                       <div key={i} className="flex items-center justify-between p-6 glass-panel rounded-2xl border border-white/10">
                          <span className="font-medium text-lg">{setting}</span>
                          <div className="w-12 h-6 rounded-full bg-neon-indigo relative">
                             <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition-all shadow-[0_0_10px_#fff]" />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AddProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddProject} 
      />
    </div>
  );
};

export default StudioPage;
