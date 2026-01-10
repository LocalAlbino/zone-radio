import { app, BrowserWindow, globalShortcut, ipcMain, shell } from "electron";
import { join } from "path";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import spotifyApi from "@/api/spotifyApi";
import { ApiConnectionStatus } from "@/types";
import { uIOhook, UiohookKey } from "uiohook-napi";

const keybinds = {
  togglePdaKeybind: "CapsLock",
  togglePlaybackKeybind: "Z",
  toggleSkipKeybind: "C"
};

const pda = {
  status: false,
  updateCallback: (status: boolean): void => console.log(status)
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
      sandbox: false
    }
  });

  pda.updateCallback = (status: boolean) => {
    mainWindow.webContents.send("update-pda", status);
  };

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
  ipcMain.handle("keycodes-keys", (): string[] => Object.keys(UiohookKey));

  // Handle keybind updates from UI
  ipcMain.on("keybind-pda", (_, key: string) => {
    keybinds.togglePdaKeybind = key;
    console.log("PDA keybind updated.");
  });
  ipcMain.on("keybind-skip", (_, key: string) => {
    keybinds.toggleSkipKeybind = key;
    console.log("Skip keybind updated.");
  });
  ipcMain.on("keybind-playback", (_, key: string) => {
    keybinds.togglePlaybackKeybind = key;
    console.log("Playback keybind updated.");
  });

  // Spotify API implementation
  let refreshInterval: NodeJS.Timeout | null = null;
  ipcMain.handle("spotify-authorize", async (): Promise<ApiConnectionStatus> => {
    // Clear any existing interval
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }

    try {
      const [code, codeVerifier] = await spotifyApi.auth.getAuthorizationCode();

      // Initialize playback
      spotifyApi.playback.accessToken = await spotifyApi.auth.getAccessToken(code, codeVerifier);
      spotifyApi.token = spotifyApi.playback.accessToken.access_token;
      console.log(spotifyApi.token);
      await spotifyApi.playback.getIsPremium(spotifyApi.token);
      await spotifyApi.playback.getIsPlaying(spotifyApi.token);
    } catch (error) {
      console.error(error);
      return "Connection Failed";
    }

    // Create refresh interval with error handling
    refreshInterval = setInterval(async () => {
      try {
        spotifyApi.playback.accessToken = await spotifyApi.auth.getRefreshToken(
          spotifyApi.playback.accessToken.refresh_token
        );
        spotifyApi.token = spotifyApi.playback.accessToken.access_token;
      } catch (error) {
        console.error("Token refresh failed:", error);
        if (refreshInterval) {
          clearInterval(refreshInterval);
          refreshInterval = null;
        }
        mainWindow.webContents.send("spotify-connection-lost");
      }
    }, spotifyApi.playback.accessToken.expires_in * 1000); // Convert to milliseconds

    return "Connected";
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Initialize keybind listener
  uIOhook.on("keydown", (e) => {
    if (e.keycode === UiohookKey[keybinds.togglePdaKeybind]) {
      console.log("PDA keybind pressed.");
      pda.status = !pda.status;
      pda.updateCallback(pda.status);
    } else if (e.keycode === UiohookKey[keybinds.togglePlaybackKeybind]) {
      if (pda.status) spotifyApi.playback.togglePlayback(spotifyApi.token);
      console.log("Playback keybind pressed.");
    } else if (e.keycode === UiohookKey[keybinds.toggleSkipKeybind]) {
      if (pda.status) spotifyApi.playback.skipSong(spotifyApi.token);
      console.log("Skip keybind pressed.");
    }
  });
  uIOhook.start();

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
