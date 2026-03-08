"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { pricingTiers } from "@/data/conversation-coach";

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Pricing</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Mock pricing, grounded enough to feel launch-ready.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassPanel
                className={`h-full p-7 ${tier.featured ? "relative border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(236,242,255,0.76))]" : ""}`}
              >
                {tier.featured ? (
                  <span className="absolute right-6 top-6 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    Most Popular
                  </span>
                ) : null}
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{tier.name}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-[-0.04em] text-slate-950">{tier.price}</span>
                  <span className="pb-1 text-slate-500">/ month</span>
                </div>
                <p className="mt-4 text-base text-slate-600">{tier.description}</p>
                <a href="#download" className={`mt-8 w-full ${buttonStyles(tier.featured ? "primary" : "secondary")}`}>
                  {tier.cta}
                </a>
                <div className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
