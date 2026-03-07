import { useState, useEffect, useRef } from 'react'
import { ChevronRight, BookmarkPlus, BookmarkCheck, Volume2, VolumeX, Loader } from 'lucide-react'
import { authFetch } from '../utils/authFetch'
import './GitaPath.css'

interface Shloka {
  number: string
  sanskrit: string
  transliteration: string
  meaning: string
  audioUrl?: string
}

interface Chapter {
  number: number
  name: string
  sanskritName: string
  summary: string
  verseCount: number
  shlokas: Shloka[]
}

interface Bookmark {
  verseNumber: string
  chapterNumber: number
  chapterName: string
  sanskrit: string
  transliteration: string
  meaning: string
  timestamp: number
}

const STORAGE_KEYS = {
  LAST_READ: 'gita_last_read',
}

interface GitaPathProps {
  token: string
}

// Complete chapter metadata
const CHAPTER_INFO: Omit<Chapter, 'shlokas'>[] = [
  { number: 1, name: 'Arjuna\'s Dilemma', sanskritName: 'Arjuna Vishada Yoga', summary: 'On the battlefield of Kurukshetra, Arjuna is overwhelmed by sorrow and moral confusion.', verseCount: 47 },
  { number: 2, name: 'Transcendental Knowledge', sanskritName: 'Sankhya Yoga', summary: 'Krishna reveals the immortality of the soul and the path of selfless action.', verseCount: 72 },
  { number: 3, name: 'The Yoga of Action', sanskritName: 'Karma Yoga', summary: 'Krishna explains performing one\'s duty without attachment to results.', verseCount: 43 },
  { number: 4, name: 'Transcendental Knowledge', sanskritName: 'Jnana Karma Sanyasa Yoga', summary: 'The science of self-realization and divine incarnations.', verseCount: 42 },
  { number: 5, name: 'Karma Sanyasa Yoga', sanskritName: 'Karma Sanyasa Yoga', summary: 'The paths of renunciation and selfless service leading to the same goal.', verseCount: 29 },
  { number: 6, name: 'The Yoga of Meditation', sanskritName: 'Dhyana Yoga', summary: 'The eightfold path of yoga and meditation for self-realization.', verseCount: 47 },
  { number: 7, name: 'Knowledge of the Absolute', sanskritName: 'Jnana Vijnana Yoga', summary: 'Krishna reveals His divine nature and manifestations.', verseCount: 30 },
  { number: 8, name: 'Attaining the Supreme', sanskritName: 'Aksara Brahma Yoga', summary: 'The nature of the Supreme and the path after death.', verseCount: 28 },
  { number: 9, name: 'The Most Confidential Knowledge', sanskritName: 'Raja Vidya Raja Guhya Yoga', summary: 'The most confidential knowledge about devotional service.', verseCount: 34 },
  { number: 10, name: 'The Opulence of the Absolute', sanskritName: 'Vibhuti Yoga', summary: 'Krishna describes His divine glories throughout creation.', verseCount: 42 },
  { number: 11, name: 'The Universal Form', sanskritName: 'Vishvarupa Darshana Yoga', summary: 'Arjuna beholds the awe-inspiring universal form of Krishna.', verseCount: 55 },
  { number: 12, name: 'The Yoga of Devotion', sanskritName: 'Bhakti Yoga', summary: 'The path of devotion and qualities of a true devotee.', verseCount: 20 },
  { number: 13, name: 'Nature, the Enjoyer, and Consciousness', sanskritName: 'Kshetra Kshetrajna Vibhaga Yoga', summary: 'The distinction between body (field) and soul (knower).', verseCount: 35 },
  { number: 14, name: 'The Three Modes of Material Nature', sanskritName: 'Gunatraya Vibhaga Yoga', summary: 'The three modes: goodness, passion, and ignorance.', verseCount: 27 },
  { number: 15, name: 'The Yoga of the Supreme Person', sanskritName: 'Purushottama Yoga', summary: 'The eternal tree of life and the Supreme Personality.', verseCount: 20 },
  { number: 16, name: 'The Divine and Demoniac Natures', sanskritName: 'Daivasura Sampad Vibhaga Yoga', summary: 'Divine and demoniac natures and their destinies.', verseCount: 24 },
  { number: 17, name: 'The Divisions of Faith', sanskritName: 'Shraddhatraya Vibhaga Yoga', summary: 'How the three modes influence faith, worship, and austerities.', verseCount: 28 },
  { number: 18, name: 'Conclusion - The Perfection of Renunciation', sanskritName: 'Moksha Sanyasa Yoga', summary: 'Complete surrender to the Divine - the ultimate teaching.', verseCount: 78 },
]

