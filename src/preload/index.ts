import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
  onCloseButtonClick: () => ipcRenderer.send("window-close"),
  onMinimizeButtonClick: () => ipcRenderer.send("window-minimize"),
  onMaximizeButtonClick: () => ipcRenderer.send("window-maximize"),
  getSpotifyAuthCode: async () => ipcRenderer.invoke("spotify-authorize"),
  spotifyConnectionLost: (callback: () => void) =>
    ipcRenderer.on("spotify-connection-lost", () => callback())
} as const;

const keyCodes = {
  keys: async () => ipcRenderer.invoke("keycodes-keys"),
  values: async () => ipcRenderer.invoke("keycodes-values")
} as const;

// Used in index.d.ts for tsc
export type API = typeof api;
export type KeyCodes = typeof keyCodes;

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("keyCodes", keyCodes);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
  // @ts-ignore (define in dts)
  window.keyCodes = keyCodes;
}
