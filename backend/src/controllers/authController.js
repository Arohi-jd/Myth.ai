import { prisma } from '../lib/prisma.js';
import { supabase } from '../lib/supabase.js';

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

async function syncUserProfile({ supabaseUserId, email, name, updateLastLogin = false }) {
  const normalizedEmail = normalizeEmail(email);

  const existingBySupabaseId = await prisma.user.findUnique({
    where: { supabaseUserId },
  });

  if (existingBySupabaseId) {
    return prisma.user.update({
      where: { supabaseUserId },
      data: {
        email: normalizedEmail,
        name: name || null,
        ...(updateLastLogin ? { lastLoginAt: new Date() } : {}),
      },
    });
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingByEmail) {
    return prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        supabaseUserId,
        name: name || null,
        ...(updateLastLogin ? { lastLoginAt: new Date() } : {}),
      },
    });
  }

  return prisma.user.create({
    data: {
      supabaseUserId,
      email: normalizedEmail,
      name: name || null,
      ...(updateLastLogin ? { lastLoginAt: new Date() } : {}),
    },
  });
}

export async function signup(req, res, next) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = normalizeEmail(email);

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          name: name || null,
        },
        emailRedirectTo: process.env.FRONTEND_URL,
      },
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Check if email confirmation is required
    const emailConfirmationRequired = !data.session && data.user?.identities?.length === 0;

    if (data.user) {
      await syncUserProfile({
        supabaseUserId: data.user.id,
        email: normalizedEmail,
        name: name || null,
      });
    }

    return res.status(201).json({
      message: emailConfirmationRequired 
        ? 'Signup successful! Please check your email to confirm your account before logging in.'
        : 'Signup successful',
      user: data.user,
      session: data.session,
      emailConfirmationRequired,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = normalizeEmail(email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error);
      
      // Handle email not confirmed error specifically
      if (error.code === 'email_not_confirmed') {
        return res.status(403).json({ 
          message: 'Please confirm your email address before logging in. Check your inbox for a confirmation link.',
          code: 'email_not_confirmed'
        });
      }
      
      return res.status(401).json({ message: error.message });
    }

    if (!data.session || !data.session.access_token) {
      console.error('Login succeeded but no session/token returned:', data);
      return res.status(500).json({ message: 'Authentication succeeded but session not created' });
    }

    console.log('Login successful:', {
      userId: data.user?.id,
      email: data.user?.email,
      hasSession: !!data.session,
      hasToken: !!data.session?.access_token
    });

    if (data.user) {
      await syncUserProfile({
        supabaseUserId: data.user.id,
        email: normalizedEmail,
        name: data.user.user_metadata?.name || null,
        updateLastLogin: true,
      });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshSession(req, res, next) {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ message: 'refresh_token is required' });
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error) {
      console.error('Token refresh error:', error);
      return res.status(401).json({ message: 'Unable to refresh session', details: error.message });
    }

    if (!data.session) {
      return res.status(401).json({ message: 'No session returned after refresh' });
    }

    return res.status(200).json({
      session: data.session,
      user: data.user,
    });
  } catch (error) {
    next(error);
  }
}

export async function googleCallback(req, res, next) {
  try {
    // The frontend already has the tokens from the Supabase OAuth redirect.
    // This endpoint just syncs the Google user into our own database.
    const user = req.user; // set by requireAuth middleware

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    await syncUserProfile({
      supabaseUserId: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      updateLastLogin: true,
    });

    return res.status(200).json({ message: 'Google user synced' });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const profile = await prisma.user.findUnique({
      where: { supabaseUserId: req.user.id },
    });

    return res.status(200).json({
      user: req.user,
      profile,
    });
  } catch (error) {
    next(error);
  }
}
