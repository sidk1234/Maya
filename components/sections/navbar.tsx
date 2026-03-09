import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";

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
            <span className="rounded-[18px] border border-slate-200/80 bg-white px-3 py-2 shadow-[0_12px_28px_rgba(15,23,42,0.07)]">
              <BrandLogo className="h-8 w-[116px]" priority />
            </span>
            <p className="hidden text-xs font-medium text-slate-500 sm:block">AI rehearsal for real life</p>
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
