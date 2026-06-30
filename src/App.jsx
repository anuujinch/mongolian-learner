import { useState } from 'react'
import Nav from './components/Nav'
import WordSearch from './components/WordSearch'
import ReadingRoom from './components/ReadingRoom'

export default function App() {
  const [page, setPage] = useState('search')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav page={page} setPage={setPage} />
      <main>
        {page === 'search' ? <WordSearch /> : <ReadingRoom />}
      </main>
    </div>
  )
}
