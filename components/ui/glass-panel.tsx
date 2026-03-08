import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function GlassPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-white/60 bg-white/65 shadow-glass backdrop-blur-2xl",
        className
      )}
      {...props}
    />
  );
}
