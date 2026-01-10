import { SpotifyAccessToken } from "@/types";

const playback = {
  accessToken: {} as SpotifyAccessToken,
  isPlaying: false,
  isPremium: false,

  getIsPremium: async (token: string) => {
    const body = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const response = await body.json();
    console.log(response);
    if (!response.product) throw new Error("User product not found");
    if (response.product === "premium") playback.isPremium = true;
  },

  getIsPlaying: async (token: string): Promise<void> => {
    const body = await fetch("https://api.spotify.com/v1/me/player", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const response = await body.json();
    console.log(response);
    if (!response.is_playing || typeof response.is_playing !== "boolean")
      throw new Error("User's spotify was not found");
    playback.isPlaying = response.is_playing as boolean;
  },

  pausePlayback: async (token: string): Promise<void> => {
    // We don't need any data from the response
    await fetch("https://api.spotify.com/v1/me/player/pause", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    playback.isPlaying = false;
  },

  resumePlayback: async (token: string): Promise<void> => {
    // We don't need any data from the response
    await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    playback.isPlaying = true;
  },

  togglePlayback: async (token: string): Promise<void> => {
    if (playback.isPlaying) await playback.pausePlayback(token);
    else await playback.resumePlayback(token);
  },

  skipSong: async (token: string): Promise<void> => {
    // We don't need any data from the response
    await fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default playback;
