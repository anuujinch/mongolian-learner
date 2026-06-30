import { useState, useRef } from 'react'
import { translateWord, getWordDefinition, buildContextExamples } from '../services/api'
import { wordOfDay } from '../data/wordOfDay'

const todayWord = wordOfDay[new Date().getDate() % wordOfDay.length]

function Spinner() {
  return (
    <span style={{
      display: 'inline-block',
      width: 18, height: 18,
      border: '3px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      verticalAlign: 'middle',
    }} />
  )
}

function PartOfSpeechBadge({ pos }) {
  const colorMap = {
    noun: 'badge-blue',
    verb: 'badge-red',
    adjective: 'badge-gold',
    adverb: 'badge-green',
    pronoun: 'badge-purple',
  }
  return <span className={`badge ${colorMap[pos] || 'badge-blue'}`}>{pos}</span>
}

export default function WordSearch() {
  const [query, setQuery]     = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [tab, setTab]         = useState('definition')
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mn_history') || '[]') }
    catch { return [] }
  })
  const inputRef = useRef(null)

  async function handleSearch(word) {
    const q = (word ?? query).trim().toLowerCase()
    if (!q) { inputRef.current?.focus(); return }

    setLoading(true)
    setError(null)
    setResult(null)
    setTab('definition')
    if (!word) {} // keep user's typed text

    try {
      const [translation, definition] = await Promise.all([
        translateWord(q),
        getWordDefinition(q),
      ])

      let examples = []
      try {
        examples = await buildContextExamples(q, definition)
      } catch (_) { /* ignore */ }

      const next = { word: q, translation, definition, examples }
      setResult(next)

      const newHist = [
        { word: q, translation },
        ...history.filter(h => h.word !== q),
      ].slice(0, 12)
      setHistory(newHist)
      localStorage.setItem('mn_history', JSON.stringify(newHist))
    } catch (err) {
      setError("Couldn't translate that word. Check the spelling and try again!")
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
  }

  function clearResult() {
    setResult(null)
    setError(null)
    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const phonetic = result?.definition?.phonetics?.find(p => p.text)?.text

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '36px 20px 60px' }}>

      {/* Word of the Day banner */}
      <div className="card fade-up" style={{
        padding: '20px 24px',
        marginBottom: 28,
        background: 'linear-gradient(130deg, var(--primary) 0%, #0267c1 100%)',
        border: 'none',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 100, height: 100,
          background: 'rgba(245,197,24,0.12)',
          borderRadius: '50%',
        }} />
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', opacity: 0.65, marginBottom: 6 }}>
          ✨ WORD OF THE DAY
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, lineHeight: 1.15 }}>{todayWord.mongolian}</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.75, marginTop: 2 }}>{todayWord.english}</div>
            <div style={{ fontSize: '0.82rem', opacity: 0.6, marginTop: 4, fontStyle: 'italic' }}>{todayWord.definition}</div>
          </div>
          <button
            onClick={() => { setQuery(todayWord.english); handleSearch(todayWord.english) }}
            style={{
              background: 'var(--gold)',
              color: 'var(--primary)',
              border: 'none', borderRadius: 20,
              padding: '9px 20px',
              fontWeight: 800, fontSize: '0.85rem',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(245,197,24,0.4)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Explore →
          </button>
        </div>
      </div>

      {/* Search box */}
      <div className="card fade-up" style={{ padding: '22px 24px', marginBottom: 24, animationDelay: '0.05s' }}>
        <label style={{
          display: 'block',
          fontSize: '0.7rem', fontWeight: 800,
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          marginBottom: 10,
        }}>
          ENGLISH → MONGOLIAN CYRILLIC
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type any English word…"
            autoFocus
            style={{
              flex: 1,
              padding: '13px 18px',
              borderRadius: 'var(--radius-sm)',
              border: '2px solid var(--border)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text)',
              background: 'var(--bg)',
              outline: 'none',
              transition: 'border-color 0.18s',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            style={{
              padding: '13px 22px',
              background: loading ? '#93b8de' : 'var(--primary)',
              color: '#fff',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontWeight: 800, fontSize: '0.95rem',
              minWidth: 100, transition: 'background 0.2s, transform 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--primary-dark)' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--primary)' }}
          >
            {loading ? <Spinner /> : 'Search'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card pop" style={{
          padding: '18px 22px',
          background: 'var(--red-light)',
          border: '1px solid #fca5a5',
          color: 'var(--red)',
          fontWeight: 600,
          marginBottom: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>⚠️ {error}</span>
          <button onClick={clearResult} style={{ background: 'none', border: 'none', color: 'var(--red)', fontWeight: 800, fontSize: '1rem' }}>✕</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="card fade-up" style={{ padding: 28 }}>
          <div className="skeleton" style={{ height: 36, width: '50%', marginBottom: 14 }} />
          <div className="skeleton" style={{ height: 18, width: '80%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 18, width: '55%' }} />
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="pop">
          <div className="card" style={{ padding: 28, marginBottom: 16, position: 'relative' }}>
            {/* Close */}
            <button
              onClick={clearResult}
              style={{
                position: 'absolute', top: 18, right: 18,
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: '50%', width: 30, height: 30,
                fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>

            {/* Translation hero */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{
                    fontSize: '2.4rem', fontWeight: 800,
                    color: 'var(--primary)', letterSpacing: '0.01em', lineHeight: 1.1,
                  }}>
                    {result.translation}
                  </div>
                  {phonetic && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
                      {phonetic}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, paddingTop: 6 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>
                    {result.word}
                  </div>
                  {result.definition?.meanings?.[0]?.partOfSpeech && (
                    <PartOfSpeechBadge pos={result.definition.meanings[0].partOfSpeech} />
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', marginBottom: 20,
            }}>
              {['definition', 'examples'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: '9px 18px',
                    border: 'none', background: 'none',
                    fontWeight: 700, fontSize: '0.85rem',
                    color: tab === t ? 'var(--primary)' : 'var(--text-muted)',
                    borderBottom: tab === t ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                    marginBottom: -1,
                    transition: 'color 0.15s',
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                  }}
                >
                  {t === 'definition' ? '📚 Definition' : '💬 In Context'}
                </button>
              ))}
            </div>

            {/* Definition panel */}
            {tab === 'definition' && (
              <div>
                {result.definition ? (
                  result.definition.meanings?.slice(0, 3).map((m, mi) => (
                    <div key={mi} style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 10 }}>
                        <PartOfSpeechBadge pos={m.partOfSpeech} />
                      </div>
                      {m.definitions?.slice(0, 2).map((d, di) => (
                        <div key={di} style={{
                          paddingLeft: 14,
                          borderLeft: '3px solid var(--primary-light)',
                          marginBottom: 10,
                        }}>
                          <div style={{ lineHeight: 1.65 }}>{d.definition}</div>
                          {d.example && (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem', fontStyle: 'italic', marginTop: 4 }}>
                              "{d.example}"
                            </div>
                          )}
                        </div>
                      ))}
                      {m.synonyms?.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: 6, fontWeight: 700 }}>
                            SYNONYMS
                          </span>
                          {m.synonyms.slice(0, 6).map(syn => (
                            <button
                              key={syn}
                              onClick={() => { setQuery(syn); handleSearch(syn) }}
                              style={{
                                background: 'var(--bg)', border: '1px solid var(--border)',
                                borderRadius: 12, padding: '2px 10px', margin: '2px 3px',
                                fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600,
                                cursor: 'pointer', transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-light)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
                            >
                              {syn}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.7 }}>
                    No dictionary entry found for this word — the Mongolian translation is shown above.
                    Try searching in the Reading Room for more context.
                  </div>
                )}
              </div>
            )}

            {/* Examples panel */}
            {tab === 'examples' && (
              <div>
                {result.examples.length > 0 ? (
                  result.examples.map((ex, i) => (
                    <div key={i} className="card" style={{
                      padding: '16px 18px', marginBottom: 12,
                      background: 'var(--bg)', border: '1px solid var(--border)',
                    }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                        <span className="badge badge-blue" style={{ flexShrink: 0, marginTop: 2 }}>EN</span>
                        <span style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>{ex.english}</span>
                      </div>
                      <div style={{
                        width: '100%', height: 1,
                        background: 'var(--border)', margin: '10px 0',
                      }} />
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span className="badge badge-red" style={{ flexShrink: 0, marginTop: 2 }}>МН</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700, lineHeight: 1.6, fontSize: '0.95rem' }}>{ex.mongolian}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No example sentences available.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* History — shown when idle */}
      {!result && !loading && history.length > 0 && (
        <div className="card fade-up" style={{ padding: '20px 24px', animationDelay: '0.1s' }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)',
            letterSpacing: '0.12em', marginBottom: 12,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>RECENT SEARCHES</span>
            <button
              onClick={() => { setHistory([]); localStorage.removeItem('mn_history') }}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {history.map(({ word, translation }) => (
              <button
                key={word}
                onClick={() => { setQuery(word); handleSearch(word) }}
                style={{
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 20, padding: '7px 14px',
                  display: 'flex', alignItems: 'center', gap: 7,
                  fontSize: '0.875rem', color: 'var(--text)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--primary-light)'
                  e.currentTarget.style.borderColor = 'var(--primary)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--bg)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >
                <span>{word}</span>
                <span style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>→</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{translation}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state hint */}
      {!result && !loading && !error && history.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 40, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🐎</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: 6 }}>
            Start exploring Mongolian
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            Type any English word above to see its Cyrillic translation,<br />
            definition, and usage examples.
          </div>
        </div>
      )}
    </div>
  )
}
