import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
} from '../controllers/bookmarkController.js'

const router = Router()

router.use(requireAuth)

router.get('/', getBookmarks)
router.post('/', addBookmark)
router.delete('/:verseNumber', removeBookmark)

export default router
