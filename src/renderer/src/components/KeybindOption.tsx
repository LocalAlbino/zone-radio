import React from "react";
import KeybindOptionSelect from "@renderer/components/KeybindOptionSelect";

type KeybindOptionProps = {
  name: string;
  description: string;
};

export default function KeybindOption({
  name,
  description
}: KeybindOptionProps): React.JSX.Element {
  return (
    <div className="text-md flex flex-row justify-between gap-1 p-2 items-center rounded-sm">
      <div className="flex flex-col">
        <span className="text-white">{name}</span>
        <span className="text-gray-400">{description}</span>
      </div>
      <KeybindOptionSelect />
    </div>
  );
}
