import { Link } from 'react-router-dom';

const bars = [40, 80, 55, 100, 70, 130, 90, 160, 110, 185];

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '0 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px', pointerEvents: 'none',
        }} />

        {/* Animated bar chart */}
        <div style={{
          position: 'absolute', right: '80px', bottom: '80px',
          display: 'flex', alignItems: 'flex-end', gap: '8px', opacity: 0.1,
        }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              width: '16px', height: h + 'px',
              background: 'linear-gradient(to top, #c9a84c, #e8d08a)',
              borderRadius: '2px 2px 0 0',
              animation: `barRise 1.5s ${i * 0.08}s ease forwards`,
              transform: 'scaleY(0)', transformOrigin: 'bottom',
            }} />
          ))}
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', maxWidth: '800px' }}>
          <p style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.65rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#c9a84c',
            marginBottom: '24px',
            animation: 'fadeUp 0.8s 0.2s ease forwards', opacity: 0,
          }}>
            Financial Strategist & Analyst
          </p>

          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 900, lineHeight: 1.02,
            letterSpacing: '-0.02em', marginBottom: '28px',
            animation: 'fadeUp 0.8s 0.4s ease forwards', opacity: 0,
          }}>
            Turning numbers<br />into{' '}
            <em style={{ fontStyle: 'italic', color: '#c9a84c' }}>clarity</em>
          </h1>

          <p style={{
            fontSize: '1.05rem', lineHeight: 1.8,
            color: 'rgba(245,240,232,0.6)',
            maxWidth: '500px', marginBottom: '44px',
            animation: 'fadeUp 0.8s 0.6s ease forwards', opacity: 0,
          }}>
            Independent financial consultant specializing in investment analysis,
            financial modeling, and strategic planning for mid-market enterprises.
          </p>

          <div style={{
            display: 'flex', gap: '16px',
            animation: 'fadeUp 0.8s 0.8s ease forwards', opacity: 0,
          }}>
            <Link to="/projects" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#c9a84c', color: '#0a0a0f',
              padding: '14px 32px',
              fontFamily: '"DM Mono", monospace',
              fontSize: '0.72rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', textDecoration: 'none',
              fontWeight: 500,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(201,168,76,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              View My Work →
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          position: 'absolute', right: '60px', top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: '32px',
          animation: 'fadeIn 1s 1s ease forwards', opacity: 0,
        }}>
          {[['$2.4B', 'Assets Analyzed'], ['140+', 'Clients Served'], ['12yr', 'Experience']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '2.2rem', fontWeight: 700, color: '#c9a84c', lineHeight: 1,
              }}>{num}</div>
              <div style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '0.58rem', letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,232,0.35)', marginTop: '4px',
              }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services strip */}
      <section style={{
        padding: '80px 60px',
        borderTop: '1px solid rgba(201,168,76,0.12)',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px', border: '1px solid rgba(201,168,76,0.12)',
        }}>
          {[
            { icon: '📊', title: 'Financial Modeling', desc: 'Dynamic Excel models — DCF, LBO, M&A, three-statement — built for accuracy and board-level presentation.' },
            { icon: '📑', title: 'Investment Research', desc: 'Comprehensive equity and credit research reports with clear thesis, valuation, and risk-adjusted recommendations.' },
            { icon: '📈', title: 'Strategic Presentations', desc: 'Pitch decks, investor updates, and board presentations that tell the right story with the right data.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              padding: '44px 32px',
              borderRight: '1px solid rgba(201,168,76,0.12)',
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{icon}</div>
              <div style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px',
              }}>{title}</div>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.75, color: 'rgba(245,240,232,0.5)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
