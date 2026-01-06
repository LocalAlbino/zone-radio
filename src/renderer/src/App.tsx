import React, { useState } from "react";
import InfoPanel from "@renderer/components/InfoPanel";
import TopFrame from "@renderer/components/TopFrame";
import KeybindOption from "@renderer/components/KeybindOption";
import InfoIcon from "@renderer/assets/info-icon.svg?react";
import { ApiConnectionStatus } from "@/types";
import clsx from "clsx";

export default function App(): React.JSX.Element {
  const [connectionStatus, setConnectionStatus] = useState<ApiConnectionStatus>("Not Connected");

  async function handleClick(): Promise<void> {
    if (connectionStatus === "Connected" || connectionStatus === "Connecting") return;

    setConnectionStatus("Connecting");

    const result: ApiConnectionStatus = await window.api.getSpotifyAuthCode();
    setConnectionStatus(result);
  }

  // Handle disconnect if error occurs in main
  window.api.spotifyConnectionLost(() => setConnectionStatus("Not Connected"));

  return (
    <div className="flex flex-col inset-0 fixed bg-gray-950">
      <div>
        <TopFrame />
        <InfoPanel connectionStatus={connectionStatus} />
      </div>
      <div className="m-8 flex flex-col gap-4">
        <span className="text-white text-lg font-bold">Keybind Setup</span>
        <KeybindOption
          name="Toggle PDA"
          description="This is the keybind that you'll use to toggle the PDA."
          defaultValue="CapsLock"
        />
        <KeybindOption
          name="Toggle Playback"
          description="This is the keybind that you'll use to toggle music playback. The PDA must be open."
          defaultValue="Z"
        />
        <KeybindOption
          name="Skip Song"
          description="This is the keybind that you'll use to skip the current song. The PDA must be open."
          defaultValue="C"
        />
        <div className="flex flex-col gap-4 mx-4 my-8">
          <span className="flex flex-row gap-1 text-gray-400 text-md">
            <InfoIcon />
            Zone Radio will open a browser window to connect to your Spotify. In order for Zone
            Radio to work, you&#39;ll need a Spotify Premium subscription for your account.
          </span>
          <button
            disabled={connectionStatus === "Connected" || connectionStatus === "Connecting"}
            className={clsx(
              (connectionStatus === "Not Connected" || connectionStatus === "Connection Failed") &&
                "bg-blue-800 hover:bg-blue-700",
              (connectionStatus === "Connected" || connectionStatus === "Connecting") &&
                "bg-gray-800 hover:bg-gray-800",
              "font-bold text-white text-lg rounded-md p-2"
            )}
            onClick={handleClick}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
