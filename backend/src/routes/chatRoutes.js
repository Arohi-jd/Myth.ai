import { Router } from 'express';
import { chat, clearHistory } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', requireAuth, chat);
router.delete('/history', requireAuth, clearHistory);

export default router;
