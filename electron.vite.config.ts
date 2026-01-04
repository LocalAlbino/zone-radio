import { resolve } from "path";
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@": resolve("src"),
        "@api": resolve("src/api")
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        "@": resolve("src"),
        "@api": resolve("src/api")
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src"),
        "@renderer": resolve("src/renderer/src"),
        "@assets": resolve("src/renderer/src/assets"),
        "@api": resolve("src/api")
      }
    },
    plugins: [react(), tailwindcss(), svgr()]
  }
});
