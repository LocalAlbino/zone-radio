import React from "react";
import clsx from "clsx";
import { ApiConnectionStatus } from "@renderer/types";

type InfoPanelProps = {
  connectionStatus: ApiConnectionStatus;
};

export default function InfoPanel({ connectionStatus }: InfoPanelProps): React.JSX.Element {
  return (
    <div className="select-none w-screen bg-blue-800 p-8 flex flex-row justify-between items-center">
      <span className="font-bold text-white text-2xl">Zone Radio</span>
      <div className="flex flex-row items-baseline gap-1">
        <div className="relative size-4">
          <div
            className={clsx(
              "absolute size-4 rounded-full animate-ping",
              connectionStatus === "Connected" && "bg-green-600",
              connectionStatus === "Not Connected" && "bg-zinc-600",
              connectionStatus === "Connecting" && "bg-yellow-600",
              connectionStatus === "Connection Failed" && "bg-red-600"
            )}
          ></div>
          <div
            className={clsx(
              "absolute size-4 rounded-full",
              connectionStatus === "Connected" && "bg-green-600",
              connectionStatus === "Not Connected" && "bg-zinc-600",
              connectionStatus === "Connecting" && "bg-yellow-600",
              connectionStatus === "Connection Failed" && "bg-red-600"
            )}
          ></div>
        </div>
        <span className="font-bold text-white text-2xl">{connectionStatus}</span>
      </div>
    </div>
  );
}
