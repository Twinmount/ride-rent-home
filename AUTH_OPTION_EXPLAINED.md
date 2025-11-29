# 📚 Complete Guide: auth.option.ts Explained

## Overview

The `auth.option.ts` file is the **heart of your OAuth authentication system**. It configures:

- Which OAuth providers to use (Google, Facebook, Apple)
- How user data is stored and accessed
- Security settings and redirects
- Session management

---

## 📖 File Structure Breakdown

### 1. **Imports Section**

```typescript
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import type { NextAuthOptions } from "next-auth";
```

**What it does:**

- Imports OAuth provider configurations from NextAuth
- Each provider handles the OAuth flow for that service
- `NextAuthOptions` is the TypeScript type for the configuration object

---

### 2. **Environment Variable Validation**

```typescript
const requiredEnvVars = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  // ...
};
```

**What it does:**

- Checks if required environment variables are set
- Logs warnings in development if variables are missing
- Helps catch configuration errors early

**Why it matters:**

- Missing `NEXTAUTH_URL` = redirect URI mismatch errors
- Missing `NEXTAUTH_SECRET` = JWT encryption won't work

---

### 3. **OAuth Providers Configuration**

```typescript
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),
  // ... Facebook and Apple
];
```

**What it does:**

- Registers OAuth providers with NextAuth
- Each provider needs:
  - **Client ID**: Public identifier for your app
  - **Client Secret**: Private key (keep secure!)
  - **Authorization params**: What permissions to request

**Key Parameters Explained:**

