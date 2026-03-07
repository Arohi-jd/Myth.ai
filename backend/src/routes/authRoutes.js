import { Router } from 'express';
import { login, me, signup, refreshSession, googleCallback } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshSession);
router.post('/google/callback', requireAuth, googleCallback);
router.get('/me', requireAuth, me);

// Test endpoint to verify auth is working
router.get('/verify', requireAuth, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Token is valid',
    user: {
      id: req.user.id,
      email: req.user.email
    }
  });
});

export default router;
