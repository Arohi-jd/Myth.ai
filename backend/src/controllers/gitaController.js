import { supabase } from '../lib/supabase.js'
import { scrapeChapterVerses } from '../lib/gitaScraper.js'

const chapterCache = new Map()

const CHAPTER_METADATA = [
  { chapterNumber: 1, chapterName: "Arjuna's Dilemma", sanskritName: 'Arjuna Vishada Yoga', summary: 'Arjuna is overwhelmed by sorrow and moral confusion on the battlefield.', verseCount: 47 },
  { chapterNumber: 2, chapterName: 'Transcendental Knowledge', sanskritName: 'Sankhya Yoga', summary: 'Krishna reveals the immortality of the soul and the path of selfless action.', verseCount: 72 },
  { chapterNumber: 3, chapterName: 'The Yoga of Action', sanskritName: 'Karma Yoga', summary: "Perform one’s duty without attachment to outcomes.", verseCount: 43 },
  { chapterNumber: 4, chapterName: 'Transcendental Knowledge', sanskritName: 'Jnana Karma Sanyasa Yoga', summary: 'The science of divine knowledge and action.', verseCount: 42 },
  { chapterNumber: 5, chapterName: 'Karma Sanyasa Yoga', sanskritName: 'Karma Sanyasa Yoga', summary: 'Renunciation and selfless action lead to the same goal.', verseCount: 29 },
  { chapterNumber: 6, chapterName: 'The Yoga of Meditation', sanskritName: 'Dhyana Yoga', summary: 'Discipline of mind and meditation for union with the Divine.', verseCount: 47 },
  { chapterNumber: 7, chapterName: 'Knowledge of the Absolute', sanskritName: 'Jnana Vijnana Yoga', summary: 'Krishna explains His divine nature and energies.', verseCount: 30 },
  { chapterNumber: 8, chapterName: 'Attaining the Supreme', sanskritName: 'Aksara Brahma Yoga', summary: 'How remembrance of God leads to liberation.', verseCount: 28 },
  { chapterNumber: 9, chapterName: 'The Most Confidential Knowledge', sanskritName: 'Raja Vidya Raja Guhya Yoga', summary: 'The highest secret of loving devotion.', verseCount: 34 },
  { chapterNumber: 10, chapterName: 'The Opulence of the Absolute', sanskritName: 'Vibhuti Yoga', summary: 'Krishna describes His divine manifestations.', verseCount: 42 },
  { chapterNumber: 11, chapterName: 'The Universal Form', sanskritName: 'Vishvarupa Darshana Yoga', summary: 'Arjuna beholds Krishna’s cosmic form.', verseCount: 55 },
  { chapterNumber: 12, chapterName: 'The Yoga of Devotion', sanskritName: 'Bhakti Yoga', summary: 'The path and qualities of true devotion.', verseCount: 20 },
  { chapterNumber: 13, chapterName: 'Nature, the Enjoyer, and Consciousness', sanskritName: 'Kshetra Kshetrajna Vibhaga Yoga', summary: 'Distinction between body, soul, and Supreme Soul.', verseCount: 35 },
  { chapterNumber: 14, chapterName: 'The Three Modes of Material Nature', sanskritName: 'Gunatraya Vibhaga Yoga', summary: 'Goodness, passion, and ignorance and how to transcend them.', verseCount: 27 },
  { chapterNumber: 15, chapterName: 'The Yoga of the Supreme Person', sanskritName: 'Purushottama Yoga', summary: 'The eternal soul and the Supreme Person.', verseCount: 20 },
  { chapterNumber: 16, chapterName: 'The Divine and Demoniac Natures', sanskritName: 'Daivasura Sampad Vibhaga Yoga', summary: 'Traits that elevate or degrade consciousness.', verseCount: 24 },
  { chapterNumber: 17, chapterName: 'The Divisions of Faith', sanskritName: 'Shraddhatraya Vibhaga Yoga', summary: 'Faith and conduct under three modes.', verseCount: 28 },
  { chapterNumber: 18, chapterName: 'Conclusion - The Perfection of Renunciation', sanskritName: 'Moksha Sanyasa Yoga', summary: 'Krishna’s final teaching: surrender and liberation.', verseCount: 78 },
]

function getChapterMeta(chapterNumber) {
  return CHAPTER_METADATA.find((ch) => ch.chapterNumber === chapterNumber)
}

function buildLocalFallbackVerses(chapterNumber) {
  const meta = getChapterMeta(chapterNumber)
  if (!meta) return []

  return [
    {
      chapterNumber,
      verseNumber: 1,
      chapterName: meta.chapterName,
      sanskritName: meta.sanskritName,
      sanskrit: `अध्याय ${chapterNumber}`,
      transliteration: `adhyāya ${chapterNumber}`,
      meaning: `${meta.summary} Full verses are being prepared in your database.`,
      audioUrl: null,
    },
  ]
}

