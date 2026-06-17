import React from "react";
import { Button } from "@/components/button";
import "./App.css";

function App(): React.JSX.Element {
  return (
    <>
      <main className="m-8">
        <h1>Zone Radio</h1>
        <Button variant="default">Click me!</Button>
      </main>
    </>
  );
}

export default App;