| Parameter                       | What It Does                                                    |
| ------------------------------- | --------------------------------------------------------------- |
| `prompt: "consent"`             | Always show consent screen (user sees what they're authorizing) |
| `access_type: "offline"`        | Request refresh token (allows long-term access)                 |
| `response_type: "code"`         | Use authorization code flow (most secure)                       |
| `scope: "email public_profile"` | What user data to request (Facebook)                            |

**Redirect URI Format:**

```
{NEXTAUTH_URL}/api/auth/callback/{provider}
```

Example: `http://localhost:3000/api/auth/callback/google`

---

### 4. **Callbacks - The Authentication Flow**

Callbacks are functions that run at specific points during authentication. Think of them as "hooks" in the OAuth flow.

#### **signIn Callback**

```typescript
async signIn({ user, account, profile }) {
  // Return true to allow sign in, false to deny
  return true;
}
```

**When it runs:** Before user is signed in

**What it does:**

- Validates if user should be allowed to sign in
- Can check user email domain, account status, etc.
- Returns `true` to allow, `false` to deny

**Use cases:**

- Restrict sign-in to specific email domains
- Check if account is banned/suspended
- Log authentication attempts

---

#### **JWT Callback** (Most Important!)

```typescript
async jwt({ token, trigger, session, account, user, profile }) {
  // Initial sign in
  if (account) {
    token.accessToken = account.access_token;
    token.email = user.email;
    // ... store user data
  }

  // Session update
  if (trigger === "update") {
    // Update token with new session data
  }

  return token;
}
```

**When it runs:**

- **Initial sign in**: When user first authenticates
- **Session check**: Every time session is accessed
- **Session update**: When `update()` is called

**What it does:**

- Stores user data in the JWT token
- Persists OAuth tokens (access token, refresh token)
- Updates token when user data changes

**Token Structure:**

```typescript
{
  accessToken: "oauth_access_token",
  refreshToken: "oauth_refresh_token",
  provider: "google",
  email: "user@example.com",
  name: "John Doe",
  // ... more user data
}
```

**Why it matters:**

- JWT tokens are stored in cookies (no database needed!)
- Token data is available in every request
- Can be updated without re-authentication

---

#### **Session Callback**

```typescript
async session({ session, token }) {
  session.accessToken = token.accessToken;
  session.user = {
    ...session.user,
    id: token.id,
    email: token.email,
  };
  return session;
}
```

**When it runs:** Every time `useSession()` hook is called

**What it does:**

- Exposes token data to the client
- Formats data for frontend use
- Adds custom fields to session object

**Important:**

- Only expose safe data (not sensitive secrets)
- This is what your React components see
- Called on every session check (can be frequent)

**Session Structure:**

```typescript
{
  user: {
    id: "user_id",
    email: "user@example.com",
    name: "John Doe",
    image: "profile_pic_url"
  },
  accessToken: "oauth_token",
  provider: "google",
  expires: "2024-01-01T00:00:00.000Z"
}
```

---

#### **Redirect Callback**

```typescript
async redirect({ url, baseUrl }) {
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  }
  if (new URL(url).origin === baseUrl) {
    return url;
  }
  return baseUrl;
}
```

**When it runs:** After successful OAuth sign in

**What it does:**

- Controls where user is redirected after authentication
- Security check: Only allows same-origin redirects
- Prevents open redirect attacks

**Security:**

- Prevents redirecting to malicious sites
- Only allows redirects within your app
- Falls back to `baseUrl` if invalid

---

### 5. **Session Configuration**

```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

**What it does:**

- `strategy: "jwt"`: Store sessions in JWT tokens (no database)
- `maxAge`: How long sessions last (30 days)

**JWT vs Database Sessions:**

| JWT (Current)             | Database                |
| ------------------------- | ----------------------- |
| ✅ No database needed     | ❌ Requires database    |
| ✅ Faster (no DB queries) | ❌ Slower (DB queries)  |
| ✅ Stateless              | ❌ Stateful             |
| ❌ Can't revoke easily    | ✅ Can revoke instantly |

---

### 6. **Debug & Secret**

```typescript
debug: process.env.NODE_ENV === "development",
secret: process.env.NEXTAUTH_SECRET,
```

**Debug Mode:**

- Logs detailed authentication flow
- Shows redirect URIs, tokens, errors
- Only enabled in development

**Secret:**

- Used to encrypt/decrypt JWT tokens
- **MUST be set** or authentication won't work
- Generate with: `openssl rand -base64 32`
- Keep it secret! Never commit to git.

---

### 7. **TypeScript Type Extensions**

```typescript
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    // ... custom fields
  }
}
```

**What it does:**

- Extends NextAuth TypeScript types
- Adds custom fields to Session and JWT types
- Provides type safety and autocomplete

**Why it matters:**

- TypeScript knows about your custom fields
- Prevents typos and type errors
- Better developer experience

---

## 🔄 Complete Authentication Flow

Here's what happens when a user clicks "Sign in with Google":

1. **User clicks button** → `signInWithProvider("google")` is called
2. **NextAuth redirects** → User goes to Google's consent screen
3. **User authorizes** → Google redirects back with authorization code
4. **NextAuth receives code** → Exchanges code for access token
5. **signIn callback** → Validates if sign-in should be allowed
6. **JWT callback** → Stores user data and tokens in JWT
7. **Session callback** → Formats data for frontend
8. **Redirect callback** → Redirects user back to your app
9. **User is signed in** → Session available via `useSession()`

---

## 🐛 Common Issues & Solutions

### Issue: redirect_uri_mismatch

**Cause:** Redirect URI in OAuth console doesn't match NextAuth

**Solution:**

1. Check `NEXTAUTH_URL` in `.env`
2. Calculate: `{NEXTAUTH_URL}/api/auth/callback/{provider}`
3. Add exact URI to OAuth provider console
4. Wait 1-2 minutes for changes to propagate

### Issue: Session not persisting

**Cause:** Missing `NEXTAUTH_SECRET` or wrong `NEXTAUTH_URL`

**Solution:**

1. Set `NEXTAUTH_SECRET` in `.env`
2. Verify `NEXTAUTH_URL` matches your app URL
3. Check browser cookies are enabled
4. Clear cookies and try again

### Issue: Access token not available

**Cause:** Not storing token in JWT callback

**Solution:**

- Make sure JWT callback stores `account.access_token`
- Verify session callback exposes it

---

## 📝 Best Practices

1. **Always set NEXTAUTH_URL** - Prevents redirect URI errors
2. **Use strong NEXTAUTH_SECRET** - Generate with openssl
3. **Enable debug in development** - Helps catch issues early
4. **Validate environment variables** - Check on startup
5. **Don't expose sensitive tokens** - Only expose what's needed
6. **Use HTTPS in production** - OAuth requires secure connections
7. **Log redirect URIs** - Helps debug configuration issues

---

## 🎯 Quick Reference

| What         | Where                  | Example                                          |
| ------------ | ---------------------- | ------------------------------------------------ |
| Redirect URI | OAuth Provider Console | `http://localhost:3000/api/auth/callback/google` |
| NEXTAUTH_URL | `.env.development`     | `http://localhost:3000`                          |
| Access Token | JWT Callback → Session | `token.accessToken`                              |
| User Data    | Session Callback       | `session.user.email`                             |
| Debug Logs   | Server Terminal        | Check Next.js console                            |

---

## 🔗 Related Files

- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route handler
- `src/hooks/useOAuth.ts` - React hook for OAuth sign-in
- `src/components/providers/SessionProvider.tsx` - Session context provider
- `.env.development` - Environment variables

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [OAuth 2.0 Flow Explained](https://oauth.net/2/)
- [JWT Tokens Explained](https://jwt.io/introduction)

---

**Remember:** The redirect URI must match **EXACTLY** between your OAuth provider console and what NextAuth sends. Even a trailing slash or protocol mismatch will cause errors!
