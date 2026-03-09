import Link from "next/link";

import { BrandLogo } from "@/components/ui/brand-logo";

export function Footer() {
  return (
    <footer className="px-6 pb-12 pt-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-slate-200/80 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="inline-flex rounded-[20px] border border-slate-200/80 bg-white/90 p-2 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
            <BrandLogo className="h-8 w-[116px]" />
          </Link>
          <p className="mt-3">AI-powered rehearsal for real-world communication.</p>
        </div>
        <div className="flex gap-6">
          <a href="#product" className="transition hover:text-slate-900">
            Product
          </a>
          <a href="#pricing" className="transition hover:text-slate-900">
            Pricing
          </a>
          <a href="#download" className="transition hover:text-slate-900">
            Download
          </a>
        </div>
      </div>
    </footer>
  );
}
