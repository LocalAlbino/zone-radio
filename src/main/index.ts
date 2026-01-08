import { app, BrowserWindow, globalShortcut, ipcMain, shell } from "electron";
import { join } from "path";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { getAccessToken, getAuthorizationCode, getRefreshToken } from "@api/auth";
import { ApiConnectionStatus, SpotifyAccessToken } from "@/types";
import keyCodes from "./keyCodes";

const keybinds = {
  pdaKeybind: "CapsLock",
  playbackKeybind: "Z",
  skipKeybind: "C"
};

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    frame: false,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      devTools: true // TODO: Remove devTools for production
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  // Custom top frame implementation here
  ipcMain.on("window-close", () => mainWindow.close());
  ipcMain.on("window-minimize", () => mainWindow.minimize());
  ipcMain.on("window-maximize", () =>
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  );

  // KeyCodes for UI
  ipcMain.handle("keycodes-keys", (): string[] => Object.keys(keyCodes));
  ipcMain.handle("keycodes-values", (): string[] => Object.values(keyCodes));

  // Handle keybind updates from UI
  ipcMain.on("keybind-pda", (_, key: string) => {
    if (globalShortcut.isRegistered(keybinds.pdaKeybind))
      globalShortcut.unregister(keybinds.pdaKeybind);

    keybinds.pdaKeybind = key;
    globalShortcut.register(keybinds.pdaKeybind, () => console.log("PDA keybind pressed."));
  });
  ipcMain.on("keybind-skip", (_, key: string) => {
    if (globalShortcut.isRegistered(keybinds.skipKeybind))
      globalShortcut.unregister(keybinds.skipKeybind);

    keybinds.skipKeybind = key;
    globalShortcut.register(keybinds.skipKeybind, () => console.log("Skip keybind pressed."));
  });
  ipcMain.on("keybind-playback", (_, key: string) => {
    if (globalShortcut.isRegistered(keybinds.playbackKeybind))
      globalShortcut.unregister(keybinds.playbackKeybind);

    keybinds.playbackKeybind = key;
    globalShortcut.register(keybinds.playbackKeybind, () =>
      console.log("Playback keybind pressed.")
    );
  });

  // PDA status
  let pdaStatus: boolean = false;

  // Spotify API implementation
  let refreshInterval: NodeJS.Timeout | null = null;
  let accessToken: SpotifyAccessToken | null = null;

  ipcMain.handle("spotify-authorize", async (): Promise<ApiConnectionStatus> => {
    // Clear any existing interval
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }

    // NOTE: access token will be used for api calls later, just here for initial implementation
    let accessToken: SpotifyAccessToken;
    try {
      const [code, codeVerifier] = await getAuthorizationCode();
      accessToken = await getAccessToken(code, codeVerifier);
      console.log("accessToken", accessToken);
    } catch (error) {
      console.error(error);
      return "Connection Failed";
    }

    // Create refresh interval with error handling
    refreshInterval = setInterval(async () => {
      try {
        accessToken = await getRefreshToken(accessToken.refresh_token);
      } catch (error) {
        console.error("Token refresh failed:", error);
        if (refreshInterval) {
          clearInterval(refreshInterval);
          refreshInterval = null;
        }
        mainWindow.webContents.send("spotify-connection-lost");
      }
    }, accessToken.expires_in * 1000); // Convert to milliseconds

    return "Connected";
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Set initial keybinds
  globalShortcut.register(keybinds.pdaKeybind, () => console.log("PDA keybind pressed."));
  globalShortcut.register(keybinds.skipKeybind, () => console.log("Skip keybind pressed."));
  globalShortcut.register(keybinds.playbackKeybind, () => console.log("Playback keybind pressed."));

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  globalShortcut.unregisterAll();
  if (process.platform !== "darwin") {
    app.quit();
  }
});
