import React from "react";

type KeybindOptionCardProps = {
  children: React.ReactNode;
};

export default function KeybindOptionCard({ children }: KeybindOptionCardProps): React.JSX.Element {
  return (
    <div className="text-md flex flex-row justify-between gap-1 p-2 items-center rounded-sm">
      {children}
    </div>
  );
}
