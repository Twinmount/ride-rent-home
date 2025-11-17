# OAuth Redirect URI Mismatch - Debugging Guide

## 🔴 Error: `redirect_uri_mismatch`

This error occurs when the redirect URI configured in your OAuth provider (Google/Facebook/Apple) doesn't exactly match what NextAuth is trying to use.

## 🔍 Why This Happens

1. **Mismatched URLs**: The redirect URI in your OAuth provider console doesn't match what NextAuth sends
2. **Missing NEXTAUTH_URL**: Environment variable not set or incorrect
3. **Protocol Mismatch**: Using `http://` instead of `https://` or vice versa
4. **Port Mismatch**: Different port numbers (e.g., `:3000` vs `:3001`)
5. **Trailing Slashes**: Extra or missing trailing slashes
6. **Domain Mismatch**: `localhost` vs `127.0.0.1` vs actual domain

## 🛠️ Step-by-Step Debugging

### Step 1: Check Your Current URL

Open your browser console and run:

```javascript
console.log("Current URL:", window.location.origin);
```

Or check your terminal where Next.js is running - it shows the URL.

### Step 2: Verify NEXTAUTH_URL Environment Variable

**Check your `.env.development` file:**

```env
NEXTAUTH_URL=http://localhost:3000
```

**Important Notes:**

- Must match EXACTLY (including protocol, port, no trailing slash)
- For development: `http://localhost:3000` (no trailing slash)
- For production: `https://yourdomain.com` (no trailing slash)

### Step 3: Find What Redirect URI NextAuth is Using

NextAuth automatically constructs the redirect URI as:

```
{NEXTAUTH_URL}/api/auth/callback/{provider}
```

**Examples:**

- Google: `http://localhost:3000/api/auth/callback/google`
- Facebook: `http://localhost:3000/api/auth/callback/facebook`
- Apple: `http://localhost:3000/api/auth/callback/apple`

### Step 4: Check Your OAuth Provider Console

#### For Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Check **Authorized redirect URIs** section

**Required Redirect URIs:**

```
http://localhost:3000/api/auth/callback/google
```

**For Production:**

```
https://yourdomain.com/api/auth/callback/google
```

#### For Facebook OAuth:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. Go to **Facebook Login** → **Settings**
4. Check **Valid OAuth Redirect URIs**

**Required Redirect URIs:**

```
http://localhost:3000/api/auth/callback/facebook
```

#### For Apple OAuth:

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Select your **Services ID**
4. Check **Return URLs** under **Sign in with Apple**

**Required Return URLs:**

```
https://yourdomain.com/api/auth/callback/apple
```

**Note:** Apple requires HTTPS even for localhost (use ngrok or similar)

### Step 5: Common Mistakes to Avoid

❌ **WRONG:**

```
http://localhost:3000/api/auth/callback/google/  (trailing slash)
https://localhost:3000/api/auth/callback/google  (https in dev)
http://127.0.0.1:3000/api/auth/callback/google  (different host)
http://localhost:3001/api/auth/callback/google  (wrong port)
```

✅ **CORRECT:**

```
http://localhost:3000/api/auth/callback/google
```

### Step 6: Fix the Issue

#### Option A: Update OAuth Provider Console

1. Copy the exact redirect URI from Step 3
2. Go to your OAuth provider console
3. Add the redirect URI to the **Authorized redirect URIs** list
4. Save changes
5. Wait 1-2 minutes for changes to propagate
6. Try signing in again

#### Option B: Update NEXTAUTH_URL

1. Check what URL your app is actually running on
2. Update `.env.development`:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   ```
3. Restart your Next.js development server
4. Clear browser cache/cookies
5. Try signing in again

## 🔧 Quick Fix Checklist

- [ ] `NEXTAUTH_URL` is set in `.env.development`
- [ ] `NEXTAUTH_URL` matches your actual app URL (protocol, domain, port)
- [ ] Redirect URI in OAuth console matches: `{NEXTAUTH_URL}/api/auth/callback/{provider}`
- [ ] No trailing slashes in redirect URI
- [ ] Using `http://` for localhost development
- [ ] Using `https://` for production
- [ ] Restarted Next.js server after changing `.env`
- [ ] Waited 1-2 minutes after updating OAuth console
- [ ] Cleared browser cache/cookies

## 🧪 Test Your Configuration

Run this in your browser console to see what NextAuth will use:

```javascript
// Check current origin
console.log("Current Origin:", window.location.origin);

// Expected redirect URI for Google
const nextAuthUrl = "http://localhost:3000"; // Update with your NEXTAUTH_URL
console.log(
  "Expected Google Redirect:",
  `${nextAuthUrl}/api/auth/callback/google`
);
console.log(
  "Expected Facebook Redirect:",
  `${nextAuthUrl}/api/auth/callback/facebook`
);
console.log(
  "Expected Apple Redirect:",
  `${nextAuthUrl}/api/auth/callback/apple`
);
```

## 📝 Example Configuration

### Development (.env.development)

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Google Console - Authorized Redirect URIs

```
http://localhost:3000/api/auth/callback/google
```

### Production (.env.production)

```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Google Console - Authorized Redirect URIs (Production)

```
https://yourdomain.com/api/auth/callback/google
```

## 🚨 Still Having Issues?

1. **Check NextAuth Debug Mode**: Add to `auth.option.ts`:

   ```typescript
   debug: true,
   ```

2. **Check Browser Network Tab**:
   - Open DevTools → Network tab
   - Try signing in
   - Look for the OAuth request
   - Check the `redirect_uri` parameter in the request

3. **Check Server Logs**:
   - Look at your Next.js terminal output
   - NextAuth will log redirect URIs in debug mode

4. **Verify Environment Variables Are Loaded**:
   ```typescript
   console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
   ```

## 💡 Pro Tips

1. **Use Multiple Redirect URIs**: Add both development and production URIs to your OAuth provider
2. **Test in Incognito Mode**: Sometimes browser cache causes issues
3. **Check for Typos**: Copy-paste the exact URI to avoid typos
4. **Wait for Propagation**: OAuth provider changes can take 1-2 minutes
5. **Use Environment-Specific Configs**: Different `.env` files for dev/staging/prod
