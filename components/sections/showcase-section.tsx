"use client";

import { startTransition, useDeferredValue, useState } from "react";
import { motion } from "framer-motion";

import { ConversationCoachDemo } from "@/components/phone/conversation-coach-demo";
import { GlassPanel } from "@/components/ui/glass-panel";
import { customPersonaShowcase, practiceScenarios, scenarioModes, showcaseScreenSummaries } from "@/data/conversation-coach";
import { AppScreen, PracticeMode } from "@/lib/types";

const screenOrder: AppScreen[] = [
  "onboarding",
  "home",
  "scenarios",
  "setup",
  "personaCreate",
  "personaReview",
  "replyCoach",
  "personaSim",
  "live",
  "feedback",
  "analytics",
  "profile"
];

const screenLabelMap: Record<AppScreen, string> = {
  onboarding: "Onboarding",
  home: "Home",
  scenarios: "Scenarios",
  setup: "Setup",
  personaCreate: "Create Persona",
  personaReview: "Persona Review",
  replyCoach: "Reply Coach",
  personaSim: "Persona Sim",
  live: "Live Session",
  feedback: "Feedback",
  analytics: "Analytics",
  profile: "Profile"
};

const showcasePillClassNames = {
  active:
    "rounded-full border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)] transition",
  inactive:
    "rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950"
};

export function ShowcaseSection() {
  const [mode, setMode] = useState<PracticeMode>("interview");
  const [screen, setScreen] = useState<AppScreen>("live");
  const deferredScreen = useDeferredValue(screen);

  const currentScenario = practiceScenarios[mode];
  const currentSummary = showcaseScreenSummaries[deferredScreen];
  const isCustomPersonaScreen =
    deferredScreen === "personaCreate" ||
    deferredScreen === "personaReview" ||
    deferredScreen === "replyCoach" ||
    deferredScreen === "personaSim";
  const spotlightTitle = isCustomPersonaScreen ? customPersonaShowcase.title : currentScenario.title;
  const spotlightDescription = isCustomPersonaScreen ? customPersonaShowcase.summary : currentScenario.summary;
  const spotlightStat = isCustomPersonaScreen ? customPersonaShowcase.stat : currentScenario.stat;

  return (
    <section id="showcase" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Interactive Showcase</p>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              See Maya in action before you download.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Try the live demo to explore interviews, networking, dating, presentations, and custom personas built from chats, screenshots, and public context.
            </p>
            <GlassPanel className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{currentSummary.eyebrow}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{currentSummary.title}</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{currentSummary.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{isCustomPersonaScreen ? "Active workspace" : "Active mode"}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{spotlightTitle}</p>
                  <p className="mt-1 text-sm text-slate-600">{spotlightDescription}</p>
                </div>
                <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{isCustomPersonaScreen ? "Demo signal" : "Why it helps"}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{spotlightStat}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {isCustomPersonaScreen
                      ? "The custom workspace covers persona creation, explainability, reply drafting, and live simulation in one mocked flow."
                      : "Each mode is built around a real conversation so you can rehearse something specific, not generic."}
                  </p>
                </div>
              </div>
            </GlassPanel>
            <div className="rounded-[28px] border border-white/60 bg-white/35 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Practice mode</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {scenarioModes.map((option) => {
                    const active = option === mode;

                    return (
                      <button
                        key={option}
                        onClick={() =>
                          startTransition(() => {
                            setMode(option);
                          })
                        }
                        className={active ? showcasePillClassNames.active : showcasePillClassNames.inactive}
                      >
                        {practiceScenarios[option].shortTitle}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="my-5 h-px bg-[linear-gradient(90deg,rgba(148,163,184,0),rgba(148,163,184,0.45),rgba(148,163,184,0))]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Phone screen</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {screenOrder.map((option) => {
                    const active = option === screen;

                    return (
                      <button
                        key={option}
                        onClick={() =>
                          startTransition(() => {
                            setScreen(option);
                          })
                        }
                        className={active ? showcasePillClassNames.active : showcasePillClassNames.inactive}
                      >
                        {screenLabelMap[option]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[40px] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0.4))] p-4 shadow-[0_32px_100px_rgba(15,23,42,0.08)] backdrop-blur-3xl sm:p-6"
          >
            <ConversationCoachDemo
              initialMode={mode}
              initialScreen={screen}
              onStateChange={(nextState) => {
                startTransition(() => {
                  setMode(nextState.mode);
                  setScreen(nextState.screen);
                });
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
