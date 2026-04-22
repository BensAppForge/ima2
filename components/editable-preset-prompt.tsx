"use client";

import * as React from "react";
import { PromptBox } from "@/components/prompt-box";

// A PromptBox wrapper whose internal state resets whenever `key` changes
// (set a unique React `key` on the component from the parent to reset).
export function EditablePresetPrompt({
  initial,
  onChange,
  onSubmit,
  minHeight,
}: {
  initial: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  minHeight?: number;
}) {
  const [value, setValue] = React.useState(initial);

  return (
    <PromptBox
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange(v);
      }}
      onSubmit={onSubmit}
      minHeight={minHeight}
    />
  );
}
