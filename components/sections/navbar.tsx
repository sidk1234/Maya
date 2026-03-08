import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

const navItems = [
  { label: "Product", href: "#product" },
  { label: "Scenarios", href: "#scenarios" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Download", href: "#download" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 pt-4">
        <div className="flex items-center justify-between rounded-full border border-white/60 bg-white/70 px-4 py-3 shadow-[0_16px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#3b82f6,#8b5cf6)] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(59,130,246,0.28)]">
              m
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">maya</p>
              <p className="text-xs text-slate-500">AI rehearsal for real life</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-slate-600 lg:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-slate-950">
                {item.label}
              </a>
            ))}
          </nav>
          <a href="#showcase" className={buttonStyles("secondary")}>
            Try Demo
          </a>
        </div>
      </div>
    </header>
  );
}
