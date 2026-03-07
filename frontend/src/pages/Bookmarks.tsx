import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Trash2, ExternalLink } from 'lucide-react'
import { authFetch } from '../utils/authFetch'
import './Bookmarks.css'

interface Bookmark {
  verseNumber: string
  chapterNumber: number
  chapterName: string
  sanskrit: string
  transliteration: string
  meaning: string
  timestamp: number
}

interface BookmarksProps {
  token: string
}

export default function Bookmarks({ token }: BookmarksProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_API_URL || '/api'

  useEffect(() => {
    loadBookmarks()

    const onBookmarksUpdated = () => loadBookmarks()

    window.addEventListener('bookmarks-updated', onBookmarksUpdated)

    return () => {
      window.removeEventListener('bookmarks-updated', onBookmarksUpdated)
    }
  }, [token])

  async function loadBookmarks() {
    try {
      const response = await authFetch(`${apiBase}/bookmarks`)

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.details || err?.message || 'Failed to fetch bookmarks')
      }

      const parsed = await response.json()
      setBookmarks(
        (Array.isArray(parsed) ? parsed : [])
          .sort((a: Bookmark, b: Bookmark) => b.timestamp - a.timestamp)
      )
    } catch (e) {
      console.error('Failed to load bookmarks:', e)
      setBookmarks([])
    }
  }

  async function removeBookmark(verseNumber: string) {
    try {
      const response = await authFetch(`${apiBase}/bookmarks/${encodeURIComponent(verseNumber)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.details || err?.message || 'Failed to remove bookmark')
      }

      setBookmarks((prev) => prev.filter((b) => b.verseNumber !== verseNumber))
      window.dispatchEvent(new Event('bookmarks-updated'))
    } catch (error) {
      console.error('Failed to remove bookmark:', error)
      alert('Unable to remove bookmark right now. Please try again.')
    }
  }

  function goToVerse(chapterNumber: number) {
    // Save the chapter to navigate to
    localStorage.setItem('gita_last_read', JSON.stringify({
      chapterIndex: chapterNumber - 1,
      chapterNumber: chapterNumber,
      timestamp: Date.now(),
    }))
    navigate('/gita-path')
  }

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-page-header">
        <h1>Bookmarks</h1>
        <p>Your sacred collection of wisdom</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bookmarks-empty">
          <BookOpen size={48} strokeWidth={1} className="bookmarks-empty-icon" />
          <h3>The library awaits</h3>
          <p>
            Bookmark shlokas from the Gita Path to build your personal collection
            of divine wisdom. Each saved verse shall appear here, preserved like
            scripture upon sacred leaf.
          </p>
        </div>
      ) : (
        <div className="bookmarks-list">
          {bookmarks.map((bm) => (
            <div key={bm.verseNumber} className="bookmark-card">
              <div className="bookmark-header">
                <span className="bookmark-verse">Verse {bm.verseNumber}</span>
                <span className="bookmark-chapter">Chapter {bm.chapterNumber}: {bm.chapterName}</span>
              </div>
              <p className="bookmark-sanskrit">{bm.sanskrit}</p>
              <p className="bookmark-transliteration">{bm.transliteration}</p>
              <p className="bookmark-text">{bm.meaning}</p>
              <div className="bookmark-actions">
                <button 
                  className="bookmark-goto"
                  onClick={() => goToVerse(bm.chapterNumber)}
                  title="Go to this chapter"
                >
                  <ExternalLink size={14} strokeWidth={1.5} />
                  <span>Continue Reading</span>
                </button>
                <button 
                  className="bookmark-remove"
                  onClick={() => removeBookmark(bm.verseNumber)}
                  title="Remove bookmark"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
