import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Public pages
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/public/HomePage';
import ProjectsPage from './pages/public/ProjectsPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';
import LoginPage from './pages/LoginPage';

// Admin pages
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectForm from './pages/admin/AdminProjectForm';
import AdminProjectFiles from './pages/admin/AdminProjectFiles';

function ProtectedRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e2a3a',
            color: '#f5f0e8',
            border: '1px solid rgba(201,168,76,0.3)',
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/new" element={<AdminProjectForm />} />
          <Route path="projects/:id/edit" element={<AdminProjectForm />} />
          <Route path="projects/:id/files" element={<AdminProjectFiles />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
