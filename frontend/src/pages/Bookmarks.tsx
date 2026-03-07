import { BookOpen, Trash2 } from 'lucide-react'
import './Bookmarks.css'

export default function Bookmarks() {
  // Placeholder — bookmarks are local state for now
  const bookmarks: { verse: string; text: string }[] = []

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
          {bookmarks.map((bm, i) => (
            <div key={i} className="bookmark-card">
              <div className="bookmark-verse">{bm.verse}</div>
              <p className="bookmark-text">{bm.text}</p>
              <button className="bookmark-remove">
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
