import * as cheerio from 'cheerio'

const BASE_URL = 'https://www.holy-bhagavad-gita.org'

const CHAPTER_VERSE_COUNTS = {
  1: 47,
  2: 72,
  3: 43,
  4: 42,
  5: 29,
  6: 47,
  7: 30,
  8: 28,
  9: 34,
  10: 42,
  11: 55,
  12: 20,
  13: 35,
  14: 27,
  15: 20,
  16: 24,
  17: 28,
  18: 78,
}

function cleanText(text = '') {
  return text.replace(/\s+/g, ' ').trim()
}

function htmlBreaksToNewLines(rawHtml = '') {
  return rawHtml
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n\s+/g, '\n')
    .trim()
}

async function fetchVerse(chapterNumber, verseNumber) {
  const url = `${BASE_URL}/chapter/${chapterNumber}/verse/${verseNumber}`

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Myth.ai Gita Bot)',
      Accept: 'text/html',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch verse ${chapterNumber}.${verseNumber}: ${response.status}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  const sanskritHtml = $('.verse-details .bg-shlocks p').first().html() || ''
  const transliterationHtml = $('.verse-details .bg-transliteration p').first().html() || ''
  const meaning = cleanText($('.bg-verse-translation p').first().text().replace(/^BG\s+\d+\.\d+:\s*/i, ''))

  const audioSrc = $('.bg-verse-audio audio').attr('src') || null
  const audioUrl = audioSrc ? `${BASE_URL}${audioSrc}` : null

  // Try to infer chapter/sanskrit names from breadcrumbs/title if available
  const breadcrumbChapter = $('.breadcrumbs a[href*="/chapter/"]').last().text().trim()
  const chapterName = cleanText(breadcrumbChapter.replace(/^Chapter\s+\d+\s*:\s*/i, '')) || `Chapter ${chapterNumber}`

  return {
    chapterNumber,
    verseNumber,
    chapterName,
    sanskritName: '',
    sanskrit: htmlBreaksToNewLines(sanskritHtml),
    transliteration: htmlBreaksToNewLines(transliterationHtml),
    meaning,
    audioUrl,
  }
}

export async function scrapeChapterVerses(chapterNumber) {
  const count = CHAPTER_VERSE_COUNTS[chapterNumber]
  if (!count) {
    throw new Error(`Invalid chapter number: ${chapterNumber}`)
  }

  const verses = []

  // Controlled concurrency for stability
  const concurrency = 5
  let current = 1

  async function worker() {
    while (current <= count) {
      const verseNo = current++
      const verse = await fetchVerse(chapterNumber, verseNo)
      verses.push(verse)
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()))

  return verses.sort((a, b) => a.verseNumber - b.verseNumber)
}
