import { Outlet } from 'react-router-dom';
import FloatingLines from './FloatingLines';
import ClickSpark from './ClickSpark';

const GlobalLayout = () => {
  return (
    <div className="min-h-screen text-white font-sans relative selection:bg-neon-green/30 selection:text-white">
      {/* Global Persistent Background - Fixed and at lowest Z-index */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <FloatingLines
          linesGradient={["#6366f1", "#00ff99", "#47f5d8", "#ffffff"]}
          animationSpeed={1.5}
          interactive
          bendRadius={0.5}
          bendStrength={-0.4}
          mouseDamping={0.1}
          parallax
          parallaxStrength={0.15}
        />
      </div>

      {/* Main Content Area - Sitting on top of the background */}
      <div className="relative z-10 w-full min-h-screen">
        <ClickSpark>
          <Outlet />
        </ClickSpark>
      </div>
    </div>
  );
};

export default GlobalLayout;
