import { createSupabaseClient } from '../lib/supabase.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      console.error('Auth failed: No token provided');
      return res.status(401).json({ message: 'Missing authorization token' });
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
      return res.status(401).json({ 
        message: 'Invalid or expired token',
        details: error.message 
      });
    }

    if (!user) {
      console.error('Auth failed: No user found in token data');
      return res.status(401).json({ message: 'Invalid token - no user data' });
    }

    console.log('✓ Auth successful for user:', user.id, user.email);
    req.user = user;
    req.accessToken = token;
    next();
  } catch (error) {
    console.error('Auth middleware exception:', error);
    return res.status(500).json({ message: 'Authentication error', error: error.message });
  }
}
