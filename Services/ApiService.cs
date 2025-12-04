using System.Diagnostics;
using System.Drawing.Text;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Web;

namespace ZoneRadio.Services;

public class ApiService
{
    public enum AuthStatus
    {
        NotStarted,
        InProgress,
        Completed,
        Failed
    }

    private readonly HttpClient _httpClient;
    private readonly HttpListener _httpListener;
    private string? _code;
    private string _codeVerifier;
    private string _codeChallenge;
    private AccessTokenResponse? _accessToken;

    public ApiService()
    {
        _httpClient = new HttpClient();
        _httpListener = new HttpListener();
        _code = null;
        _codeVerifier = PkceUtility.GenerateCodeVerifier();
        _codeChallenge = PkceUtility.GenerateCodeChallenge(_codeVerifier);
        _accessToken = null;
    }

    private void InitializeListener()
    {
        _httpListener.Prefixes.Add(AuthConfig.RedirectUri);
        _httpListener.Start();
    }

    private async Task ListenForRedirectAsync()
    {
        var ctx = await _httpListener.GetContextAsync();
        var resp = ctx.Response;

        resp.StatusCode = 200;
        resp.ContentType = "text/html";

        var buffer = Encoding.UTF8.GetBytes(
            "<html><body>Login successful, you can close this window now.</body></html>");
        resp.OutputStream.Write(buffer, 0, buffer.Length);

        _code = ctx.Request.QueryString["code"];

        resp.Close();
        _httpListener.Stop();
    }

    public async Task<AuthStatus> RequestAuthAsync()
    {
        var authUri = new UriBuilder("https://accounts.spotify.com/authorize");
        var queryString = HttpUtility.ParseQueryString(authUri.Query);

        queryString["client_id"] = AuthConfig.ClientId;
        queryString["response_type"] = "code";
        queryString["redirect_uri"] = AuthConfig.RedirectUri;
        queryString["scope"] = AuthConfig.Scope;
        queryString["code_challenge_method"] = "S256";
        queryString["code_challenge"] = _codeChallenge;

        authUri.Query = queryString.ToString();

        InitializeListener();
        Process.Start(new ProcessStartInfo
        {
            FileName = authUri.ToString(),
            UseShellExecute = true
        });
        await ListenForRedirectAsync();

        return AuthStatus.InProgress;
    }

    public async Task<AuthStatus> RequestAccessTokenAsync()
    {
        if (_code is null) return AuthStatus.Failed;

        var body = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            {"grant_type", "authorization_code" },
            {"code", _code },
            {"redirect_uri", AuthConfig.RedirectUri },
            {"client_id", AuthConfig.ClientId },
            {"code_verifier", _codeVerifier }
        });

        var resp = await _httpClient.PostAsync("https://accounts.spotify.com/api/token", body);
        _accessToken = await resp.Content.ReadFromJsonAsync<AccessTokenResponse>();

        return AuthStatus.Completed;
    }

    public async Task<bool> CheckUserHasPremium()
    {
        if (_accessToken is null) return false;

        _httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _accessToken?.AccessToken);

        var resp = await _httpClient.GetAsync("https://api.spotify.com/v1/me");
        var result = await resp.Content.ReadFromJsonAsync<UserProductStatus>();
        return result?.product == "premium";
    }

    public async Task<bool> GetPlaybackState()
    {
        _httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _accessToken?.AccessToken);

        var resp = await _httpClient.GetAsync("https://api.spotify.com/v1/me/player");
        var result = await resp.Content.ReadFromJsonAsync<PlaybackState>();
        return result?.is_playing ?? false;
    }

    private async Task PausePlayback()
    {
        _httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _accessToken?.AccessToken);
        await _httpClient.PutAsync("https://api.spotify.com/v1/me/player/pause", null);
    }

    private async Task ResumePlayback()
    {
        _httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _accessToken?.AccessToken);
        await _httpClient.PutAsync("https://api.spotify.com/v1/me/player/play", null);
    }

    public async Task TogglePlayback(bool isPlaying)
    {
        if (isPlaying)
            await PausePlayback();
        else
            await ResumePlayback();
    }

    public async Task SkipToNext()
    {
        _httpClient.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _accessToken?.AccessToken);
        await _httpClient.PostAsync("https://api.spotify.com/v1/me/player/next", null);
    }

    

    private record UserProductStatus(string product);
    private record PlaybackState(bool is_playing);
}
