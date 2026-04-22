"use client";

import { Brain, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import type { ReasoningEffort } from "@/lib/constants";

export function ReasoningToggle({
  effort,
  onEffortChange,
  webSearch,
  onWebSearchChange,
}: {
  effort: ReasoningEffort;
  onEffortChange: (v: ReasoningEffort) => void;
  webSearch: boolean;
  onWebSearchChange: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Reasoning effort
        </Label>
        <RadioGroup
          value={effort}
          onValueChange={(v) => onEffortChange(v as ReasoningEffort)}
          className="grid grid-cols-2 gap-2"
        >
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card p-3 text-sm has-[:checked]:border-primary">
            <RadioGroupItem value="off" />
            <span>
              <span className="font-medium">Off</span>
              <span className="ml-2 text-xs text-muted-foreground">
                Standard generation
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card p-3 text-sm has-[:checked]:border-primary">
            <RadioGroupItem value="medium" />
            <span>
              <span className="font-medium">Medium</span>
              <span className="ml-2 text-xs text-muted-foreground">
                Think before drawing
              </span>
            </span>
          </label>
        </RadioGroup>
      </div>
      <label className="flex items-center justify-between rounded-md border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <div>
            <div className="text-sm font-medium">Web search grounding</div>
            <div className="text-xs text-muted-foreground">
              Pull reference facts mid-generation (requires reasoning on)
            </div>
          </div>
        </div>
        <Switch
          checked={webSearch}
          onCheckedChange={onWebSearchChange}
          disabled={effort === "off"}
        />
      </label>
    </div>
  );
}
