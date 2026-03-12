import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createProject, updateProject, getProject } from '../../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeft, X, Plus, Loader2 } from 'lucide-react';

const CATEGORIES = ['Financial Modeling', 'Investment Research', 'Strategic Presentation', 'M&A Advisory', 'Real Estate', 'Other'];

const inputStyle = {
  width: '100%', padding: '12px 16px',
  background: 'rgba(245,240,232,0.04)',
  border: '1px solid rgba(201,168,76,0.2)',
  color: '#f5f0e8', fontSize: '0.9rem',
  fontFamily: '"DM Sans", sans-serif',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontFamily: '"DM Mono", monospace',
  fontSize: '0.6rem', letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(245,240,232,0.4)', marginBottom: '8px',
};

export default function AdminProjectForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', client: '',
    category: '', year: '', value: '', tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getProject(id)
        .then(res => setForm({
          title: res.data.title || '',
          description: res.data.description || '',
          client: res.data.client || '',
          category: res.data.category || '',
          year: res.data.year || '',
          value: res.data.value || '',
          tags: res.data.tags || [],
        }))
        .finally(() => setFetching(false));
    }
  }, [id]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.client) {
      toast.error('Title and client are required');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await updateProject(id, form);
        toast.success('Project updated');
        navigate(`/admin/projects/${id}/files`);
      } else {
        const res = await createProject(form);
        toast.success('Project created — now upload files');
        navigate(`/admin/projects/${res.data.id}/files`);
      }
    } catch {
      toast.error('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
      <Loader2 size={24} color="#c9a84c" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ maxWidth: '680px' }}>
      <Link to="/admin/projects" style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        fontFamily: '"DM Mono", monospace', fontSize: '0.62rem',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: 'rgba(245,240,232,0.35)', textDecoration: 'none', marginBottom: '36px',
      }}>
        <ArrowLeft size={12} /> Back to Projects
      </Link>

      <p style={{
        fontFamily: '"DM Mono", monospace',
        fontSize: '0.62rem', letterSpacing: '0.25em',
        textTransform: 'uppercase', color: '#c9a84c', marginBottom: '8px',
      }}>
        {isEdit ? 'Edit Project' : 'New Project'}
      </p>
      <h1 style={{
        fontFamily: '"Playfair Display", serif',
        fontSize: '1.8rem', fontWeight: 700, marginBottom: '40px',
      }}>
        {isEdit ? 'Update project details' : 'Create a new project'}
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              type="text" value={form.title} required
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Series B Financial Model"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description} rows={4}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe the project, deliverables, and outcomes..."
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
            />
          </div>

          {/* Client + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Client *</label>
              <input
                type="text" value={form.client} required
                onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                placeholder="Client name"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Year + Value */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Year</label>
              <input
                type="text" value={form.year}
                onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                placeholder="e.g. 2024"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Deal / Scope Value</label>
              <input
                type="text" value={form.value}
                onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                placeholder="e.g. $45M raise"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text" value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag and press Enter"
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
              />
              <button
                type="button" onClick={addTag}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  color: '#c9a84c', cursor: 'pointer',
                }}
              >
                <Plus size={14} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {form.tags.map(tag => (
                  <span key={tag} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontFamily: '"DM Mono", monospace',
                    fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '5px 10px',
                    background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    color: '#c9a84c',
                  }}>
                    {tag}
                    <button
                      type="button" onClick={() => removeTag(tag)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex' }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: '36px', display: 'flex', gap: '12px' }}>
          <button
            type="submit" disabled={loading}
            style={{
              padding: '14px 36px',
              background: loading ? 'rgba(201,168,76,0.5)' : '#c9a84c',
              color: '#0a0a0f', border: 'none',
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.72rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create & Add Files →'}
          </button>
          <Link to="/admin/projects" style={{
            padding: '14px 24px',
            border: '1px solid rgba(245,240,232,0.15)',
            color: 'rgba(245,240,232,0.5)', textDecoration: 'none',
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center',
          }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
