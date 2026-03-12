import { Link } from 'react-router-dom';
import { FileText, Table, Presentation, Download, Eye } from 'lucide-react';
import { getDownloadUrl } from '../../utils/api';

const FILE_TYPE_CONFIG = {
  PDF:  { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)',  icon: FileText, label: 'PDF Report' },
  PPTX: { color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', icon: Presentation, label: 'PowerPoint' },
  XLSX: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  icon: Table, label: 'Excel Model' },
  OTHER: { color: '#c9a84c', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.25)', icon: FileText, label: 'Document' },
};

function FileBadge({ fileType }) {
  const cfg = FILE_TYPE_CONFIG[fileType] || FILE_TYPE_CONFIG.OTHER;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 10px',
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      color: cfg.color,
      fontFamily: '"DM Mono", monospace',
      fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase',
    }}>
      <Icon size={10} /> {cfg.label}
    </span>
  );
}

export function FileTypeSummary({ files }) {
  if (!files?.length) return null;
  const types = [...new Set(files.map(f => f.fileType))];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
      {types.map(t => <FileBadge key={t} fileType={t} />)}
    </div>
  );
}

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProjectCard({ project, showActions = false, onEdit, onDelete }) {
  const primaryType = project.files?.[0]?.fileType || 'OTHER';

  return (
    <div style={{
      border: '1px solid rgba(201,168,76,0.15)',
      background: 'rgba(20,28,40,0.5)',
      backdropFilter: 'blur(10px)',
      padding: '32px',
      transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
      e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.35)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)';
      e.currentTarget.style.boxShadow = '';
    }}>

      <FileTypeSummary files={project.files} />

      <h3 style={{
        fontFamily: '"Playfair Display", serif',
        fontSize: '1.2rem', fontWeight: 700,
        lineHeight: 1.3, marginBottom: '10px',
        color: '#f5f0e8',
      }}>
        {project.title}
      </h3>

      <p style={{
        fontSize: '0.83rem', lineHeight: 1.75,
        color: 'rgba(245,240,232,0.5)',
        marginBottom: '20px',
        display: '-webkit-box', WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {project.description}
      </p>

      {/* Tags */}
      {project.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.58rem', letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              background: 'rgba(245,240,232,0.04)',
              border: '1px solid rgba(245,240,232,0.08)',
              color: 'rgba(245,240,232,0.35)',
            }}>{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid rgba(201,168,76,0.12)',
      }}>
        <span style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.6rem', letterSpacing: '0.1em',
          color: 'rgba(245,240,232,0.3)',
        }}>
          {project.client} · {project.year}
        </span>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {showActions ? (
            <>
              <button onClick={() => onEdit(project)} style={{
                background: 'none', border: '1px solid rgba(201,168,76,0.3)',
                color: '#c9a84c', padding: '6px 14px',
                fontFamily: '"DM Mono", monospace', fontSize: '0.6rem',
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>Edit</button>
              <button onClick={() => onDelete(project.id)} style={{
                background: 'none', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', padding: '6px 14px',
                fontFamily: '"DM Mono", monospace', fontSize: '0.6rem',
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              }}>Delete</button>
            </>
          ) : (
            <Link to={`/projects/${project.id}`} style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.62rem', letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#c9a84c', textDecoration: 'none',
            }}>
              View Details →
            </Link>
          )}
        </div>
      </div>

      {/* Files list for public view */}
      {!showActions && project.files?.length > 0 && (
        <div style={{ marginTop: '16px', borderTop: '1px solid rgba(201,168,76,0.08)', paddingTop: '16px' }}>
          {project.files.map(file => (
            <a key={file.id} href={getDownloadUrl(file.id)} download
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', marginBottom: '4px',
                background: 'rgba(201,168,76,0.04)',
                border: '1px solid rgba(201,168,76,0.1)',
                color: 'rgba(245,240,232,0.7)', textDecoration: 'none',
                fontSize: '0.78rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.04)'}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={12} color="#c9a84c" />
                {file.originalFilename}
              </span>
              <span style={{
                fontFamily: '"DM Mono", monospace', fontSize: '0.58rem',
                color: 'rgba(245,240,232,0.3)',
              }}>
                {formatBytes(file.fileSize)}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
