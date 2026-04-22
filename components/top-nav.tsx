"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KeyModal } from "@/components/key-modal";
import { useApiKey } from "@/components/key-provider";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/text-to-image", label: "Text to Image" },
  { href: "/typography", label: "Typography" },
  { href: "/reasoning", label: "Reasoning" },
  { href: "/aspect-ratios", label: "Aspect Ratios" },
  { href: "/batch", label: "Batch" },
  { href: "/masked-edit", label: "Masked Edit" },
  { href: "/multi-reference", label: "Multi-ref Edit" },
  { href: "/infographics", label: "Infographics" },
  { href: "/manga", label: "Manga" },
];

export function TopNav() {
  const pathname = usePathname();
  const { key } = useApiKey();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <Link href="/text-to-image" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5" />
          <span>ima2</span>
          <span className="hidden text-xs font-normal text-muted-foreground sm:inline">
            · Image 2 showcase
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground md:inline">
            {key ? "Key set" : "No key"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            aria-label="API key settings"
          >
            <Settings className="h-4 w-4" />
            API key
          </Button>
        </div>
      </div>
      <nav className="mx-auto max-w-7xl overflow-x-auto px-6 pb-2">
        <ul className="flex items-center gap-1">
          {TABS.map((t) => {
            const active = pathname === t.href;
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className={cn(
                    "inline-flex h-8 items-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <KeyModal open={open} onOpenChange={setOpen} />
    </header>
  );
}
