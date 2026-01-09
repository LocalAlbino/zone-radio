import React, { useEffect, useState } from "react";

type KeybindOptionSelectProps = {
  defaultValue: string;
  callback: (key: string) => void;
  selectId: number; // Used to index window.localStorage["keybinds"]
  userValues: string[];
  updateUserValues: (idx: number, key: string) => void;
};

export default function KeybindOptionSelect({
  defaultValue,
  callback,
  selectId,
  userValues,
  updateUserValues
}: KeybindOptionSelectProps): React.JSX.Element {
  const [value, setValue] = useState<string>(defaultValue);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchKeys = async (): Promise<void> => {
      const keys = await window.keyCodes.keys();
      setOptions(keys);
      setValue(userValues[selectId] ?? defaultValue);
    };
    fetchKeys();
  }, []);

  const optionsList = options.map((option: string) => (
    <option key={option} value={option}>
      {option}
    </option>
  ));

  return (
    <select
      className="hover:bg-gray-800 bg-gray-900 text-white p-2 outline-1 outline-gray-800 hover:outline-gray-700 rounded-sm"
      aria-placeholder="Keybind"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        updateUserValues(selectId, e.target.value);
        callback(e.target.value);
      }}
    >
      {optionsList}
    </select>
  );
}
