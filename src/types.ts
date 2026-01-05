import { z } from "zod";

export type ApiConnectionStatus =
  | "Connected"
  | "Not Connected"
  | "Connecting"
  | "Connection Failed";

export const SpotifyAccessTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  scope: z.string(),
  expires_in: z.number(),
  refresh_token: z.string()
});

export type SpotifyAccessToken = z.infer<typeof SpotifyAccessTokenSchema>;
