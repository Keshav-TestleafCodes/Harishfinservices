import { useState, useEffect } from 'react';
import { getProjects } from '../../utils/api';
import ProjectCard from '../../components/ui/ProjectCard';
import { Loader2 } from 'lucide-react';

const FILTERS = ['All', 'PDF', 'PPTX', 'XLSX'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(res => {
        setProjects(res.data);
        setFiltered(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const applyFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      setFiltered(projects);
    } else {
      setFiltered(projects.filter(p =>
        p.files?.some(f => f.fileType === filter)
      ));
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div style={{ padding: '60px 60px 40px' }}>
        <p style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.65rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', color: '#c9a84c', marginBottom: '16px',
        }}>
          Selected Work
        </p>
        <h1 style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 700, lineHeight: 1.1, marginBottom: '16px',
        }}>
          Projects & case studies
        </h1>
        <p style={{
          color: 'rgba(245,240,232,0.5)', fontSize: '0.95rem', lineHeight: 1.8,
          maxWidth: '480px', marginBottom: '40px',
        }}>
          A curated selection of client engagements across financial modeling, research, and strategy.
        </p>

        {/* Filters */}
        <div style={{
          display: 'flex', border: '1px solid rgba(201,168,76,0.2)',
          width: 'fit-content', marginBottom: '48px',
        }}>
          {FILTERS.map((f, i) => (
            <button key={f} onClick={() => applyFilter(f)} style={{
              padding: '10px 28px',
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.65rem', letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: activeFilter === f ? '#c9a84c' : 'transparent',
              color: activeFilter === f ? '#0a0a0f' : 'rgba(245,240,232,0.45)',
              border: 'none',
              borderRight: i < FILTERS.length - 1 ? '1px solid rgba(201,168,76,0.2)' : 'none',
              cursor: 'pointer',
              fontWeight: activeFilter === f ? 500 : 300,
              transition: 'all 0.2s',
            }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px', opacity: 0.5 }}>
            <Loader2 size={24} color="#c9a84c" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(245,240,232,0.3)' }}>
            <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              No projects found.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
          }}>
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
