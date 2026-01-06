import React, { useEffect, useState } from "react";

type KeybindOptionSelectProps = {
  defaultValue: string;
};

export default function KeybindOptionSelect({
  defaultValue
}: KeybindOptionSelectProps): React.JSX.Element {
  const [options, setOptions] = useState<string[]>([]);
  const [value, setValue] = useState<string>(defaultValue);
  useEffect(() => {
    const fetchKeys = async (): Promise<void> => {
      const keys = await window.keyCodes.keys();
      setOptions(keys);
      setValue(defaultValue);
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
      onChange={(e) => setValue(e.target.value)}
    >
      {optionsList}
    </select>
  );
}