async function fetchChapterVersesFromFallback(chapterNumber) {
  if (chapterCache.has(chapterNumber)) {
    return chapterCache.get(chapterNumber)
  }

  const scraped = await scrapeChapterVerses(chapterNumber)
  chapterCache.set(chapterNumber, scraped)
  return scraped
}

// Get all verses for a chapter
export async function getChapterVerses(req, res) {
  try {
    const { chapterNumber } = req.params
    const parsedChapterNumber = parseInt(chapterNumber)

    if (!chapterNumber || isNaN(chapterNumber)) {
      return res.status(400).json({ message: 'Invalid chapter number' })
    }

    const { data, error } = await supabase
      .from('gita_verses')
      .select('*')
      .eq('chapterNumber', parsedChapterNumber)
      .order('verseNumber', { ascending: true })

    if (error) {
      console.warn('Supabase unavailable for verses, falling back to scraper:', error.message)
      let fallbackData = []
      try {
        fallbackData = await fetchChapterVersesFromFallback(parsedChapterNumber)
      } catch (scrapeErr) {
        console.warn('Scraper fallback failed, using local fallback:', scrapeErr.message)
        fallbackData = buildLocalFallbackVerses(parsedChapterNumber)
      }
      return res.json(fallbackData)
    }

    if (!data || data.length === 0) {
      let fallbackData = []
      try {
        fallbackData = await fetchChapterVersesFromFallback(parsedChapterNumber)
      } catch (scrapeErr) {
        console.warn('Scraper fallback failed, using local fallback:', scrapeErr.message)
        fallbackData = buildLocalFallbackVerses(parsedChapterNumber)
      }
      return res.json(fallbackData)
    }

    return res.json(data)
  } catch (err) {
    console.error('Error fetching chapter verses:', err)
    const fallbackData = buildLocalFallbackVerses(parseInt(req.params.chapterNumber))
    return res.status(200).json(fallbackData)
  }
}

// Get a specific verse
export async function getVerse(req, res) {
  try {
    const { chapterNumber, verseNumber } = req.params
    const parsedChapterNumber = parseInt(chapterNumber)
    const parsedVerseNumber = parseInt(verseNumber)

    if (!chapterNumber || !verseNumber || isNaN(chapterNumber) || isNaN(verseNumber)) {
      return res.status(400).json({ message: 'Invalid chapter or verse number' })
    }

    const { data, error } = await supabase
      .from('gita_verses')
      .select('*')
      .eq('chapterNumber', parsedChapterNumber)
      .eq('verseNumber', parsedVerseNumber)
      .single()

    if (error) {
      console.warn('Supabase unavailable for verse, falling back to scraper:', error.message)
      let chapterVerses = []
      try {
        chapterVerses = await fetchChapterVersesFromFallback(parsedChapterNumber)
      } catch (scrapeErr) {
        console.warn('Scraper fallback failed, using local fallback:', scrapeErr.message)
        chapterVerses = buildLocalFallbackVerses(parsedChapterNumber)
      }
      const matchedVerse = chapterVerses.find((v) => v.verseNumber === parsedVerseNumber)
      if (!matchedVerse) {
        return res.status(404).json({ message: 'Verse not found' })
      }
      return res.json(matchedVerse)
    }

    if (!data) {
      let chapterVerses = []
      try {
        chapterVerses = await fetchChapterVersesFromFallback(parsedChapterNumber)
      } catch (scrapeErr) {
        console.warn('Scraper fallback failed, using local fallback:', scrapeErr.message)
        chapterVerses = buildLocalFallbackVerses(parsedChapterNumber)
      }
      const matchedVerse = chapterVerses.find((v) => v.verseNumber === parsedVerseNumber)
      if (!matchedVerse) {
        return res.status(404).json({ message: 'Verse not found' })
      }
      return res.json(matchedVerse)
    }

    return res.json(data)
  } catch (err) {
    console.error('Error fetching verse:', err)
    const fallbackVerse = buildLocalFallbackVerses(parseInt(req.params.chapterNumber))[0]
    if (!fallbackVerse) {
      return res.status(500).json({ message: 'Internal server error' })
    }
    return res.status(200).json(fallbackVerse)
  }
}

// Search verses by keyword
export async function searchVerses(req, res) {
  try {
    const { query } = req.query

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' })
    }

    const { data, error } = await supabase
      .from('gita_verses')
      .select('*')
      .or(`meaning.ilike.%${query}%,transliteration.ilike.%${query}%,chapterName.ilike.%${query}%`)
      .limit(50)

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ message: 'Failed to search verses', error: error.message })
    }

    res.json(data)
  } catch (err) {
    console.error('Error searching verses:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get all chapters metadata
export async function getChaptersMetadata(req, res) {
  try {
    const { data, error } = await supabase
      .from('gita_chapters')
      .select('*')
      .order('chapterNumber', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return res.json(CHAPTER_METADATA)
    }

    if (!data || data.length === 0) {
      return res.json(CHAPTER_METADATA)
    }

    return res.json(data)
  } catch (err) {
    console.error('Error fetching chapters:', err)
    return res.json(CHAPTER_METADATA)
  }
}
