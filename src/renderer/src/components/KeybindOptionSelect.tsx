import React from "react";

export default function KeybindOptionSelect(): React.JSX.Element {
  // NOTE: placeholder values for initial ui implementation
  const options = ["one", "two", "three", "four", "five", "six"];
  const optionsList = options.map((option, idx) => (
    <option key={idx} value={option}>
      {option}
    </option>
  ));

  return (
    <select
      className="hover:bg-gray-800 bg-gray-900 text-white p-2 outline-1 outline-gray-800 hover:outline-gray-700 rounded-sm"
      aria-placeholder="Keybind"
    >
      {optionsList}
    </select>
  );
}
