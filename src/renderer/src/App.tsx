import React from "react";
import InfoPanel from "@renderer/components/InfoPanel";
import TopFrame from "@renderer/components/TopFrame";
import KeybindOption from "@renderer/components/KeybindOption";
import InfoIcon from "./assets/info-icon.svg?react";
import { ApiConnectionStatus } from "@renderer/types";

export default function App(): React.JSX.Element {
  // NOTE: placeholder for initial ui implementation
  const connectionStatus: ApiConnectionStatus = "Not Connected";

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
        />
        <KeybindOption
          name="Toggle Playback"
          description="This is the keybind that you'll use to toggle music playback. The PDA must be open."
        />
        <KeybindOption
          name="Skip Song"
          description="This is the keybind that you'll use to skip the current song. The PDA must be open."
        />
        <div className="flex flex-col gap-4 mx-4 my-8">
          <span className="flex flex-row gap-1 text-gray-400 text-md">
            <InfoIcon />
            Zone Radio will open a browser window to connect to your Spotify. In order for Zone
            Radio to work, you&#39;ll need a Spotify Premium subscription for your account.
          </span>
          <button className="bg-blue-800 hover:bg-blue-700 font-bold text-white text-lg rounded-md p-2">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
