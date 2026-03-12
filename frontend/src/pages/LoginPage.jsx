import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      toast.success('Welcome back, ' + user.username);
      navigate(user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <div style={{
        width: 'min(440px, 90vw)',
        border: '1px solid rgba(201,168,76,0.2)',
        background: 'rgba(16,22,32,0.95)',
        backdropFilter: 'blur(10px)',
        padding: '52px 48px',
        animation: 'fadeUp 0.6s ease forwards',
        position: 'relative',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'block', textAlign: 'center', marginBottom: '40px',
          fontFamily: '"Playfair Display", serif',
          fontSize: '1.4rem', fontWeight: 700, color: '#c9a84c',
          textDecoration: 'none',
        }}>
          FinFolio
        </Link>

        <p style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.65rem', letterSpacing: '0.25em',
          textTransform: 'uppercase', color: '#c9a84c',
          textAlign: 'center', marginBottom: '8px',
        }}>
          Admin Access
        </p>
        <p style={{
          fontSize: '0.85rem', color: 'rgba(245,240,232,0.4)',
          textAlign: 'center', marginBottom: '40px', lineHeight: 1.6,
        }}>
          Sign in with your administrator credentials to manage projects.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.6rem', letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,232,0.4)', marginBottom: '8px',
            }}>
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(245,240,232,0.04)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: '#f5f0e8', fontSize: '0.9rem',
                fontFamily: '"DM Sans", sans-serif',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.6rem', letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,232,0.4)', marginBottom: '8px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(245,240,232,0.04)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: '#f5f0e8', fontSize: '0.9rem',
                fontFamily: '"DM Sans", sans-serif',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? 'rgba(201,168,76,0.5)' : '#c9a84c',
              color: '#0a0a0f', border: 'none',
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.72rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Default credentials hint */}
        <div style={{
          marginTop: '28px', padding: '14px',
          border: '1px solid rgba(201,168,76,0.1)',
          background: 'rgba(201,168,76,0.03)',
        }}>
          <p style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.58rem', letterSpacing: '0.1em',
            color: 'rgba(245,240,232,0.3)', textAlign: 'center',
          }}>
            Default: admin / admin123
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/" style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.6rem', letterSpacing: '0.12em',
            color: 'rgba(245,240,232,0.3)', textDecoration: 'none',
          }}>
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
