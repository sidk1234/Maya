"use client";

import { motion } from "framer-motion";

import { GlassPanel } from "@/components/ui/glass-panel";
import { howItWorks } from "@/data/conversation-coach";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">How It Works</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            A simple practice loop built to compound.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-4">
          {howItWorks.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassPanel className="h-full p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{item.step}</p>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{item.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{item.body}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
