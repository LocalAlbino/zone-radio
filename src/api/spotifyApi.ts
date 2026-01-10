import auth from "./auth";
import playback from "./playback";

const spotifyApi = {
  auth: auth,
  playback: playback,
  token: playback.accessToken.access_token
};

export default spotifyApi;
