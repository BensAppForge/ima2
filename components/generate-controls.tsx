"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OutputFormat, Quality } from "@/lib/constants";

export function QualitySelect({
  value,
  onChange,
}: {
  value: Quality;
  onChange: (v: Quality) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>Quality</Label>
      <Select value={value} onValueChange={(v) => onChange(v as Quality)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function FormatSelect({
  value,
  onChange,
}: {
  value: OutputFormat;
  onChange: (v: OutputFormat) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>Format</Label>
      <Select value={value} onValueChange={(v) => onChange(v as OutputFormat)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="webp">WEBP</SelectItem>
          <SelectItem value="jpeg">JPEG</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
