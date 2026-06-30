import { useState } from 'react'
import { articles } from '../data/articles'

const CATEGORIES = ['All', ...new Set(articles.map(a => a.category))]

const DIFF_COLOR = {
  Beginner:     { bg: '#e6f7ee', color: '#14783e' },
  Intermediate: { bg: '#fff8e1', color: '#b45309' },
  Advanced:     { bg: '#fdeaea', color: '#c4272f' },
}

function ArticleCard({ article, onClick }) {
  const [hovered, setHovered] = useState(false)
  const dc = DIFF_COLOR[article.difficulty] || DIFF_COLOR.Beginner

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card"
      style={{
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow)',
        overflow: 'hidden',
      }}
    >
      {/* Color bar */}
      <div style={{
        height: 5,
        background: `linear-gradient(90deg, ${article.color}, ${article.color}88)`,
      }} />

      <div style={{ padding: '20px 22px' }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <span style={{
            fontSize: '2.2rem', lineHeight: 1,
            filter: hovered ? 'none' : 'saturate(0.85)',
            transition: 'filter 0.2s',
          }}>
            {article.emoji}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span className="badge badge-blue" style={{ background: `${article.color}18`, color: article.color }}>
              {article.category}
            </span>
            <span style={{ ...dc, padding: '2px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700 }}>
              {article.difficulty}
            </span>
          </div>
        </div>

        {/* Titles */}
        <div style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.35, marginBottom: 4 }}>
          {article.title}
        </div>
        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 12 }}>
          {article.titleMn}
        </div>

        {/* Preview */}
        <div style={{
          color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {article.sections[0].english}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 14, paddingTop: 12,
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            🕐 {article.readTime}
          </span>
          <span style={{
            fontSize: '0.8rem', fontWeight: 700,
            color: hovered ? article.color : 'var(--text-muted)',
            transition: 'color 0.2s',
          }}>
            Read article →
          </span>
        </div>
      </div>
    </div>
  )
}

function ArticleView({ article, onClose }) {
  const [lang, setLang] = useState('both') // 'both' | 'en' | 'mn'

  return (
    <div className="fade-up">
      {/* Back / article header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: '8px 16px', fontWeight: 700,
            color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          ← Back
        </button>

        {/* Language toggle */}
        <div style={{
          display: 'flex', gap: 4,
          background: 'var(--bg2)', padding: 4, borderRadius: 20,
          border: '1px solid var(--border)',
        }}>
          {[
            { id: 'both', label: 'EN | МН' },
            { id: 'en',   label: '🇬🇧 English' },
            { id: 'mn',   label: '🇲🇳 Монгол' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setLang(id)}
              style={{
                padding: '6px 14px', borderRadius: 16,
                border: 'none', fontSize: '0.8rem', fontWeight: 700,
                background: lang === id ? 'var(--card)' : 'transparent',
                color: lang === id ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: lang === id ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Article hero */}
      <div className="card" style={{
        padding: '28px 32px', marginBottom: 24,
        background: `linear-gradient(140deg, ${article.color}15 0%, ${article.color}05 100%)`,
        borderTop: `4px solid ${article.color}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <span style={{ fontSize: '3rem' }}>{article.emoji}</span>
          <div>
            <div style={{
              display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap',
            }}>
              <span className="badge" style={{
                background: `${article.color}18`, color: article.color,
              }}>{article.category}</span>
              <span style={{
                ...DIFF_COLOR[article.difficulty],
                padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
              }}>{article.difficulty}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, paddingTop: 2 }}>
                🕐 {article.readTime}
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', lineHeight: 1.2, marginBottom: 4 }}>
              {article.title}
            </div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>
              {article.titleMn}
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      {article.sections.map((section, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          {lang === 'both' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* English */}
              <div className="card" style={{ padding: '20px 22px' }}>
                <div style={{
                  fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em',
                  color: 'var(--text-muted)', marginBottom: 10,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  🇬🇧 ENGLISH
                </div>
                <p style={{ lineHeight: 1.75, fontSize: '0.93rem' }}>{section.english}</p>
              </div>

              {/* Mongolian */}
              <div className="card" style={{
                padding: '20px 22px',
                background: 'var(--primary-light)',
                border: '1px solid #c4d9f0',
              }}>
                <div style={{
                  fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em',
                  color: 'var(--primary)', marginBottom: 10,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  🇲🇳 МОНГОЛ
                </div>
                <p style={{ lineHeight: 1.75, fontSize: '0.93rem', color: 'var(--primary)', fontWeight: 600 }}>
                  {section.mongolian}
                </p>
              </div>
            </div>
          ) : (
            <div className="card" style={{
              padding: '22px 26px',
              background: lang === 'mn' ? 'var(--primary-light)' : 'var(--card)',
              border: lang === 'mn' ? '1px solid #c4d9f0' : '1px solid var(--border)',
            }}>
              <div style={{
                fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em',
                color: lang === 'mn' ? 'var(--primary)' : 'var(--text-muted)',
                marginBottom: 10,
              }}>
                {lang === 'mn' ? '🇲🇳 МОНГОЛ' : '🇬🇧 ENGLISH'}
              </div>
              <p style={{
                lineHeight: 1.75, fontSize: '0.95rem',
                color: lang === 'mn' ? 'var(--primary)' : 'var(--text)',
                fontWeight: lang === 'mn' ? 600 : 400,
              }}>
                {lang === 'mn' ? section.mongolian : section.english}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ReadingRoom() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [openArticle, setOpenArticle] = useState(null)

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  if (openArticle) {
    return (
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '36px 20px 60px' }}>
        <ArticleView
          article={openArticle}
          onClose={() => setOpenArticle(null)}
        />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '36px 20px 60px' }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: 4 }}>
          📖 Reading Room
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Learn Mongolian through bilingual articles — switch between English and Монгол at any time.
        </p>
      </div>

      {/* Category filter */}
      <div className="fade-up" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 18px', borderRadius: 20,
              fontWeight: 700, fontSize: '0.82rem',
              background: activeCategory === cat ? 'var(--primary)' : 'var(--card)',
              color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
              boxShadow: activeCategory === cat ? '0 2px 12px rgba(1,79,158,0.25)' : 'var(--shadow-sm)',
              border: `1px solid ${activeCategory === cat ? 'var(--primary)' : 'var(--border)'}`,
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {filtered.map((article, i) => (
          <div key={article.id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <ArticleCard
              article={article}
              onClick={() => setOpenArticle(article)}
            />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 700 }}>No articles in this category yet</div>
        </div>
      )}
    </div>
  )
}
