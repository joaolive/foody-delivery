import { useState } from "react";

import { Button } from "@/components/ui/button";

function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-start gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          Foody Delivery
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Frontend is ready
        </h1>
        <p className="text-sm text-muted-foreground">
          Vite, React, TypeScript, Tailwind CSS, and shadcn/ui are configured.
        </p>
        <Button onClick={() => setClicks((value) => value + 1)}>
          Test button: {clicks}
        </Button>
      </div>
    </main>
  );
}

export default App;