export default function GitaPath({ token }: GitaPathProps) {
  const [activeChapter, setActiveChapter] = useState(0)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [playingVerse, setPlayingVerse] = useState<string | null>(null)
  const [verses, setVerses] = useState<Shloka[]>([])
  const [loading, setLoading] = useState(false)
  const apiBase = import.meta.env.VITE_API_URL || '/api'
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const chapterInfo = CHAPTER_INFO[activeChapter]

  async function loadBookmarks() {
    try {
      const response = await authFetch(`${apiBase}/bookmarks`)

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.details || err?.message || 'Failed to load bookmarks')
      }

      const data = await response.json()
      setBookmarks(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to load bookmarks:', e)
      setBookmarks([])
    }
  }

  // Fetch verses for active chapter
  useEffect(() => {
    async function fetchVerses() {
      setLoading(true)
      try {
        // Using our own backend API
        const response = await fetch(`${apiBase}/gita/chapters/${chapterInfo.number}/verses`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch verses')
        }
        
        const data = await response.json()
        
        // Transform API data to our format
        const transformedVerses: Shloka[] = data.map((verse: any) => ({
          number: `${verse.chapterNumber}.${verse.verseNumber}`,
          sanskrit: verse.sanskrit,
          transliteration: verse.transliteration,
          meaning: verse.meaning,
          audioUrl: verse.audioUrl || null,
        }))

        setVerses(transformedVerses)
      } catch (error) {
        console.error('Error fetching verses:', error)
        // Fallback: create placeholder verses
        const placeholderVerses: Shloka[] = Array.from({ length: chapterInfo.verseCount }, (_, i) => ({
          number: `${chapterInfo.number}.${i + 1}`,
          sanskrit: 'Loading verse...',
          transliteration: 'Loading transliteration...',
          meaning: 'Loading meaning...',
        }))
        setVerses(placeholderVerses)
      } finally {
        setLoading(false)
      }
    }

    fetchVerses()
  }, [activeChapter, chapterInfo.number, chapterInfo.verseCount])

  // Load bookmarks from backend
  useEffect(() => {
    loadBookmarks()

    const onBookmarksUpdated = () => loadBookmarks()

    window.addEventListener('bookmarks-updated', onBookmarksUpdated)

    // Load last read position
    const lastRead = localStorage.getItem(STORAGE_KEYS.LAST_READ)
    if (lastRead) {
      try {
        const { chapterIndex } = JSON.parse(lastRead)
        if (chapterIndex >= 0 && chapterIndex < CHAPTER_INFO.length) {
          setActiveChapter(chapterIndex)
        }
      } catch (e) {
        console.error('Failed to load last read position:', e)
      }
    }

    return () => {
      window.removeEventListener('bookmarks-updated', onBookmarksUpdated)
    }
  }, [token])

  // Save last read position
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.LAST_READ,
      JSON.stringify({
        chapterIndex: activeChapter,
        chapterNumber: chapterInfo.number,
        timestamp: Date.now(),
      })
    )
  }, [activeChapter, chapterInfo.number])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  function isBookmarked(verseNumber: string): boolean {
    return bookmarks.some(b => b.verseNumber === verseNumber)
  }

  async function toggleBookmark(shloka: Shloka) {
    const verseNumber = shloka.number
    const existing = bookmarks.find((b) => b.verseNumber === verseNumber)

    try {
      if (existing) {
        const response = await authFetch(`${apiBase}/bookmarks/${encodeURIComponent(verseNumber)}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const err = await response.json().catch(() => ({}))
          throw new Error(err?.details || err?.message || 'Failed to remove bookmark')
        }

        setBookmarks((prev) => prev.filter((b) => b.verseNumber !== verseNumber))
      } else {
        const payload = {
          verseNumber,
          chapterNumber: chapterInfo.number,
          chapterName: chapterInfo.name,
          sanskrit: shloka.sanskrit,
          transliteration: shloka.transliteration,
          meaning: shloka.meaning,
        }

        const response = await authFetch(`${apiBase}/bookmarks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const err = await response.json().catch(() => ({}))
          throw new Error(err?.details || err?.message || 'Failed to save bookmark')
        }

        const savedBookmark = await response.json()
        setBookmarks((prev) => {
          const withoutExisting = prev.filter((b) => b.verseNumber !== verseNumber)
          return [...withoutExisting, savedBookmark]
        })
      }

      window.dispatchEvent(new Event('bookmarks-updated'))
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      alert('Unable to update bookmark right now. Please try again.')
    }
  }

  function playAudio(shloka: Shloka) {
    const verseNumber = shloka.number

    // If already playing this verse, stop it
    if (playingVerse === verseNumber && audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      setPlayingVerse(null)
      return
    }

    // Stop any ongoing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    if (!shloka.audioUrl) {
      alert('Audio not available for this verse')
      return
    }

    // Create new audio element
    const audio = new Audio(shloka.audioUrl)
    audioRef.current = audio

    audio.onplay = () => {
      setPlayingVerse(verseNumber)
    }

    audio.onended = () => {
      setPlayingVerse(null)
      audioRef.current = null
    }

    audio.onerror = () => {
      setPlayingVerse(null)
      audioRef.current = null
      alert('Unable to play audio. Audio file may not be available.')
    }

    audio.play().catch(err => {
      console.error('Error playing audio:', err)
      setPlayingVerse(null)
      audioRef.current = null
    })
  }

  return (
    <div className="gita-page">
      <div className="gita-page-header">
        <h1>Gita Path</h1>
        <p>The eternal song of the divine</p>
      </div>

      <div className="gita-layout">
        {/* Chapter Nav */}
        <nav className="gita-chapters">
          <h3>All 18 Chapters</h3>
          {CHAPTER_INFO.map((ch, idx) => (
            <button
              key={ch.number}
              className={`chapter-btn ${activeChapter === idx ? 'active' : ''}`}
              onClick={() => setActiveChapter(idx)}
            >
              <span className="chapter-num">{ch.number}</span>
              <div className="chapter-meta">
                <span className="chapter-name">{ch.name}</span>
                <span className="chapter-sanskrit">{ch.sanskritName}</span>
              </div>
              <ChevronRight size={14} strokeWidth={1.5} className="chapter-arrow" />
            </button>
          ))}
        </nav>

        {/* Shloka Display */}
        <div className="gita-content">
          <div className="gita-content-header">
            <div>
              <h2>Chapter {chapterInfo.number}: {chapterInfo.name}</h2>
              <span className="gita-sanskrit-title">{chapterInfo.sanskritName}</span>
            </div>
            <span className="verse-count">{chapterInfo.verseCount} verses</span>
          </div>
          <p className="gita-chapter-summary">{chapterInfo.summary}</p>

          {loading ? (
            <div className="loading-verses">
              <Loader className="spinner" size={32} />
              <p>Loading verses...</p>
            </div>
          ) : (
            <div className="shloka-list">
              {verses.map((shloka) => {
                const isPlaying = playingVerse === shloka.number
                const marked = isBookmarked(shloka.number)
                
                return (
                  <div key={shloka.number} className="shloka-card">
                    <div className="shloka-top">
                      <span className="shloka-number">Verse {shloka.number}</span>
                      <div className="shloka-actions">
                        <button
                          className={`shloka-action ${marked ? 'bookmarked' : ''}`}
                          onClick={() => toggleBookmark(shloka)}
                          title={marked ? 'Remove bookmark' : 'Bookmark this verse'}
                        >
                          {marked
                            ? <BookmarkCheck size={16} strokeWidth={1.5} />
                            : <BookmarkPlus size={16} strokeWidth={1.5} />}
                        </button>
                        <button 
                          className={`shloka-action ${isPlaying ? 'playing' : ''}`} 
                          onClick={() => playAudio(shloka)}
                          title={isPlaying ? 'Stop audio' : 'Listen to Sanskrit recitation'}
                        >
                          {isPlaying 
                            ? <VolumeX size={16} strokeWidth={1.5} />
                            : <Volume2 size={16} strokeWidth={1.5} />}
                        </button>
                      </div>
                    </div>
                    <p className="shloka-sanskrit">{shloka.sanskrit}</p>
                    <p className="shloka-transliteration">{shloka.transliteration}</p>
                    <p className="shloka-meaning">{shloka.meaning}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
