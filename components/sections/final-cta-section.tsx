import { ArrowRight } from "lucide-react";

import { BrandLogo } from "@/components/ui/brand-logo";
import { buttonStyles } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section id="download" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl rounded-[40px] border border-white/60 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.22),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.64))] p-10 shadow-[0_32px_100px_rgba(15,23,42,0.08)] backdrop-blur-3xl sm:p-14">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/82 px-3 py-2 shadow-[0_14px_36px_rgba(15,23,42,0.07)]">
          <BrandLogo className="h-8 w-[110px] rounded-[10px]" />
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Ready to rehearse</span>
        </div>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
          Train every conversation before it matters.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Designed to feel polished enough for an investor demo, but useful enough that people would actually want to come back tomorrow.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#showcase" className={buttonStyles("primary")}>
            Try Interactive Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
          <a href="#pricing" className={buttonStyles("secondary")}>
            View Pricing
          </a>
        </div>
      </div>
    </section>
  );
}
