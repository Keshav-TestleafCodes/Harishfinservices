import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../utils/api';
import { FolderOpen, FileText, Plus, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then(res => setProjects(res.data)).finally(() => setLoading(false));
  }, []);

  const totalFiles = projects.reduce((acc, p) => acc + (p.files?.length || 0), 0);
  const pdfCount = projects.reduce((acc, p) => acc + (p.files?.filter(f => f.fileType === 'PDF').length || 0), 0);
  const pptCount = projects.reduce((acc, p) => acc + (p.files?.filter(f => f.fileType === 'PPTX').length || 0), 0);
  const xlsCount = projects.reduce((acc, p) => acc + (p.files?.filter(f => f.fileType === 'XLSX').length || 0), 0);

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderOpen, color: '#c9a84c' },
    { label: 'Total Files', value: totalFiles, icon: FileText, color: '#60a5fa' },
    { label: 'PDF Reports', value: pdfCount, icon: FileText, color: '#ef4444' },
    { label: 'PowerPoints', value: pptCount, icon: TrendingUp, color: '#f97316' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <p style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.62rem', letterSpacing: '0.25em',
          textTransform: 'uppercase', color: '#c9a84c', marginBottom: '8px',
        }}>
          Admin Console
        </p>
        <h1 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '2rem', fontWeight: 700,
        }}>
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px', marginBottom: '48px',
      }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{
            padding: '28px 24px',
            border: '1px solid rgba(201,168,76,0.15)',
            background: 'rgba(20,28,40,0.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px',
                border: `1px solid ${color}30`,
                background: `${color}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={14} color={color} />
              </div>
            </div>
            <div style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '2rem', fontWeight: 700, color, lineHeight: 1, marginBottom: '6px',
            }}>
              {loading ? '—' : value}
            </div>
            <div style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.6rem', letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,232,0.35)',
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '24px', marginBottom: '48px',
      }}>
        <Link to="/admin/projects/new" style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '28px 24px',
          border: '1px solid rgba(201,168,76,0.25)',
          background: 'rgba(201,168,76,0.04)',
          textDecoration: 'none',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.04)'}
        >
          <div style={{
            width: '44px', height: '44px',
            background: '#c9a84c',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Plus size={18} color="#0a0a0f" />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#f5f0e8', marginBottom: '4px' }}>
              New Project
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.4)' }}>
              Add a new project to your portfolio
            </div>
          </div>
        </Link>

        <Link to="/admin/projects" style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '28px 24px',
          border: '1px solid rgba(201,168,76,0.15)',
          background: 'rgba(20,28,40,0.5)',
          textDecoration: 'none',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'}
        >
          <div style={{
            width: '44px', height: '44px',
            border: '1px solid rgba(201,168,76,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <FolderOpen size={18} color="#c9a84c" />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#f5f0e8', marginBottom: '4px' }}>
              Manage Projects
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.4)' }}>
              Edit, delete, or upload files
            </div>
          </div>
        </Link>
      </div>

      {/* Recent projects */}
      <div>
        <p style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.62rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#c9a84c', marginBottom: '20px',
        }}>
          Recent Projects
        </p>
        <div style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(245,240,232,0.3)' }}>Loading...</div>
          ) : projects.slice(0, 5).map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: i < Math.min(projects.length, 5) - 1 ? '1px solid rgba(201,168,76,0.08)' : 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{ fontSize: '0.9rem', color: '#f5f0e8', marginBottom: '3px' }}>{p.title}</div>
                <div style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: '0.58rem', letterSpacing: '0.1em',
                  color: 'rgba(245,240,232,0.3)',
                }}>
                  {p.client} · {p.files?.length || 0} file{p.files?.length !== 1 ? 's' : ''}
                </div>
              </div>
              <Link to={`/admin/projects/${p.id}/files`} style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '0.6rem', letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#c9a84c', textDecoration: 'none',
              }}>
                Manage →
              </Link>
            </div>
          ))}
          {projects.length === 0 && (
            <div style={{
              padding: '40px', textAlign: 'center',
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)',
            }}>
              No projects yet. <Link to="/admin/projects/new" style={{ color: '#c9a84c' }}>Create one →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
