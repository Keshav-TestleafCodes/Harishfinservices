import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicLayout() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 60px',
        background: 'linear-gradient(to bottom, rgba(10,10,15,0.97) 0%, transparent 100%)',
        backdropFilter: 'blur(4px)',
      }}>
        <Link to="/" style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '1.1rem', fontWeight: 700,
          color: '#c9a84c', textDecoration: 'none', letterSpacing: '0.05em',
        }}>
          FinFolio
        </Link>

        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {[['/', 'Home'], ['/projects', 'Work']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.68rem', letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: location.pathname === path ? '#c9a84c' : 'rgba(245,240,232,0.55)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}>
              {label}
            </Link>
          ))}
          {isAdmin ? (
            <Link to="/admin" style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.68rem', letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '8px 18px',
              border: '1px solid rgba(201,168,76,0.4)',
              color: '#c9a84c',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              Admin ↗
            </Link>
          ) : (
            <Link to="/login" style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.68rem', letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,232,0.4)',
              textDecoration: 'none',
            }}>
              Login
            </Link>
          )}
        </div>
      </nav>

      <Outlet />

      {/* Footer */}
      <footer style={{
        padding: '28px 60px',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(245,240,232,0.2)' }}>
          © 2025 Marcus Reid — Financial Consultant
        </span>
        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(245,240,232,0.2)' }}>
          All work shown with client permission
        </span>
      </footer>
    </div>
  );
}
