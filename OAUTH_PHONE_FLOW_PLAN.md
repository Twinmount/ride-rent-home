# OAuth Phone Number Collection Flow Plan

## Overview
When a new user signs in with Google OAuth, they need to provide their phone number to complete their profile. This document outlines the complete flow.

## Flow Diagram

```
User clicks "Sign in with Google"
    ↓
Google OAuth Authentication
    ↓
NextAuth Callback (signIn callback)
    ↓
handleOAuthUser() checks if user exists
    ↓
┌─────────────────────────────────────┐
│ Is New User?                       │
└─────────────────────────────────────┘
    │                    │
   YES                  NO
    │                    │
    ↓                    ↓
Create OAuth User    Link to Existing
    │                    │
    ↓                    ↓
Check if phone      Complete Login
number exists
    │
    ↓
┌─────────────────────────────────────┐
│ Has Phone Number?                   │
└─────────────────────────────────────┘
    │                    │
   NO                   YES
    │                    │
    ↓                    ↓
Store flag in JWT    Complete Login
    │
    ↓
Redirect to Phone Collection Page
    ↓
User enters phone number
    ↓
Send OTP to phone
    ↓
User verifies OTP
    ↓
Link phone to OAuth account
    ↓
Complete Login
```

## Implementation Steps

### Step 1: Update JWT Callback to Detect Phone Requirement
**File**: `src/lib/auth/auth.option.ts`

- In the `jwt` callback, after handling OAuth user:
  - Check if `isNewUser === true`
  - Check if user has `phoneNumber` (from user profile or API response)
  - If new user AND no phone number:
    - Set `token.requiresPhoneNumber = true`
    - Set `token.isOAuthNewUser = true`
    - Store `userId` in token

### Step 2: Update Session Callback
**File**: `src/lib/auth/auth.option.ts`

- In the `session` callback:
  - Pass `requiresPhoneNumber` flag to session
  - This allows components to check if phone is needed

### Step 3: Create API Endpoint for Adding Phone to OAuth User
**File**: `src/lib/api/auth.api.ts`

- Add new endpoint: `ADD_PHONE_TO_OAUTH_USER`
- Method: `addPhoneToOAuthUser(userId, phoneNumber, countryCode)`
- This will:
  1. Send OTP to the phone number
  2. Return `otpId` for verification

### Step 4: Create Phone Collection Page/Component
**File**: `src/app/oauth/complete-profile/page.tsx` (new file)

- Create a dedicated page for OAuth users to add phone number
- Steps:
  1. Phone number input with country code selector
  2. Send OTP
  3. OTP verification
  4. Link phone to account
  5. Redirect to dashboard/home

### Step 5: Update OAuth Callback Handler
**File**: `src/app/oauth/[provider]/callback/page.tsx`

- After successful OAuth authentication:
  - Check session for `requiresPhoneNumber` flag
  - If true, redirect to `/oauth/complete-profile`
  - Otherwise, redirect to callback URL

### Step 6: Update useOAuth Hook
**File**: `src/hooks/useOAuth.ts`

- After OAuth success:
  - Check if phone number is required
  - Handle redirect to phone collection page
  - Update loading/error states accordingly

### Step 7: Create Phone Collection Component
**File**: `src/components/auth/OAuthPhoneCollection.tsx` (new file)

- Reusable component for phone collection
- Similar to existing `PhoneStep` but for OAuth users
- Handles:
  - Phone input
  - OTP sending
  - OTP verification
  - Account completion

## API Endpoints Needed

### Backend Endpoints (to be implemented in backend)

1. **Add Phone to OAuth User**
   - `POST /auth/add-phone-to-oauth-user`
   - Body: `{ userId: string, phoneNumber: string, countryCode: string }`
   - Response: `{ success: boolean, data: { otpId: string, otpExpiresIn: number } }`

2. **Verify OTP and Link Phone to OAuth User**
   - `POST /auth/verify-oauth-phone`
   - Body: `{ userId: string, otpId: string, otp: string }`
   - Response: `{ success: boolean, data: { user: User, accessToken: string, refreshToken: string } }`

## Data Flow

### JWT Token Structure (Updated)
```typescript
{
  // ... existing fields
  requiresPhoneNumber?: boolean;
  isOAuthNewUser?: boolean;
  oauthUserId?: string;
}
```

### Session Structure (Updated)
```typescript
{
  // ... existing fields
  requiresPhoneNumber?: boolean;
  isOAuthNewUser?: boolean;
}
```

## User Experience Flow

1. **User clicks "Sign in with Google"**
   - Opens OAuth popup
   - User authenticates with Google

2. **After Google Auth Success**
   - If new user without phone → Redirect to phone collection page
   - If existing user → Complete login normally

3. **Phone Collection Page**
   - Shows: "Complete your profile - Add your phone number"
   - Phone input with country selector
   - "Send OTP" button

4. **OTP Verification**
   - User enters 4-digit OTP
   - "Verify" button
   - On success: Phone linked, user logged in, redirect to home

5. **Error Handling**
   - Invalid phone number → Show error
   - Invalid OTP → Show error with resend option
   - Network errors → Show retry option

## Security Considerations

1. **User ID Validation**
   - Ensure `userId` in JWT matches the user making the request
   - Prevent phone number hijacking

2. **OTP Rate Limiting**
   - Limit OTP requests per user
   - Prevent spam/abuse

3. **Session Validation**
   - Verify user is authenticated before allowing phone addition
   - Check OAuth session is valid

## Testing Checklist

- [ ] New OAuth user without phone → Redirects to phone collection
- [ ] New OAuth user with phone → Completes login normally
- [ ] Existing OAuth user → Completes login normally
- [ ] Phone collection page displays correctly
- [ ] OTP sending works
- [ ] OTP verification works
- [ ] Phone successfully linked to account
- [ ] User redirected after phone verification
- [ ] Error handling works (invalid phone, invalid OTP)
- [ ] Resend OTP works
- [ ] Session persists after phone addition

## Files to Create/Modify

### New Files
1. `src/app/oauth/complete-profile/page.tsx` - Phone collection page
2. `src/components/auth/OAuthPhoneCollection.tsx` - Phone collection component

### Modified Files
1. `src/lib/auth/auth.option.ts` - Add phone requirement detection
2. `src/lib/api/auth.api.ts` - Add phone addition API methods
3. `src/app/oauth/[provider]/callback/page.tsx` - Add redirect logic
4. `src/hooks/useOAuth.ts` - Handle phone requirement
5. `src/types/auth.types.ts` - Add new types if needed

## Next Steps

1. Implement backend endpoints for phone addition
2. Update JWT callback to detect phone requirement
3. Create phone collection page
4. Update OAuth callback handler
5. Test complete flow
6. Add error handling and edge cases


