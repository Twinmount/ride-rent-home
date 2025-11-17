# OAuth Setup Guide for NextAuth

This guide explains how to set up OAuth authentication using NextAuth.js for Google, Facebook, and Apple sign-in.

## 📋 Prerequisites

- Next.js application with NextAuth.js installed
- OAuth credentials from each provider (Google, Facebook, Apple)
- Environment variables configured

## 🔧 Environment Variables Setup

Add the following environment variables to your `.env.development` and `.env.production` files:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000  # Development URL
NEXTAUTH_SECRET=your-secret-key-here  # Generate using: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Apple OAuth
APPLE_ID=your-apple-service-id
APPLE_SECRET=your-apple-private-key
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## 🔐 Provider Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen:
   - User Type: External (for testing) or Internal (for workspace)
   - Application name, support email, developer contact
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the **Client ID** and **Client Secret** to your `.env` file

### 2. Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add **Facebook Login** product
4. Go to **Settings** → **Basic**:
   - Add **App Domains**: `localhost` (development), `yourdomain.com` (production)
   - Add **Privacy Policy URL** and **Terms of Service URL**
5. Go to **Settings** → **Basic** → **Add Platform** → **Website**:
   - Site URL: `http://localhost:3000` (development) or `https://yourdomain.com` (production)
6. Go to **Facebook Login** → **Settings**:
   - Valid OAuth Redirect URIs:
     - `http://localhost:3000/api/auth/callback/facebook` (development)
     - `https://yourdomain.com/api/auth/callback/facebook` (production)
7. Copy the **App ID** and **App Secret** to your `.env` file

### 3. Apple OAuth Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a **Services ID**:
   - Identifier: e.g., `com.yourcompany.yourapp`
   - Enable **Sign in with Apple**
   - Configure domains and redirect URLs:
     - Domains: `yourdomain.com`
     - Return URLs:
       - `https://yourdomain.com/api/auth/callback/apple`
4. Create a **Key**:
   - Key Name: e.g., "Sign in with Apple Key"
   - Enable **Sign in with Apple**
   - Download the `.p8` key file
5. Note the **Key ID** and **Team ID**
6. Create a private key file (`.p8`) and convert it to the format needed for NextAuth
7. For NextAuth, you'll need to create a JWT using the private key. The `APPLE_SECRET` should be a JSON string containing:
   ```json
   {
     "kid": "YOUR_KEY_ID",
     "iss": "YOUR_TEAM_ID",
     "key": "YOUR_PRIVATE_KEY_CONTENT"
   }
   ```

## 📁 File Structure

The OAuth implementation consists of the following files:

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth API route handler
│   └── layout.tsx                     # Root layout with SessionProvider
├── components/
│   ├── providers/
│   │   └── SessionProvider.tsx        # NextAuth SessionProvider wrapper
│   └── dialog/
│       └── login-dialog/
│           └── components/
│               └── PhoneStep.tsx      # Login component with OAuth buttons
├── hooks/
│   └── useOAuth.ts                    # Custom hook for OAuth sign-in
└── lib/
    └── auth/
        └── auth.option.ts             # NextAuth configuration
```

## 🚀 How It Works

### 1. SessionProvider Setup

The `SessionProvider` wraps your application in `layout.tsx` to provide session context throughout the app.

### 2. OAuth Configuration

The `auth.option.ts` file configures:

- OAuth providers (Google, Facebook, Apple)
- JWT callbacks to store user data
- Session callbacks to expose user information
- Redirect handling

### 3. OAuth Sign-In Hook

The `useOAuth` hook provides:

- `signInWithProvider(provider)` - Function to initiate OAuth flow
- `isLoading` - Loading state
- `error` - Error message if sign-in fails
- `session` - Current session data
- `status` - Session status

### 4. Usage in Components

```tsx
import { useOAuth } from "@/hooks/useOAuth";

function LoginComponent() {
  const { signInWithProvider, isLoading } = useOAuth();

  return (
    <button onClick={() => signInWithProvider("google")}>
      Sign in with Google
    </button>
  );
}
```

## 🔄 OAuth Flow

1. User clicks a social login button
2. `signInWithProvider()` is called
3. User is redirected to the OAuth provider's consent screen
4. User authorizes the application
5. Provider redirects back to `/api/auth/callback/[provider]`
6. NextAuth processes the callback and creates a session
7. User is redirected back to the application
8. Session data is available via `useSession()` hook

## 📝 Accessing Session Data

```tsx
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Not signed in</p>;

  return (
    <div>
      <p>Signed in as {session?.user?.email}</p>
      <p>Provider: {session?.provider}</p>
      <p>Access Token: {session?.accessToken}</p>
    </div>
  );
}
```

## 🔒 Security Considerations

1. **Never commit `.env` files** - Add them to `.gitignore`
2. **Use strong NEXTAUTH_SECRET** - Generate using `openssl rand -base64 32`
3. **Use HTTPS in production** - OAuth requires secure connections
4. **Validate redirect URLs** - Only allow trusted domains
5. **Store secrets securely** - Use environment variables or secret management services

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure redirect URIs in provider settings match exactly
   - Check for trailing slashes
   - Verify protocol (http vs https)

2. **"NEXTAUTH_SECRET is missing"**
   - Add `NEXTAUTH_SECRET` to your `.env` file
   - Restart your development server

3. **"Provider not found"**
   - Verify provider credentials in `.env`
   - Check that provider is enabled in `auth.option.ts`

4. **Session not persisting**
   - Check browser cookies are enabled
   - Verify `NEXTAUTH_URL` matches your current URL
   - Check session strategy in `auth.option.ts`

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Setup](https://developers.facebook.com/docs/facebook-login/)
- [Apple Sign In Setup](https://developer.apple.com/sign-in-with-apple/)

## ✅ Checklist

- [ ] Environment variables configured
- [ ] Google OAuth credentials set up
- [ ] Facebook OAuth credentials set up
- [ ] Apple OAuth credentials set up (if needed)
- [ ] Redirect URIs configured in all providers
- [ ] `NEXTAUTH_SECRET` generated and added
- [ ] `NEXTAUTH_URL` set correctly
- [ ] SessionProvider added to layout
- [ ] OAuth buttons wired up in components
- [ ] Test OAuth flow in development
- [ ] Update production environment variables
- [ ] Test OAuth flow in production
