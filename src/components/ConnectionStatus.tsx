import clsx from "clsx";
import { Skeleton } from "./ui/skeleton";

export const ConnectionStatusOptions = {
  NotConnected: { color: "bg-zinc-500", text: "Not Connected" },
  Connected: { color: "bg-green-500", text: "Connected" },
  Failed: { color: "bg-red-500", text: "Connection Failed" },
  Pending: { color: "bg-yellow-500", text: "Connection Pending" },
} as const;

type ConnectionStatusOptions =
  (typeof ConnectionStatusOptions)[keyof typeof ConnectionStatusOptions];

interface ConnectionStatusProps {
  status: ConnectionStatusOptions;
}

export function ConnectionStatus({
  status,
}: ConnectionStatusProps): React.JSX.Element {
  return (
    <div className="gap-2 font-md font-heading flex flex-row items-center text-white">
      <Skeleton className={clsx(status.color, "size-4")} />
      <p>{status.text}</p>
    </div>
  );
}
