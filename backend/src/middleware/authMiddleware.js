import { createSupabaseClient } from '../lib/supabase.js';

const AUTH_CACHE_TTL_MS = 90 * 1000;
const AUTH_CACHE_MAX_ITEMS = 2000;
const authCache = new Map();

function getCachedUser(token) {
  const cached = authCache.get(token);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    authCache.delete(token);
    return null;
  }
  return cached.user;
}

function setCachedUser(token, user) {
  authCache.set(token, { user, expiresAt: Date.now() + AUTH_CACHE_TTL_MS });

  if (authCache.size > AUTH_CACHE_MAX_ITEMS) {
    const now = Date.now();
    for (const [key, value] of authCache.entries()) {
      if (value.expiresAt <= now) {
        authCache.delete(key);
      }
    }

    // If still large, trim oldest entry.
    if (authCache.size > AUTH_CACHE_MAX_ITEMS) {
      const firstKey = authCache.keys().next().value;
      if (firstKey) authCache.delete(firstKey);
    }
  }
}

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      console.error('Auth failed: No token provided');
      return res.status(401).json({ message: 'Missing authorization token' });
    }

    const cachedUser = getCachedUser(token);
    if (cachedUser) {
      req.user = cachedUser;
      req.accessToken = token;
      return next();
    }

    // Create a Supabase client with the user's access token
    const supabase = createSupabaseClient(token);
    
    // Verify the token by getting the user
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Supabase auth error:', {
        message: error.message,
        status: error.status,
        code: error.code
      });
      authCache.delete(token);
      return res.status(401).json({ 
        message: 'Invalid or expired token',
        details: error.message 
      });
    }

    if (!user) {
      console.error('Auth failed: No user found in token data');
      return res.status(401).json({ message: 'Invalid token - no user data' });
    }

    setCachedUser(token, user);
    req.user = user;
    req.accessToken = token;
    next();
  } catch (error) {
    console.error('Auth middleware exception:', error);
    return res.status(500).json({ message: 'Authentication error', error: error.message });
  }
}
