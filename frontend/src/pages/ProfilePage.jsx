import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Layers, 
  Cpu, 
  Globe, 
  ChevronRight, 
  MapPin, 
  Briefcase, 
  Award,
  ExternalLink,
  Edit3,
  Check,
  X
} from 'lucide-react';
import AnimatedLists from '../components/AnimatedLists';
import SocialIcon from '../components/SocialIcon';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: '',
    bio: '',
    location: '',
    expertise: []
  });
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
        const [profileRes, projectsRes] = await Promise.all([
          fetch(`${API_URL}/user/profile?user_id=${userId}`),
          fetch(`${API_URL}/studio/workspace?user_id=${userId}`)
        ]);

        const profileData = await profileRes.json();
        const projectsData = await projectsRes.json();

        setProfile(profileData);
        setEditData({
          full_name: profileData.full_name || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          expertise: profileData.expertise || []
        });
        setProjects(projectsData);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/user/profile/update?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      
      if (res.ok) {
        setProfile({ ...profile, ...editData });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { name: "Overview", icon: User },
    { name: "Research Projects", icon: Layers },
    { name: "Skill Stack", icon: Cpu },
    { name: "Deep Links", icon: Globe },
  ];

  if (loading) return (
     <div className="flex h-[80vh] items-center justify-center">
       <div className="w-12 h-12 rounded-full border-4 border-neon-indigo border-t-transparent animate-spin" />
     </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-6rem)]">
      {/* Profile Sidebar */}
      <aside className="w-full lg:w-80 space-y-6">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center">
           <div className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-green to-neon-indigo rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500" />
              <div className="relative w-24 h-24 rounded-full bg-bg-dark border-2 border-white/10 flex items-center justify-center overflow-hidden">
                 <User size={48} className="text-gray-600" />
              </div>
           </div>
           
           <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">{profile?.full_name}</h2>
           <p className="text-neon-indigo text-xs font-bold uppercase tracking-widest mb-6">Lead Creative Engineer</p>
           
           <button 
             onClick={() => setIsEditing(!isEditing)}
             className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 mb-6 font-bold text-xs uppercase tracking-widest transition-all ${
               isEditing 
                 ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                 : 'glass-panel text-white hover:bg-neon-indigo/20 border border-white/10 hover:border-neon-indigo/50'
             }`}
           >
              {isEditing ? <X size={14} /> : <Edit3 size={14} />}
              {isEditing ? "Cancel Editing" : "Edit Details"}
           </button>
           
           <div className="flex flex-col gap-2 w-full text-sm text-gray-400">
              <div className="flex items-center gap-2 justify-center">
                 <MapPin size={14} />
                 <span>{profile?.location}</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                 <Briefcase size={14} />
                 <span>Nexus Studio</span>
              </div>
           </div>
        </div>

        <nav className="glass-panel p-4 rounded-3xl border border-white/10 space-y-1">
           {menuItems.map((item) => (
             <button
               key={item.name}
               onClick={() => setActiveTab(item.name)}
               className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                 activeTab === item.name 
                   ? 'bg-neon-indigo/20 text-white border border-neon-indigo/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                   : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
               }`}
             >
               <item.icon size={20} className={activeTab === item.name ? "text-neon-indigo" : "group-hover:text-white"} />
               <span className="font-semibold">{item.name}</span>
               <ChevronRight size={16} className={`ml-auto transition-transform ${activeTab === item.name ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} />
             </button>
           ))}
        </nav>

           <div className="glass-panel p-6 rounded-3xl border border-white/10 flex justify-center gap-6">
            {(profile?.socials || []).map((social, i) => (
              <SocialIcon key={i} platform={social.platform} url={social.url} />
            ))}
          </div>
      </aside>

      {/* Profile Content */}
      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {activeTab === "Overview" && (
              <div className="space-y-8">
                <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-neon-indigo/10 blur-[100px] rounded-full" />
                   <div className="flex justify-between items-start mb-6">
                      <h1 className="text-4xl font-bold text-white">About Me</h1>
                      {isEditing && (
                        <button 
                          onClick={handleSave}
                          className="flex items-center gap-2 px-6 py-2 bg-neon-green hover:bg-emerald-500 text-bg-dark font-black rounded-full transition-all shadow-[0_0_20px_rgba(0,255,153,0.3)]"
                        >
                          <Check size={18} />
                          SAVE CHANGES
                        </button>
                      )}
                   </div>
                   
                   {isEditing ? (
                     <div className="space-y-6 relative z-10">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Full Name</label>
                          <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-neon-indigo transition-colors"
                            value={editData.full_name}
                            onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Research Bio</label>
                          <textarea 
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-neon-indigo transition-colors"
                            value={editData.bio}
                            onChange={(e) => setEditData({...editData, bio: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Lab Location</label>
                          <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-neon-indigo transition-colors"
                            value={editData.location}
                            onChange={(e) => setEditData({...editData, location: e.target.value})}
                          />
                        </div>
                     </div>
                   ) : (
                     <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
                       {profile?.bio}
                     </p>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "Total Experience", value: profile?.stats?.total_experience, icon: Briefcase },
                      { label: "Research Labs", value: profile?.stats?.active_labs, icon: Cpu },
                      { label: "Stars Earned", value: profile?.stats?.stars_earned, icon: Award },
                    ].map((stat, i) => (
                     <div key={i} className="glass-panel p-8 rounded-[2rem] border border-white/10 flex flex-col items-center gap-2 group hover:border-neon-green/30 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 mb-2 group-hover:text-neon-green transition-colors">
                           <stat.icon size={24} />
                        </div>
                        <span className="text-3xl font-black text-white">{stat.value}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">{stat.label}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === "Research Projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                   <h1 className="text-4xl font-bold text-white">Project Pipeline</h1>
                   <span className="px-4 py-1 rounded-full bg-neon-indigo/20 text-neon-indigo text-sm font-bold border border-neon-indigo/30">
                     {projects.length} Total
                   </span>
                </div>
                <AnimatedLists items={projects} />
              </div>
            )}

            {activeTab === "Skill Stack" && (
               <div className="space-y-8">
                  <h1 className="text-4xl font-bold text-white mb-8">Technical Expertise</h1>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                     {profile?.expertise.map((skill, i) => (
                       <motion.div
                         key={skill}
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ delay: i * 0.05 }}
                         whileHover={{ y: -5, scale: 1.02 }}
                         className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-3 text-center group cursor-default"
                       >
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-indigo/20 flex items-center justify-center text-neon-indigo font-bold text-lg group-hover:from-neon-green group-hover:to-neon-indigo group-hover:text-bg-dark transition-all duration-300">
                           {skill[0]}
                         </div>
                         <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{skill}</span>
                       </motion.div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === "Deep Links" && (
               <div className="space-y-8">
                  <h1 className="text-4xl font-bold text-white mb-8">External Connections</h1>
                   <div className="space-y-4 max-w-xl">
                     {(profile?.socials || []).map((social, i) => (
                        <a 
                          key={i}
                          href={social.url}
                          target="_blank"
                          rel="noreferrer"
                          className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-white/5 transition-all"
                        >
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-neon-indigo/10 flex items-center justify-center text-neon-indigo group-hover:scale-110 transition-transform">
                                 {social.platform === "GitHub" && <SocialIcon platform="github" url={social.url} />}
                                 {social.platform === "LinkedIn" && <SocialIcon platform="linkedin" url={social.url} />}
                                 {social.platform === "Instagram" && <SocialIcon platform="instagram" url={social.url} />}
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-bold text-white">{social.platform}</span>
                                 <span className="text-xs text-gray-500">/{social.url.split('/').pop()}</span>
                              </div>
                           </div>
                           <ExternalLink size={18} className="text-gray-600 group-hover:text-neon-green transition-colors" />
                        </a>
                     ))}
                  </div>
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ProfilePage;
