import { ConnectionStatus, ConnectionStatusOptions } from "./ConnectionStatus";

function TitleBar(): React.JSX.Element {
  return (
    <section className="p-8 bg-primary flex flex-row justify-between items-baseline">
      <h1 className="font-heading text-2xl text-white">Zone Radio</h1>
      <ConnectionStatus status={ConnectionStatusOptions.NotConnected} />
    </section>
  );
}

export default TitleBar;
