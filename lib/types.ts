export type PracticeMode = "interview" | "networking" | "dating" | "presentation";

export type AppScreen =
  | "onboarding"
  | "home"
  | "scenarios"
  | "setup"
  | "live"
  | "feedback"
  | "analytics"
  | "profile";

export type Persona = {
  id: string;
  name: string;
  role: string;
  focus: string;
};

export type TranscriptTurn = {
  user: string;
  ai: string;
  reaction: string;
  hint: string;
};

export type FeedbackMetric = {
  label: string;
  value: number;
  tone: string;
};

export type PracticeScenario = {
  id: PracticeMode;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  stat: string;
  accentFrom: string;
  accentTo: string;
  tags: string[];
  difficulties: string[];
  personas: Persona[];
  goals: string[];
  context: string;
  opening: string;
  transcript: TranscriptTurn[];
  feedback: {
    overallScore: number;
    fillerWords: number;
    pacing: string;
    strengths: string[];
    improvements: string[];
    rewrittenResponse: string;
    metrics: FeedbackMetric[];
  };
};

export type OnboardingSlide = {
  eyebrow: string;
  title: string;
  body: string;
};

export type ShowcaseScreenSummary = {
  eyebrow: string;
  title: string;
  description: string;
};

export type PricingTier = {
  name: string;
  price: string;
  description: string;
  featured?: boolean;
  cta: string;
  features: string[];
};
