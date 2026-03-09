export type PracticeMode = "interview" | "networking" | "dating" | "presentation";

export type AppScreen =
  | "onboarding"
  | "home"
  | "scenarios"
  | "setup"
  | "personaCreate"
  | "personaReview"
  | "replyCoach"
  | "personaSim"
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

export type PersonaScope = "privatePerson" | "publicFigure" | "audience";

export type PersonaSourceType = "pastedText" | "screenshot" | "chatExport" | "publicUrl";

export type PersonaAction = "replyCoach" | "practiceConversation";

export type PersonaSource = {
  type: PersonaSourceType;
  label: string;
  summary: string;
  status: string;
  detail: string;
};

export type PersonaSourceConfidence = {
  type: PersonaSourceType;
  label: string;
  confidence: string;
  note: string;
};

export type ReplySuggestion = {
  toneLabel: string;
  bestFor: string;
  draft: string;
  rationale: string;
  fitExplanation: string;
};

export type FeedbackMetric = {
  label: string;
  value: number;
  tone: string;
};

export type SessionFeedback = {
  overallScore: number;
  fillerWords: number;
  pacing: string;
  strengths: string[];
  improvements: string[];
  rewrittenResponse: string;
  metrics: FeedbackMetric[];
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
  feedback: SessionFeedback;
};

export type GeneratedPersonaProfile = {
  id: string;
  name: string;
  role: string;
  relationshipLabel: string;
  scope: PersonaScope;
  summary: string;
  styleTraits: string[];
  commonTopics: string[];
  responseTendencies: string[];
  cautions: string[];
  sources: PersonaSource[];
  sourceConfidence: PersonaSourceConfidence[];
  watchOut: string;
  replyContextTitle: string;
  replyContextBody: string;
  replyContextLabel: string;
  replySuggestions: ReplySuggestion[];
  simulation: {
    context: string;
    opening: string;
    transcript: TranscriptTurn[];
  };
  feedback: SessionFeedback;
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
  billingPeriod?: string;
  description: string;
  featured?: boolean;
  badge?: string;
  priceBadge?: string;
  priceNote?: string;
  cta: string;
  features: string[];
};
