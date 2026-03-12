import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProjects, deleteProject } from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Loader2, Upload, Pencil, Trash2 } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    getProjects().then(res => setProjects(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This will also remove all attached files.`)) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      load();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const FILE_COLORS = { PDF: '#ef4444', PPTX: '#f97316', XLSX: '#22c55e' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <p style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.62rem', letterSpacing: '0.25em',
            textTransform: 'uppercase', color: '#c9a84c', marginBottom: '8px',
          }}>
            Admin
          </p>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', fontWeight: 700 }}>
            Projects
          </h1>
        </div>
        <Link to="/admin/projects/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#c9a84c', color: '#0a0a0f',
          padding: '12px 24px',
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.68rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500,
        }}>
          <Plus size={14} /> New Project
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <Loader2 size={24} color="#c9a84c" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : projects.length === 0 ? (
        <div style={{
          border: '1px dashed rgba(201,168,76,0.2)',
          padding: '80px', textAlign: 'center',
        }}>
          <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', marginBottom: '20px' }}>
            No projects yet
          </p>
          <Link to="/admin/projects/new" style={{
            fontFamily: '"DM Mono", monospace', fontSize: '0.65rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#c9a84c', textDecoration: 'none',
          }}>
            Create your first project →
          </Link>
        </div>
      ) : (
        <div style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto auto',
            gap: '20px', padding: '12px 20px',
            borderBottom: '1px solid rgba(201,168,76,0.12)',
            background: 'rgba(201,168,76,0.03)',
          }}>
            {['Project', 'Files', 'Client', 'Actions'].map(h => (
              <span key={h} style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '0.58rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)',
              }}>{h}</span>
            ))}
          </div>

          {projects.map((p, i) => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '1fr auto auto auto',
              gap: '20px', padding: '16px 20px', alignItems: 'center',
              borderBottom: i < projects.length - 1 ? '1px solid rgba(201,168,76,0.08)' : 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Title */}
              <div>
                <div style={{ fontSize: '0.9rem', color: '#f5f0e8', marginBottom: '4px' }}>{p.title}</div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[...new Set(p.files?.map(f => f.fileType) || [])].map(type => (
                    <span key={type} style={{
                      fontFamily: '"DM Mono", monospace',
                      fontSize: '0.52rem', letterSpacing: '0.1em',
                      padding: '2px 6px',
                      border: `1px solid ${FILE_COLORS[type] || '#c9a84c'}30`,
                      color: FILE_COLORS[type] || '#c9a84c',
                    }}>{type}</span>
                  ))}
                </div>
              </div>

              {/* Files count */}
              <div style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '0.7rem', color: 'rgba(245,240,232,0.5)',
                minWidth: '60px', textAlign: 'center',
              }}>
                {p.files?.length || 0} file{p.files?.length !== 1 ? 's' : ''}
              </div>

              {/* Client */}
              <div style={{
                fontSize: '0.82rem', color: 'rgba(245,240,232,0.45)',
                minWidth: '120px',
              }}>
                {p.client}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => navigate(`/admin/projects/${p.id}/files`)}
                  title="Manage Files"
                  style={{
                    background: 'none', border: '1px solid rgba(96,165,250,0.3)',
                    color: '#60a5fa', width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <Upload size={12} />
                </button>
                <button
                  onClick={() => navigate(`/admin/projects/${p.id}/edit`)}
                  title="Edit"
                  style={{
                    background: 'none', border: '1px solid rgba(201,168,76,0.3)',
                    color: '#c9a84c', width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  title="Delete"
                  style={{
                    background: 'none', border: '1px solid rgba(239,68,68,0.3)',
                    color: '#ef4444', width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
