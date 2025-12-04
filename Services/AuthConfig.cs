namespace ZoneRadio.Services;

public static class AuthConfig
{
    public static readonly string ClientId = "5804ec5101b54d758998e50dbd5c1d38";
    public static readonly string RedirectUri = "http://127.0.0.1:8888/zone-radio/";
    public static readonly string Scope = "user-read-private user-read-email user-read-playback-state user-modify-playback-state";
}
