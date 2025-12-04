using System.Security.Cryptography;
using System.Text;

namespace ZoneRadio.Services;

public static class PkceUtility
{
    public static string GenerateCodeVerifier()
    {
        const int length = 128;
        const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
        var random = new Random();
        var codeVerifier = new char[length];
        for (int i = 0; i < length; i++)
        {
            codeVerifier[i] = chars[random.Next(chars.Length)];
        }
        return new string(codeVerifier);
    }

    public static string GenerateCodeChallenge(string codeVerifier)
    {
        var bytes = Encoding.ASCII.GetBytes(codeVerifier);
        var hash = SHA256.HashData(bytes);
        return Base64UrlEncode(hash);
    }

    private static string Base64UrlEncode(byte[] input)
    {
        var base64 = Convert.ToBase64String(input);
        return base64.Replace("+", "-").Replace("/", "_").Replace("=", "");
    }
}
