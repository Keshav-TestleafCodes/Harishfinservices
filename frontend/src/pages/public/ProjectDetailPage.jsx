import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject, getDownloadUrl } from '../../utils/api';
import { Download, ArrowLeft, FileText, Table, Presentation, Loader2 } from 'lucide-react';

const FILE_ICONS = { PDF: FileText, PPTX: Presentation, XLSX: Table, OTHER: FileText };
const FILE_COLORS = { PDF: '#ef4444', PPTX: '#f97316', XLSX: '#22c55e', OTHER: '#c9a84c' };

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProject(id)
      .then(res => setProject(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: '120px', display: 'flex', justifyContent: 'center', padding: '200px' }}>
      <Loader2 size={28} color="#c9a84c" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (!project) return (
    <div style={{ paddingTop: '120px', textAlign: 'center', padding: '200px' }}>
      Project not found.
    </div>
  );

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div style={{ padding: '60px', maxWidth: '900px' }}>
        <Link to="/projects" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.65rem', letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.4)', textDecoration: 'none',
          marginBottom: '40px',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.4)'}
        >
          <ArrowLeft size={12} /> Back to Projects
        </Link>

        {/* File badges */}
        {project.files?.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[...new Set(project.files.map(f => f.fileType))].map(type => {
              const color = FILE_COLORS[type] || FILE_COLORS.OTHER;
              return (
                <span key={type} style={{
                  padding: '4px 12px',
                  border: `1px solid ${color}40`,
                  background: `${color}12`,
                  color,
                  fontFamily: '"DM Mono", monospace',
                  fontSize: '0.6rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}>{type}</span>
              );
            })}
          </div>
        )}

        <h1 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 700, lineHeight: 1.15, marginBottom: '20px',
        }}>
          {project.title}
        </h1>

        {/* Meta */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, auto)',
          gap: '32px', marginBottom: '36px',
          paddingBottom: '32px',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          width: 'fit-content',
        }}>
          {[
            ['Client', project.client],
            ['Year', project.year],
            ['Scope', project.value],
            ['Category', project.category],
          ].filter(([, v]) => v).map(([label, value]) => (
            <div key={label}>
              <div style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '0.58rem', letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,232,0.3)', marginBottom: '6px',
              }}>{label}</div>
              <div style={{ fontSize: '0.9rem', color: '#f5f0e8' }}>{value}</div>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: '1rem', lineHeight: 1.85,
          color: 'rgba(245,240,232,0.65)',
          marginBottom: '36px',
        }}>
          {project.description}
        </p>

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '48px' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '0.6rem', letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '5px 12px',
                background: 'rgba(245,240,232,0.04)',
                border: '1px solid rgba(245,240,232,0.1)',
                color: 'rgba(245,240,232,0.4)',
              }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Files download section */}
        {project.files?.length > 0 && (
          <div>
            <p style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.65rem', letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#c9a84c', marginBottom: '20px',
            }}>
              Available Files
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {project.files.map(file => {
                const Icon = FILE_ICONS[file.fileType] || FileText;
                const color = FILE_COLORS[file.fileType] || FILE_COLORS.OTHER;
                return (
                  <a key={file.id}
                    href={getDownloadUrl(file.id)}
                    download
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px',
                      border: '1px solid rgba(201,168,76,0.15)',
                      background: 'rgba(20,28,40,0.4)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                      e.currentTarget.style.background = 'rgba(201,168,76,0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)';
                      e.currentTarget.style.background = 'rgba(20,28,40,0.4)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '36px', height: '36px',
                        background: `${color}15`,
                        border: `1px solid ${color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={14} color={color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', color: '#f5f0e8', marginBottom: '2px' }}>
                          {file.originalFilename}
                        </div>
                        <div style={{
                          fontFamily: '"DM Mono", monospace',
                          fontSize: '0.58rem', letterSpacing: '0.1em',
                          color: 'rgba(245,240,232,0.3)',
                        }}>
                          {file.fileType} · {formatBytes(file.fileSize)}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontFamily: '"DM Mono", monospace',
                      fontSize: '0.62rem', letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#c9a84c',
                    }}>
                      <Download size={12} /> Download
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
