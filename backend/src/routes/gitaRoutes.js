import { Router } from 'express'
import {
  getChapterVerses,
  getVerse,
  searchVerses,
  getChaptersMetadata,
} from '../controllers/gitaController.js'

const router = Router()

// Get all chapters metadata
router.get('/chapters', getChaptersMetadata)

// Get all verses for a chapter
router.get('/chapters/:chapterNumber/verses', getChapterVerses)

// Get a specific verse
router.get('/chapters/:chapterNumber/verses/:verseNumber', getVerse)

// Search verses
router.get('/search', searchVerses)

export default router
