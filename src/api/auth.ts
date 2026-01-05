import open from "open";
import express, { Request, Response } from "express";
import { SpotifyAccessToken, SpotifyAccessTokenSchema } from "@/types";

function generateRandomString(length: number): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

function base64encode(input: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function generateCodeChallenge(length: number): Promise<string[]> {
  const codeVerifier = generateRandomString(length);
  const hashed: ArrayBuffer = await sha256(codeVerifier);
  return [base64encode(hashed), codeVerifier];
}

async function handleRedirect(port: number): Promise<string> {
  const app = express();
  const redirected = new Promise((resolve) => {
    app.get("/zone-radio", (req: Request, res: Response) => {
      res.send(
        "<html lang='en'><body>You can close this browser window now. Check Zone Radio to see if your connection was successful.</body></html>"
      );
      resolve(req.query.code);
    });
  });

  const server = app.listen(8888, () => {
    console.log(`Redirect server listening on port ${port}`);
  });

  const code = await redirected;
  server.close(() => console.log(`Redirect server closed`));

  if (typeof code !== "string") throw new Error("Unable to get code from request query.");
  return code as string;
}

export async function getAuthorizationCode(): Promise<string[]> {
  const [codeChallenge, codeVerifier] = await generateCodeChallenge(64);
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  // With PKCE we can expose this safely
  const params = {
    response_type: "code",
    client_id: "5804ec5101b54d758998e50dbd5c1d38",
    scope: "user-read-private user-read-email user-read-playback-state user-modify-playback-state",
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: "http://127.0.0.1:8888/zone-radio/"
  };

  authUrl.search = new URLSearchParams(params).toString();
  await open(authUrl.toString());
  return [await handleRedirect(8888), codeVerifier];
}

export async function getAccessToken(
  code: string,
  codeVerifier: string
): Promise<SpotifyAccessToken> {
  const params = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: "http://127.0.0.1:8888/zone-radio/",
    client_id: "5804ec5101b54d758998e50dbd5c1d38",
    code_verifier: codeVerifier
  };

  const body = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(params).toString()
  });
  const response = await body.json();
  console.log(response);
  return SpotifyAccessTokenSchema.parse(response);
}
