# 🚨 Quick Fix: redirect_uri_mismatch Error

## The Problem

You're seeing: `Error 400: redirect_uri_mismatch`

This means the redirect URI in your OAuth provider console doesn't match what NextAuth is sending.

## ⚡ Quick Fix (3 Steps)

### Step 1: Check Your NEXTAUTH_URL

Open `.env.development` and verify:

```env
NEXTAUTH_URL=http://localhost:3000
```

**Important:**

- ✅ No trailing slash
- ✅ Use `http://` for localhost (not `https://`)
- ✅ Match your actual port (usually `:3000`)

### Step 2: Calculate Your Redirect URI

Your redirect URI is: `{NEXTAUTH_URL}/api/auth/callback/{provider}`

**Examples:**

- Google: `http://localhost:3000/api/auth/callback/google`
- Facebook: `http://localhost:3000/api/auth/callback/facebook`
- Apple: `http://localhost:3000/api/auth/callback/apple`

### Step 3: Add to OAuth Provider Console

#### For Google:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Click your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, click **+ ADD URI**
5. Paste: `http://localhost:3000/api/auth/callback/google`
6. Click **SAVE**
7. Wait 1-2 minutes

#### For Facebook:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. **Facebook Login** → **Settings**
4. Under **Valid OAuth Redirect URIs**, add:
   `http://localhost:3000/api/auth/callback/facebook`
5. Click **Save Changes**
6. Wait 1-2 minutes

## ✅ Checklist

- [ ] `NEXTAUTH_URL` is set in `.env.development`
- [ ] `NEXTAUTH_URL` has no trailing slash
- [ ] Redirect URI added to Google Console
- [ ] Redirect URI added to Facebook Console (if using)
- [ ] Restarted Next.js server
- [ ] Waited 1-2 minutes after updating console
- [ ] Cleared browser cache/cookies
- [ ] Tried in incognito mode

## 🔍 Still Not Working?

1. **Check server logs** - When you start Next.js, it will show expected redirect URIs
2. **Check browser console** - Look for the actual redirect URI being used
3. **Verify exact match** - Copy-paste the URI to avoid typos
4. **Check for multiple entries** - Make sure you didn't add it twice with different formats

## 📝 Common Mistakes

❌ **WRONG:**

```
http://localhost:3000/api/auth/callback/google/  ← trailing slash
https://localhost:3000/api/auth/callback/google  ← https in dev
http://127.0.0.1:3000/api/auth/callback/google    ← different host
http://localhost:3001/api/auth/callback/google    ← wrong port
```

✅ **CORRECT:**

```
http://localhost:3000/api/auth/callback/google
```

## 🎯 What to Copy-Paste

**For Google Console:**

```
http://localhost:3000/api/auth/callback/google
```

**For Facebook Console:**

```
http://localhost:3000/api/auth/callback/facebook
```

That's it! The redirect URI must match **EXACTLY** (including protocol, port, and no trailing slash).
