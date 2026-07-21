// Google Classroom Sync Setup - pasted from cchackersapi:
// 1. Go to https://console.cloud.google.com
// 2. Create a new project (or use existing).
// 3. Enable the "Google Classroom API" in APIs & Services.
// 4. Go to APIs & Services > Credentials > Create Credentials > OAuth 2.0 Client ID.
// 5. Application type: Web Application.
// 6. Authorized redirect URI: http://localhost:3000/api/hub/classroom-auth (for dev).
// 7. Copy the Client ID and Client Secret into .env.local.
// 8. Run the auth flow once by visiting /api/hub/classroom-auth in your browser.
// 9. Paste the refresh token from the response into .env.local as GOOGLE_REFRESH_TOKEN.

import { NextResponse, type NextRequest } from "next/server";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  console.log("[classroom-auth] GOOGLE_CLIENT_ID present:", !!clientId);
  console.log("[classroom-auth] GOOGLE_CLIENT_SECRET present:", !!clientSecret);
  console.log("[classroom-auth] GOOGLE_REDIRECT_URI:", redirectUri);

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "Missing Google env vars. Check .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/classroom.announcements.readonly",
      access_type: "offline",
      prompt: "consent",
    });

    return NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
  }

  // exchange code for tokens
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();

  if (tokens.error) {
    return NextResponse.json({ error: tokens.error, description: tokens.error_description }, { status: 400 });
  }

  // log the refresh token so it can be copied
  console.log("=== GOOGLE REFRESH TOKEN ===");
  console.log(tokens.refresh_token);
  console.log("============================");

  return NextResponse.json({
    message: "Copy this refresh_token into your .env.local as GOOGLE_REFRESH_TOKEN",
    refresh_token: tokens.refresh_token,
  });
}
