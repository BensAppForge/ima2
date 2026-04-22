"use client";

import * as React from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyModal } from "@/components/key-modal";
import { useApiKey } from "@/components/key-provider";

export function KeyGate({ children }: { children: React.ReactNode }) {
  const { key } = useApiKey();
  const [open, setOpen] = React.useState(false);

  if (!key) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-muted">
              <KeyRound className="h-5 w-5" />
            </div>
            <CardTitle>Paste your OpenAI API key</CardTitle>
            <CardDescription>
              ima2 is bring-your-own-key. The key is stored in your browser only
              and forwarded per request to OpenAI via our proxy. Nothing is
              persisted server-side.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setOpen(true)} className="w-full">
              Enter API key
            </Button>
          </CardContent>
        </Card>
        <KeyModal open={open} onOpenChange={setOpen} />
      </div>
    );
  }

  return <>{children}</>;
}
