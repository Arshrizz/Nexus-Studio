import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import GlobalLayout from './components/GlobalLayout';
import AuthPage from './pages/AuthPage';
import ExplorePage from './pages/ExplorePage';
import ProjectsPage from './pages/ProjectsPage';
import StudioPage from './pages/StudioPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/explore" replace />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
