# Supabase Setup Instructions

## Issue: Email Confirmation Required

Your Supabase project requires email confirmation by default. This causes login to fail with "Email not confirmed" error.

## Quick Fix (For Development)

### Disable Email Confirmation in Supabase Dashboard:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `xjdrrrwuturfvqhirwbw`
3. Navigate to: **Authentication** → **Providers** → **Email**
4. Scroll down to **"Email Confirmation"**
5. **Disable** the "Confirm email" toggle
6. Click **Save**

### OR: Manually Confirm Test Users

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Find your test user
3. Click the **...** menu next to the user
4. Select **"Confirm email"**

## Production Setup (Keep Email Confirmation Enabled)

If you want to keep email confirmation enabled for production:

### 1. Configure Email Templates (Optional)
- Go to **Authentication** → **Email Templates**
- Customize the confirmation email template
- Set the redirect URL to: `http://localhost:3000` (for dev) or your production URL

### 2. Handle Email Confirmation in Your App

The backend now properly handles email confirmation:
- Signup returns `emailConfirmationRequired: true` if confirmation needed
- Login returns helpful error message if email not confirmed
- Frontend shows appropriate messages to users

## Testing

After disabling email confirmation or confirming your test user:

1. **Refresh your frontend**
2. **Try logging in again** with your test credentials
3. Login should now work successfully

## Current Test Account

Based on the logs, you recently created an account. You can either:
- Manually confirm it in the Supabase dashboard, OR
- Disable email confirmation globally

Once done, login will work immediately.
