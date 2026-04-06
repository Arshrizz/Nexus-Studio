import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import FlowingMenu from './FlowingMenu';
import StaggeredMenu from './StaggeredMenu';
import { User, LogOut } from 'lucide-react';
import Footer from './Footer';
import NexusLogo from './NexusLogo';

const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    setUser(null);
    navigate('/auth');
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-40 p-4 lg:px-12 lg:py-6 flex justify-between items-center bg-gradient-to-b from-[#0e0e11] to-transparent mix-blend-difference">
        <Link to="/" className="flex items-center gap-3 z-50 group">
          <NexusLogo size="sm" className="group-hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all" />
          <span className="font-bold text-2xl tracking-tighter text-white">NEXUS STUDIO</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <FlowingMenu />
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="hidden md:flex items-center gap-2 glass-panel px-4 py-2 rounded-full hover:bg-white/10 transition-all border-none">
                <div className="w-6 h-6 rounded-full bg-neon-indigo/20 flex items-center justify-center">
                  <User size={14} className="text-neon-indigo" />
                </div>
                <span className="text-sm font-medium">{user.username || user.email}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="px-6 py-2 rounded-full bg-white text-bg-dark font-bold hover:bg-neon-green hover:shadow-[0_0_15px_rgba(0,255,153,0.5)] transition-all">
              SIGN IN
            </Link>
          )}
          
          <StaggeredMenu />
        </div>
      </header>

      <main className="pt-24 min-h-screen relative z-10 flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
