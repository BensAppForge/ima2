"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiKey } from "@/components/key-provider";

function KeyForm({
  initial,
  hasExisting,
  onSave,
  onClear,
}: {
  initial: string;
  hasExisting: boolean;
  onSave: (v: string) => void;
  onClear: () => void;
}) {
  const [value, setValue] = React.useState(initial);

  const save = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="api-key">Key</Label>
        <Input
          id="api-key"
          type="password"
          placeholder="sk-..."
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
          }}
        />
      </div>
      <DialogFooter>
        {hasExisting && (
          <Button variant="ghost" onClick={onClear}>
            Clear
          </Button>
        )}
        <Button onClick={save} disabled={!value.trim()}>
          Save
        </Button>
      </DialogFooter>
    </>
  );
}

export function KeyModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { key, setKey, clearKey } = useApiKey();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI API key</DialogTitle>
          <DialogDescription>
            Your key is stored in this browser&apos;s localStorage and sent per
            request to our proxy, which forwards it to OpenAI and discards it.
            Nothing is persisted server-side.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <KeyForm
            key={String(open)}
            initial={key ?? ""}
            hasExisting={Boolean(key)}
            onSave={(v) => {
              setKey(v);
              onOpenChange(false);
            }}
            onClear={() => {
              clearKey();
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
