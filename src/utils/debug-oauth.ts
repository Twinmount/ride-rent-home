/**
 * OAuth Debugging Utilities
 * 
 * Use these functions to debug OAuth redirect URI issues
 */

/**
 * Get the expected redirect URI for a given provider
 */
export function getExpectedRedirectUri(provider: "google" | "facebook" | "apple"): string {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${baseUrl}/api/auth/callback/${provider}`;
}

/**
 * Log all expected redirect URIs
 * Useful for debugging redirect_uri_mismatch errors
 */
export function logExpectedRedirectUris(): void {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  console.log("🔍 OAuth Redirect URI Debug Info:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("NEXTAUTH_URL:", baseUrl);
  console.log("");
  console.log("Expected Redirect URIs:");
  console.log("  Google:", `${baseUrl}/api/auth/callback/google`);
  console.log("  Facebook:", `${baseUrl}/api/auth/callback/facebook`);
  console.log("  Apple:", `${baseUrl}/api/auth/callback/apple`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("⚠️  Make sure these EXACT URIs are configured in your OAuth provider console!");
  console.log("⚠️  Check for:");
  console.log("    - Protocol mismatch (http vs https)");
  console.log("    - Port mismatch (:3000 vs :3001)");
  console.log("    - Trailing slashes");
  console.log("    - Domain mismatch (localhost vs 127.0.0.1)");
}

/**
 * Validate redirect URI configuration
 */
export function validateRedirectUriConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check NEXTAUTH_URL
  if (!process.env.NEXTAUTH_URL) {
    errors.push("NEXTAUTH_URL environment variable is not set");
  } else {
    const url = process.env.NEXTAUTH_URL;

    // Check for trailing slash
    if (url.endsWith("/")) {
      errors.push("NEXTAUTH_URL should not have a trailing slash");
    }

    // Check protocol
    if (process.env.NODE_ENV === "development" && url.startsWith("https://")) {
      warnings.push("Using HTTPS in development - make sure your OAuth provider allows it");
    }

    if (process.env.NODE_ENV === "production" && url.startsWith("http://")) {
      errors.push("Using HTTP in production - OAuth requires HTTPS");
    }
  }

  // Check required secrets
  if (!process.env.NEXTAUTH_SECRET) {
    errors.push("NEXTAUTH_SECRET environment variable is not set");
  }

  // Check provider credentials
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    warnings.push("Google OAuth credentials not configured");
  }

  if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
    warnings.push("Facebook OAuth credentials not configured");
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_SECRET) {
    warnings.push("Apple OAuth credentials not configured");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

