import { prisma } from '../lib/prisma.js'

async function getOrCreateUser(req) {
  const supabaseUserId = req.user?.id
  const email = (req.user?.email || `${supabaseUserId}@no-email.local`).toLowerCase()
  const name = req.user?.user_metadata?.name || req.user?.user_metadata?.full_name || null

  if (!supabaseUserId) {
    throw new Error('Authenticated user id is missing')
  }

  const existingBySupabaseId = await prisma.user.findUnique({
    where: { supabaseUserId },
  })

  if (existingBySupabaseId) {
    let safeEmail = existingBySupabaseId.email
    if (existingBySupabaseId.email !== email) {
      const emailOwner = await prisma.user.findUnique({ where: { email } })
      if (!emailOwner || emailOwner.id === existingBySupabaseId.id) {
        safeEmail = email
      }
    }

    return prisma.user.update({
      where: { supabaseUserId },
      data: {
        email: safeEmail,
        name,
        lastLoginAt: new Date(),
      },
    })
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (existingByEmail) {
    return prisma.user.update({
      where: { email },
      data: {
        supabaseUserId,
        name,
        lastLoginAt: new Date(),
      },
    })
  }

  return prisma.user.create({
    data: {
      supabaseUserId,
      email,
      name,
      lastLoginAt: new Date(),
    },
  })
}

function normalizeBookmarkRow(row) {
  return {
    id: row.id,
    verseNumber: row.verseNumber,
    chapterNumber: row.chapterNumber,
    chapterName: row.chapterName,
    sanskrit: row.sanskrit,
    transliteration: row.transliteration,
    meaning: row.meaning,
    timestamp: row.createdAt ? new Date(row.createdAt).getTime() : Date.now(),
  }
}

export async function getBookmarks(req, res) {
  try {
    const user = await getOrCreateUser(req)
    const data = await prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return res.json(data.map(normalizeBookmarkRow))
  } catch (error) {
    console.error('Unexpected error fetching bookmarks:', error)
    return res.status(500).json({ message: 'Internal server error', details: error?.message || 'unknown' })
  }
}

export async function addBookmark(req, res) {
  try {
    const user = await getOrCreateUser(req)

    const { verseNumber, chapterNumber, chapterName, sanskrit, transliteration, meaning } = req.body

    if (!verseNumber || !chapterNumber || !chapterName || !sanskrit || !transliteration || !meaning) {
      return res.status(400).json({ message: 'Missing required bookmark fields' })
    }

    const data = await prisma.bookmark.upsert({
      where: {
        userId_verseNumber: {
          userId: user.id,
          verseNumber,
        },
      },
      update: {
        chapterNumber: Number(chapterNumber),
        chapterName,
        sanskrit,
        transliteration,
        meaning,
      },
      create: {
        userId: user.id,
        verseNumber,
        chapterNumber: Number(chapterNumber),
        chapterName,
        sanskrit,
        transliteration,
        meaning,
      },
    })

    return res.status(201).json(normalizeBookmarkRow(data))
  } catch (error) {
    console.error('Unexpected error adding bookmark:', error)
    return res.status(500).json({ message: 'Internal server error', details: error?.message || 'unknown' })
  }
}

export async function removeBookmark(req, res) {
  try {
    const user = await getOrCreateUser(req)

    const verseNumber = decodeURIComponent(req.params.verseNumber || '')
    if (!verseNumber) {
      return res.status(400).json({ message: 'verseNumber is required' })
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId: user.id,
        verseNumber,
      },
    })

    return res.status(200).json({ message: 'Bookmark removed' })
  } catch (error) {
    console.error('Unexpected error removing bookmark:', error)
    return res.status(500).json({ message: 'Internal server error', details: error?.message || 'unknown' })
  }
}
