import React from "react";

type KeybindOptionLabelProps = {
  name: string;
  description: string;
};

export default function KeybindOptionLabel({
  name,
  description
}: KeybindOptionLabelProps): React.JSX.Element {
  return (
    <div className="flex flex-col">
      <span className="text-white">{name}</span>
      <span className="text-gray-400">{description}</span>
    </div>
  );
}
