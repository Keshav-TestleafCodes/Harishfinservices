import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FolderOpen, LogOut, Eye } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: 'rgba(16,22,32,0.98)',
        borderRight: '1px solid rgba(201,168,76,0.12)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, bottom: 0, left: 0,
        zIndex: 200,
      }}>
        {/* Logo */}
        <div style={{
          padding: '28px 24px 24px',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}>
          <div style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.1rem', fontWeight: 700, color: '#c9a84c',
          }}>
            FinFolio
          </div>
          <div style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.58rem', letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.3)', marginTop: '4px',
          }}>
            Admin Console
          </div>
        </div>

        {/* User info */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(201,168,76,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: '#c9a84c',
              fontFamily: '"DM Mono", monospace',
            }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#f5f0e8', fontWeight: 500 }}>
                {user?.username}
              </div>
              <div style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '0.58rem', letterSpacing: '0.1em',
                color: '#c9a84c', textTransform: 'uppercase',
              }}>
                {user?.role}
              </div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, paddingTop: '16px' }}>
          <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={14} /> Dashboard
          </NavLink>
          <NavLink to="/admin/projects" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FolderOpen size={14} /> Projects
          </NavLink>
          <NavLink to="/" className="sidebar-link" target="_blank">
            <Eye size={14} /> View Site
          </NavLink>
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{
              width: '100%', border: 'none', background: 'none',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: '240px',
        minHeight: '100vh',
        padding: '40px 48px',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
