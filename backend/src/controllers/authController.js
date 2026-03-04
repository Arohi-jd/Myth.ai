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
      },
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (data.user) {
      await syncUserProfile({
        supabaseUserId: data.user.id,
        email: normalizedEmail,
        name: name || null,
      });
    }

    return res.status(201).json({
      message: 'Signup successful',
      user: data.user,
      session: data.session,
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
      return res.status(401).json({ message: error.message });
    }

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
