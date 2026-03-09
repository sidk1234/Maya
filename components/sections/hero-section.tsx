"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Presentation, Users, WandSparkles } from "lucide-react";

import { BrandLogo } from "@/components/ui/brand-logo";
import { ConversationCoachDemo } from "@/components/phone/conversation-coach-demo";
import { buttonStyles } from "@/components/ui/button";
import { trustBadges } from "@/data/conversation-coach";

const floatingCards = [
  { label: "Interview mode", icon: Briefcase, position: "-left-24 top-20" },
  { label: "Real-time AI feedback", icon: WandSparkles, position: "-right-36 top-14" },
  { label: "Networking practice", icon: Users, position: "-left-36 bottom-24" },
  { label: "Presentation scoring", icon: Presentation, position: "-right-40 bottom-20", priorityClass: "z-[60]" }
];

export function HeroSection() {
  return (
    <section id="product" className="relative overflow-hidden px-6 pb-24 pt-14 sm:pb-32">
      <div className="absolute inset-x-0 top-0 -z-20 h-[760px] bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.35),transparent_32%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.24),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,248,252,0.7))]" />
      <div className="absolute inset-x-0 top-24 -z-10 mx-auto h-[680px] max-w-7xl rounded-[48px] border border-white/50 bg-hero-grid bg-[size:48px_48px] bg-center bg-no-repeat opacity-50 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent_85%)]" />
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm text-slate-600 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <span className="rounded-[12px] border border-slate-200/80 bg-white p-1 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
              <BrandLogo kind="mark" className="h-6 w-6 rounded-[8px]" alt="" />
            </span>
            Premium AI conversation rehearsal for moments that matter
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
            Practice every <span className="font-display italic">high-stakes</span> conversation before it happens.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            maya helps you rehearse interviews, networking, dating, and presentations, then go further by building custom personas from chats, screenshots, exports, and public-web research for the exact person or room you are preparing for.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#showcase" className={buttonStyles("primary")}>
              Try Interactive Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a href="#how-it-works" className={buttonStyles("secondary")}>
              See How It Works
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm text-slate-600 backdrop-blur-xl"
              >
                {badge}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[620px]"
        >
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.label}
              className={`absolute z-20 hidden rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_24px_80px_rgba(15,23,42,0.09)] backdrop-blur-2xl lg:flex ${card.position} ${card.priorityClass ?? ""}`}
              animate={{ y: [0, index % 2 === 0 ? -10 : 10, 0], rotate: [0, index % 2 === 0 ? -2 : 2, 0] }}
              transition={{ duration: 5 + index, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <card.icon className="mr-3 h-4 w-4 text-slate-900" />
              {card.label}
            </motion.div>
          ))}
          <ConversationCoachDemo initialMode="presentation" initialScreen="home" />
        </motion.div>
      </div>
    </section>
  );
}
