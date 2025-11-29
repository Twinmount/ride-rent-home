# Production Redirect URIs for ride.rent

## ✅ Correct Redirect URIs

For production domain `https://ride.rent`, you need to add these **EXACT** redirect URIs to your OAuth provider consoles:

### Google OAuth
```
https://ride.rent/api/auth/callback/google
```

### Facebook OAuth
```
https://ride.rent/api/auth/callback/facebook
```

### Apple OAuth
```
https://ride.rent/api/auth/callback/apple
```

## 📝 Important Notes

1. **Protocol**: Must use `https://` (not `http://`)
2. **Domain**: Must be exactly `ride.rent` (no `www.` unless you use it)
3. **Path**: Must be exactly `/api/auth/callback/{provider}`
4. **No trailing slash**: Don't add `/` at the end
5. **Case sensitive**: Use lowercase for the provider name

## 🔧 Where to Add These

### Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Click your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   ```
   https://ride.rent/api/auth/callback/google
   ```
5. Click **SAVE**

### Facebook Developers
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. **Facebook Login** → **Settings**
4. Under **Valid OAuth Redirect URIs**, add:
   ```
   https://ride.rent/api/auth/callback/facebook
   ```
5. Click **Save Changes**

### Apple Developer Portal
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. **Certificates, Identifiers & Profiles**
3. Select your **Services ID**
4. Under **Sign in with Apple** → **Return URLs**, add:
   ```
   https://ride.rent/api/auth/callback/apple
   ```
5. Click **Save**

## ⚠️ Common Mistakes

❌ **WRONG:**
```
https://ride.rent/api/auth/callback/google/     ← trailing slash
http://ride.rent/api/auth/callback/google       ← http instead of https
https://www.ride.rent/api/auth/callback/google  ← www prefix (unless you use it)
https://ride.rent/@auth.option.ts               ← wrong path
```

✅ **CORRECT:**
```
https://ride.rent/api/auth/callback/google
```

## 🔍 Verify Your Configuration

### Check NEXTAUTH_URL in Production

Make sure your production `.env.production` or environment variables have:

```env
NEXTAUTH_URL=https://ride.rent
```

**Important:**
- No trailing slash
- Use `https://` (not `http://`)
- Exact domain match

### Test the Redirect URI

After adding the redirect URI to your OAuth provider:
1. Wait 1-2 minutes for changes to propagate
2. Try signing in with OAuth
3. Check browser console for any errors
4. Check server logs for redirect URI mismatches

## 📋 Checklist

- [ ] Added `https://ride.rent/api/auth/callback/google` to Google Console
- [ ] Added `https://ride.rent/api/auth/callback/facebook` to Facebook Console
- [ ] Added `https://ride.rent/api/auth/callback/apple` to Apple Console
- [ ] Set `NEXTAUTH_URL=https://ride.rent` in production environment
- [ ] Verified no trailing slashes
- [ ] Verified using `https://` (not `http://`)
- [ ] Waited 1-2 minutes after saving
- [ ] Tested OAuth sign-in in production

## 🚨 If You Still Get Errors

1. **Double-check the exact URI** - Copy-paste from this document
2. **Check for typos** - Even one character wrong will fail
3. **Verify NEXTAUTH_URL** - Must match exactly: `https://ride.rent`
4. **Check server logs** - NextAuth will show what redirect URI it's using
5. **Clear browser cache** - Sometimes cached redirects cause issues

## 💡 Pro Tip

You can add **both** development and production URIs to your OAuth provider console:

**For Google:**
```
http://localhost:3000/api/auth/callback/google    (development)
https://ride.rent/api/auth/callback/google         (production)
```

This way, the same OAuth app works in both environments!

