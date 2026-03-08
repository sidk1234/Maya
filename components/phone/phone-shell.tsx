import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PhoneShellProps = {
  children: ReactNode;
  className?: string;
};

export function PhoneShell({ children, className }: PhoneShellProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[450px]", className)}>
      <div className="absolute inset-0 -z-20 translate-y-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.28),transparent_38%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.16),transparent_42%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.42),transparent_38%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.14),transparent_42%)]" />
      <div className="relative aspect-[450/920] drop-shadow-[0_40px_140px_rgba(15,23,42,0.24)]">
        <div
          className="absolute overflow-hidden rounded-[42px] bg-[#f7f9fc] dark:bg-[#070b16]"
          style={{ left: "5.333%", right: "5.333%", top: "2.5%", bottom: "2.5%" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.68),rgba(241,245,249,0.94))] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_44%),linear-gradient(180deg,rgba(6,10,20,0.96),rgba(10,15,28,0.96))]" />
          <div className="absolute inset-0 bg-[linear-gradient(118deg,transparent_10%,rgba(255,255,255,0.24)_26%,transparent_42%)] opacity-60 dark:bg-[linear-gradient(118deg,transparent_8%,rgba(148,163,184,0.08)_24%,transparent_42%)] dark:opacity-100" />
          {children}
        </div>
        <img
          src="/iphone-17-pro.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full select-none"
          draggable="false"
        />
      </div>
    </div>
  );
}
