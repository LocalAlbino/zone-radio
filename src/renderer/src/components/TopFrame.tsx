import React from "react";
import CloseIcon from "../assets/close-con.svg?react";
import MaximizeIcon from "../assets/maximize-icon.svg?react";
import MinimizeIcon from "../assets/minimize-icon.svg?react";

export default function TopFrame(): React.JSX.Element {
  return (
    <div className="frame w-screen flex flex-row-reverse bg-blue-800">
      <button
        aria-label="Close"
        className="frame-button py-1 px-2 text-blue-500 bg-blue-800 hover:text-white hover:bg-red-500"
      >
        <CloseIcon />
      </button>
      <button
        aria-label="Maximize"
        className="frame-button py-1 px-2 text-blue-500 hover:text-white bg-blue-800 hover:bg-blue-700"
      >
        <MaximizeIcon />
      </button>
      <button
        aria-label="Minimize"
        className="frame-button py-1 px-2 text-blue-500 hover:text-white bg-blue-800 hover:bg-blue-700"
      >
        <MinimizeIcon />
      </button>
    </div>
  );
}
