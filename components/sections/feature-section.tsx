"use client";

import { motion } from "framer-motion";
import { Briefcase, Heart, Presentation, Users } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";
import { featureHighlights } from "@/data/conversation-coach";
import { PracticeMode } from "@/lib/types";

const iconMap: Record<PracticeMode, typeof Briefcase> = {
  interview: Briefcase,
  networking: Users,
  dating: Heart,
  presentation: Presentation
};

const accentMap: Record<PracticeMode, string> = {
  interview: "from-sky-500/20 to-cyan-300/15",
  networking: "from-violet-500/20 to-sky-300/15",
  dating: "from-rose-500/20 to-orange-300/15",
  presentation: "from-teal-500/20 to-sky-300/15"
};

export function FeatureSection() {
  return (
    <section id="scenarios" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Practice Modes</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Four high-stakes scenarios, each built like a focused product surface.
          </h2>
          <p className="mt-5 text-lg text-slate-600">
            maya adapts the persona, pressure, and feedback language to the situation you are actually preparing for.
          </p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-4">
          {featureHighlights.map((feature, index) => {
            const Icon = iconMap[feature.mode];

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlassPanel className={`h-full overflow-hidden p-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.58)),linear-gradient(135deg,var(--tw-gradient-stops))] ${accentMap[feature.mode]}`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/80 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                    <Icon className="h-5 w-5 text-slate-900" />
                  </div>
                  <h3 className="mt-10 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{feature.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">{feature.description}</p>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
