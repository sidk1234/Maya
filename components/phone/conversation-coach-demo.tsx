"use client";

import type { CSSProperties } from "react";
import { startTransition, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  Bell,
  Briefcase,
  Camera,
  ChevronLeft,
  ChevronRight,
  FileText,
  Flame,
  Heart,
  Home,
  ImageIcon,
  Lightbulb,
  Link2,
  MessageSquare,
  Mic,
  Paperclip,
  Presentation,
  Sparkles,
  Square,
  Target,
  TrendingUp,
  UserRound,
  Users,
  WandSparkles,
  X
} from "lucide-react";

import { PhoneShell } from "@/components/phone/phone-shell";
import { CountUp } from "@/components/ui/count-up";
import {
  customPersonaShowcase,
  generatedPersonaProfiles,
  onboardingSlides,
  personaActionOptions,
  personaSourceCatalog,
  practiceScenarios,
  scenarioModes
} from "@/data/conversation-coach";
import {
  AppScreen,
  PersonaAction,
  PersonaScope,
  PersonaSource,
  PersonaSourceConfidence,
  PersonaSourceType,
  PracticeMode,
  SessionFeedback
} from "@/lib/types";
import { cn } from "@/lib/utils";

type DemoProps = {
  initialMode?: PracticeMode;
  initialScreen?: AppScreen;
  onStateChange?: (state: { mode: PracticeMode; screen: AppScreen }) => void;
  className?: string;
  renderMode?: "device" | "screen";
};

type Message = {
  speaker: "ai" | "user";
  text: string;
};

type OnboardingStep = "intro" | "modeSelect";
type PersonaSourceDraft = {
  primaryText: string;
  note: string;
  attachmentNames: string[];
};
type ThemePreference = "Light" | "Dark" | "Auto";
type ResolvedTheme = "light" | "dark";

const modeIconMap: Record<PracticeMode, typeof Briefcase> = {
  interview: Briefcase,
  networking: Users,
  dating: Heart,
  presentation: Presentation
};

const modeSurfaceMap: Record<PracticeMode, string> = {
  interview: "from-sky-500/20 to-cyan-300/15",
  networking: "from-violet-500/20 to-sky-300/15",
  dating: "from-rose-500/20 to-orange-300/15",
  presentation: "from-teal-500/20 to-sky-300/15"
};

const personaScopeSurfaceMap: Record<PersonaScope, string> = {
  privatePerson: "from-rose-500/18 to-fuchsia-300/18",
  publicFigure: "from-sky-500/20 to-indigo-300/18",
  audience: "from-emerald-500/18 to-cyan-300/18"
};

const personaSourceIconMap: Record<PersonaSourceType, typeof MessageSquare> = {
  pastedText: MessageSquare,
  screenshot: ImageIcon,
  chatExport: FileText,
  publicUrl: Link2
};

const metricToneMap: Record<string, string> = {
  sky: "bg-sky-50 text-sky-700",
  emerald: "bg-emerald-50 text-emerald-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  teal: "bg-teal-50 text-teal-700"
};

const screenVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.985 }
};

const fadeScreenVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const modeFadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const onboardingSlideVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? 30 : -30
  }),
  animate: {
    opacity: 1,
    x: 0
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -30 : 30
  })
};

const onboardingPageVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? 42 : -42
  }),
  animate: {
    opacity: 1,
    x: 0
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -42 : 42
  })
};

function getScreenMotionPreset(screen: AppScreen) {
  if (screen === "home" || screen === "scenarios" || screen === "analytics" || screen === "profile") {
    return {
      variants: fadeScreenVariants,
      transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const }
    };
  }

  return {
    variants: screenVariants,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }
  };
}

const weeklyPractice = [2, 4, 5, 3, 6, 7, 5];
const skillTrend = [72, 76, 79, 84, 82, 89, 93];

function getMockAttachmentName(type: PersonaSourceType, count: number) {
  if (type === "screenshot") {
    return `story-screenshot-${count + 1}.png`;
  }

  if (type === "chatExport") {
    return "dm-export.txt";
  }

  return `attachment-${count + 1}`;
}

const personaSourceDraftDefaults: Record<PersonaSourceType, PersonaSourceDraft> = {
  pastedText: {
    primaryText: "hey, i saw your story and that rooftop set looked unreal. was that from last night?",
    note: "",
    attachmentNames: []
  },
  screenshot: {
    primaryText: "This is an Instagram story screenshot. Mirror the tone without sounding too rehearsed.",
    note: "",
    attachmentNames: []
  },
  chatExport: {
    primaryText: "Longer chat history to capture recurring phrasing and pacing.",
    note: "",
    attachmentNames: ["dm-export.txt"]
  },
  publicUrl: {
    primaryText: "https://example.com/speaker-profile",
    note: "Use this to model presentation style and likely follow-up questions.",
    attachmentNames: []
  }
};

const personaSourceSheetCopy: Record<
  PersonaSourceType,
  {
    title: string;
    body: string;
    fieldLabel: string;
    placeholder: string;
    noteLabel?: string;
    notePlaceholder?: string;
    attachmentLabel?: string;
    attachmentButton?: string;
    saveLabel: string;
  }
> = {
  pastedText: {
    title: "Paste chats or notes",
    body: "Drop in texts, emails, DMs, or notes so Maya can learn rhythm, pacing, and recurring phrases.",
    fieldLabel: "Pasted content",
    placeholder: "Paste a few messages, email snippets, or notes here...",
    saveLabel: "Add pasted chats"
  },
  screenshot: {
    title: "Upload screenshots",
    body: "Attach a message screenshot, story capture, or slide snippet so the persona keeps the visual context.",
    fieldLabel: "Context note (Optional)",
    placeholder: "Add any context Maya should keep in mind about this image...",
    attachmentLabel: "Screenshots",
    attachmentButton: "Add screenshot",
    saveLabel: "Add screenshots"
  },
  chatExport: {
    title: "Upload a chat export",
    body: "Drop in a longer export when you want the persona to reflect more than one interaction.",
    fieldLabel: "What this export covers",
    placeholder: "Describe what period or conversation this export represents...",
    attachmentLabel: "Export file",
    attachmentButton: "Upload export",
    saveLabel: "Add export"
  },
  publicUrl: {
    title: "Add web research",
    body: "Search the web or paste a public URL when you want Maya to model a public figure or presentation audience.",
    fieldLabel: "Search query or public URL",
    placeholder: "Search a public figure, company, or paste a URL...",
    noteLabel: "Research note",
    notePlaceholder: "Tell Maya what to focus on, like speaking style or likely questions...",
    saveLabel: "Add web research"
  }
};

function getDefaultPersonaSources(scope: PersonaScope): PersonaSourceType[] {
  if (scope === "privatePerson") {
    return ["pastedText", "screenshot"];
  }

  return ["pastedText", "screenshot", "publicUrl"];
}

function getPersonaScopeForSelection(mode: PracticeMode, selectedSources: PersonaSourceType[]): PersonaScope {
  if (mode === "presentation") {
    return "audience";
  }

  return selectedSources.includes("publicUrl") ? "publicFigure" : "privatePerson";
}

const fallbackPersonaSourceMap: Record<
  PersonaSourceType,
  Omit<PersonaSource, "type" | "label">
> = {
  pastedText: {
    summary: "Pasted chats, notes, or excerpts added for direct tone and wording signal.",
    status: "Parsed",
    detail: "Used to anchor the persona in phrasing, pacing, and recurring topics from your own material."
  },
  screenshot: {
    summary: "Screenshot attachment added for visual context and moment-specific cues.",
    status: "Interpreted",
    detail: "Used as supporting signal for context, references, and message framing."
  },
  chatExport: {
    summary: "Longer conversation export attached for broader historical context.",
    status: "Merged",
    detail: "Used to improve consistency across longer patterns, habits, and recurring phrases."
  },
  publicUrl: {
    summary: "Public web research added for interviews, posts, and public-facing writing.",
    status: "Researched",
    detail: "Used to sharpen the persona with publicly available language, priorities, and likely follow-up questions."
  }
};

const fallbackPersonaSourceConfidenceMap: Record<
  PersonaSourceType,
  Omit<PersonaSourceConfidence, "type" | "label">
> = {
  pastedText: {
    confidence: "High",
    note: "Strong direct signal on tone, pacing, and question style."
  },
  screenshot: {
    confidence: "Medium",
    note: "Useful for visual context, references, and moment-specific cues."
  },
  chatExport: {
    confidence: "High",
    note: "Best source for consistency over time and broader interaction patterns."
  },
  publicUrl: {
    confidence: "High",
    note: "Strong signal on public language, priorities, and likely follow-up questions."
  }
};

function getPersonaSourceLabel(type: PersonaSourceType) {
  return personaSourceCatalog.find((source) => source.type === type)?.label ?? "Source";
}

function buildSelectedPersonaSources(
  personaProfile: (typeof generatedPersonaProfiles)[PersonaScope],
  selectedSourceTypes: PersonaSourceType[]
): PersonaSource[] {
  const profileSourceMap = new Map(personaProfile.sources.map((source) => [source.type, source]));

  return selectedSourceTypes.map((type) => {
    const profileSource = profileSourceMap.get(type);

    if (profileSource) {
      return profileSource;
    }

    return {
      type,
      label: getPersonaSourceLabel(type),
      ...fallbackPersonaSourceMap[type]
    };
  });
}

function buildSelectedPersonaConfidence(
  personaProfile: (typeof generatedPersonaProfiles)[PersonaScope],
  selectedSourceTypes: PersonaSourceType[]
): PersonaSourceConfidence[] {
  const profileConfidenceMap = new Map(personaProfile.sourceConfidence.map((source) => [source.type, source]));

  return selectedSourceTypes.map((type) => {
    const profileConfidence = profileConfidenceMap.get(type);

    if (profileConfidence) {
      return profileConfidence;
    }

    return {
      type,
      label: getPersonaSourceLabel(type),
      ...fallbackPersonaSourceConfidenceMap[type]
    };
  });
}

function getInitialPersonaAction(screen: AppScreen): PersonaAction {
  return screen === "personaSim" ? "practiceConversation" : "replyCoach";
}

export function ConversationCoachDemo({
  initialMode = "interview",
  initialScreen = "home",
  onStateChange,
  className,
  renderMode = "device"
}: DemoProps) {
  const propStateRef = useRef({ mode: initialMode, screen: initialScreen });
  const reportedStateRef = useRef({ mode: initialMode, screen: initialScreen });
  const syncingFromPropsRef = useRef(false);
  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [screen, setScreen] = useState<AppScreen>(initialScreen);
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("intro");
  const [onboardingDirection, setOnboardingDirection] = useState(1);
  const [personaId, setPersonaId] = useState(practiceScenarios[initialMode].personas[0]?.id ?? "");
  const [difficulty, setDifficulty] = useState(practiceScenarios[initialMode].difficulties[1] ?? "");
  const [goal, setGoal] = useState(practiceScenarios[initialMode].goals[0] ?? "");
  const [revealedTurns, setRevealedTurns] = useState(initialScreen === "live" ? 1 : 0);
  const [hintOpen, setHintOpen] = useState(false);
  const [typedMode, setTypedMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [theme, setTheme] = useState<ThemePreference>("Light");
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [personaAction, setPersonaAction] = useState<PersonaAction>(getInitialPersonaAction(initialScreen));
  const [selectedPersonaSources, setSelectedPersonaSources] = useState<PersonaSourceType[]>(getDefaultPersonaSources("privatePerson"));
  const [customPersonaName, setCustomPersonaName] = useState(
    generatedPersonaProfiles[getPersonaScopeForSelection(initialMode, getDefaultPersonaSources("privatePerson"))].name
  );
  const [sessionType, setSessionType] = useState<"scenario" | "customPersona">(initialScreen === "personaSim" ? "customPersona" : "scenario");
  const [personaOriginScreen, setPersonaOriginScreen] = useState<AppScreen>("home");

  const scenario = practiceScenarios[mode];
  const personaScope = getPersonaScopeForSelection(mode, selectedPersonaSources);
  const previousPersonaScopeRef = useRef<PersonaScope>(personaScope);
  const customPersona = generatedPersonaProfiles[personaScope];
  const resolvedCustomPersonaName = customPersonaName.trim() || customPersona.name;
  const activeSimulation = sessionType === "customPersona" ? customPersona.simulation : {
    context: scenario.context,
    opening: scenario.opening,
    transcript: scenario.transcript
  };
  const activeFeedback: SessionFeedback = sessionType === "customPersona" ? customPersona.feedback : scenario.feedback;
  const currentPersona = scenario.personas.find((item) => item.id === personaId) ?? scenario.personas[0];
  const currentReaction =
    revealedTurns === 0
      ? "Listening"
      : activeSimulation.transcript[Math.min(revealedTurns - 1, activeSimulation.transcript.length - 1)]?.reaction ?? "Listening";
  const currentHint =
    activeSimulation.transcript[Math.min(revealedTurns, activeSimulation.transcript.length - 1)]?.hint ??
    activeSimulation.transcript[activeSimulation.transcript.length - 1]?.hint ??
    "";
  const progress = Math.round((revealedTurns / activeSimulation.transcript.length) * 100);
  const visiblePersonaSources = personaSourceCatalog.filter((source) => source.type !== "chatExport");
  const selectedPersonaPreview = buildSelectedPersonaSources(customPersona, selectedPersonaSources);
  const selectedPersonaConfidence = buildSelectedPersonaConfidence(customPersona, selectedPersonaSources);
  const messages: Message[] = [
    { speaker: "ai", text: activeSimulation.opening },
    ...activeSimulation.transcript.slice(0, revealedTurns).flatMap((turn) => [
      { speaker: "user" as const, text: turn.user },
      { speaker: "ai" as const, text: turn.ai }
    ])
  ];

  useEffect(() => {
    const modeChanged = propStateRef.current.mode !== initialMode;
    const screenChanged = propStateRef.current.screen !== initialScreen;

    if (!modeChanged && !screenChanged) {
      return;
    }

    syncingFromPropsRef.current = true;
    propStateRef.current = { mode: initialMode, screen: initialScreen };

    if (modeChanged) {
      setMode(initialMode);
    }

    if (screenChanged) {
      setScreen(initialScreen);
      setRevealedTurns(initialScreen === "live" || initialScreen === "personaSim" ? 1 : 0);

      if (initialScreen === "onboarding") {
        setOnboardingIndex(0);
        setOnboardingStep("intro");
      }

      if (initialScreen === "personaSim") {
        setPersonaAction("practiceConversation");
        setSessionType("customPersona");
      } else if (initialScreen === "live" || initialScreen === "feedback") {
        setSessionType("scenario");
      } else if (initialScreen === "replyCoach") {
        setPersonaAction("replyCoach");
      }
    }
  }, [initialMode, initialScreen]);

  useEffect(() => {
    setPersonaId(scenario.personas[0]?.id ?? "");
    setDifficulty(scenario.difficulties[1] ?? scenario.difficulties[0] ?? "");
    setGoal(scenario.goals[0] ?? "");
    setRevealedTurns(0);
    setHintOpen(false);
    setTypedMode(false);
  }, [mode, scenario.difficulties, scenario.goals, scenario.personas]);

  useEffect(() => {
    const previousScope = previousPersonaScopeRef.current;

    if (previousScope === personaScope) {
      return;
    }

    setCustomPersonaName((current) => {
      if (current.trim().length === 0 || current === generatedPersonaProfiles[previousScope].name) {
        return generatedPersonaProfiles[personaScope].name;
      }

      return current;
    });
    previousPersonaScopeRef.current = personaScope;
  }, [personaScope]);

  useEffect(() => {
    if (syncingFromPropsRef.current) {
      if (mode === initialMode && screen === initialScreen) {
        syncingFromPropsRef.current = false;
        reportedStateRef.current = { mode, screen };
      }

      return;
    }

    if (reportedStateRef.current.mode === mode && reportedStateRef.current.screen === screen) {
      return;
    }

    reportedStateRef.current = { mode, screen };
    onStateChange?.({ mode, screen });
  }, [initialMode, initialScreen, mode, onStateChange, screen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncPreference = () => setSystemPrefersDark(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  const resolvedTheme: ResolvedTheme = theme === "Auto" ? (systemPrefersDark ? "dark" : "light") : theme.toLowerCase() as ResolvedTheme;
  const isDark = resolvedTheme === "dark";
  const themeVars = {
    "--score-ring-track": isDark ? "rgba(148,163,184,0.18)" : "rgba(148,163,184,0.22)",
    "--score-ring-stroke": isDark ? "#f8fafc" : "#0f172a",
    "--score-ring-text": isDark ? "#f8fafc" : "#0f172a",
    "--trend-line-start": isDark ? "#e2e8f0" : "#0f172a",
    "--trend-line-end": "#38bdf8",
    "--trend-line-dot": isDark ? "#f8fafc" : "#0f172a"
  } as CSSProperties;

  function navigate(nextScreen: AppScreen) {
    startTransition(() => {
      setScreen(nextScreen);
    });
  }

  function openCustomPersona(fromScreen: AppScreen) {
    setPersonaOriginScreen(fromScreen);
    navigate("personaCreate");
  }

  function handleModeSelect(nextMode: PracticeMode, nextScreen: AppScreen = "setup") {
    startTransition(() => {
      setMode(nextMode);
      setScreen(nextScreen);
    });
  }

  function handleStartSession() {
    setSessionType("scenario");
    setRevealedTurns(0);
    setHintOpen(false);
    setTypedMode(false);
    navigate("live");
  }

  function handleStartPersonaSimulation() {
    setSessionType("customPersona");
    setPersonaAction("practiceConversation");
    setRevealedTurns(0);
    setHintOpen(false);
    setTypedMode(false);
    navigate("personaSim");
  }

  function handleOpenReplyCoach() {
    setPersonaAction("replyCoach");
    navigate("replyCoach");
  }

  function togglePersonaSource(type: PersonaSourceType) {
    setSelectedPersonaSources((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type]
    );
  }

  function handleNextResponse() {
    if (revealedTurns >= activeSimulation.transcript.length) {
      navigate("feedback");
      return;
    }

    setRevealedTurns((current) => current + 1);
  }

  const showTabBar = screen === "home" || screen === "scenarios" || screen === "analytics" || screen === "profile";
  const screenMotionPreset = getScreenMotionPreset(screen);

  const appChrome = (
    <div className="relative flex h-full min-h-0 flex-col px-4 pb-4 pt-8 text-slate-950 dark:text-slate-100" style={themeVars}>
        <div className="mb-2 px-1.5">
          <span
            className="pl-3 text-[17px] font-semibold leading-none tracking-[-0.03em] text-slate-950 dark:text-slate-100"
            style={{ fontFamily: "SF Pro Text, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            9:41
          </span>
        </div>
        <div className="relative min-h-0 flex-1 overflow-visible">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              variants={screenMotionPreset.variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={screenMotionPreset.transition}
              className="h-full min-h-0"
            >
              {screen === "onboarding" ? (
                <OnboardingScreen
                  onboardingIndex={onboardingIndex}
                  onboardingStep={onboardingStep}
                  onboardingDirection={onboardingDirection}
                  mode={mode}
                  onAdvance={() => {
                    setOnboardingDirection(1);
                    setOnboardingIndex((current) => Math.min(current + 1, onboardingSlides.length - 1));
                  }}
                  onRetreat={() => {
                    setOnboardingDirection(-1);
                    setOnboardingIndex((current) => Math.max(current - 1, 0));
                  }}
                  onSelectMode={setMode}
                  onShowModeSelection={() => {
                    setOnboardingDirection(1);
                    setOnboardingStep("modeSelect");
                  }}
                  onReturnToIntro={() => {
                    setOnboardingDirection(-1);
                    setOnboardingStep("intro");
                  }}
                  onContinueToApp={() => navigate("setup")}
                  onExplorePrototype={() => navigate("home")}
                />
              ) : null}
              {screen === "home" ? (
                <HomeScreen
                  mode={mode}
                  progressScore={scenario.feedback.overallScore}
                  onSelectMode={(nextMode) => handleModeSelect(nextMode)}
                  onContinueCurrentMode={() => handleModeSelect(mode)}
                  onOpenCustomPersona={() => openCustomPersona("home")}
                  onOpenScenarios={() => navigate("scenarios")}
                  onOpenAnalytics={() => navigate("analytics")}
                />
              ) : null}
              {screen === "scenarios" ? (
                <ScenarioSelectionScreen
                  activeMode={mode}
                  onSelectMode={(nextMode) => handleModeSelect(nextMode)}
                  onOpenCustomPersona={() => openCustomPersona("scenarios")}
                />
              ) : null}
              {screen === "setup" ? (
                <SessionSetupScreen
                  mode={mode}
                  personaId={personaId}
                  difficulty={difficulty}
                  goal={goal}
                  onBack={() => navigate("scenarios")}
                  onModeSelect={(nextMode) => setMode(nextMode)}
                  onPersonaSelect={setPersonaId}
                  onDifficultySelect={setDifficulty}
                  onGoalSelect={setGoal}
                  onOpenCustomPersona={() => openCustomPersona("setup")}
                  onStartSession={handleStartSession}
                />
              ) : null}
              {screen === "personaCreate" ? (
                <CustomPersonaCreateScreen
                  mode={mode}
                  personaName={customPersonaName}
                  personaScope={personaScope}
                  personaAction={personaAction}
                  selectedSources={selectedPersonaSources}
                  visibleSources={visiblePersonaSources}
                  sourcePreview={selectedPersonaPreview}
                  onBack={() => navigate(personaOriginScreen)}
                  onModeChange={setMode}
                  onPersonaNameChange={setCustomPersonaName}
                  onActionChange={setPersonaAction}
                  onToggleSource={togglePersonaSource}
                  onGeneratePersona={() => navigate("personaReview")}
                />
              ) : null}
              {screen === "personaReview" ? (
                <CustomPersonaReviewScreen
                  personaName={resolvedCustomPersonaName}
                  personaProfile={customPersona}
                  selectedSources={selectedPersonaPreview}
                  sourceConfidence={selectedPersonaConfidence}
                  activeAction={personaAction}
                  onBack={() => navigate("personaCreate")}
                  onEditPersona={() => navigate("personaCreate")}
                  onOpenReplyCoach={handleOpenReplyCoach}
                  onStartSimulation={handleStartPersonaSimulation}
                />
              ) : null}
              {screen === "replyCoach" ? (
                <ReplyCoachScreen
                  personaName={resolvedCustomPersonaName}
                  personaProfile={customPersona}
                  onBack={() => navigate("personaReview")}
                  onStartSimulation={handleStartPersonaSimulation}
                />
              ) : null}
              {screen === "live" ? (
                <LiveSessionScreen
                  surfaceClassName={modeSurfaceMap[mode]}
                  sessionLabel="Live Session"
                  contextLabel="Scenario context"
                  personaName={currentPersona?.name ?? "Coach"}
                  personaRole={currentPersona?.role ?? "AI Persona"}
                  personaFocus={currentPersona?.focus ?? ""}
                  context={scenario.context}
                  messages={messages}
                  progress={progress}
                  hint={currentHint}
                  hintOpen={hintOpen}
                  typedMode={typedMode}
                  reaction={currentReaction}
                  isComplete={revealedTurns >= scenario.transcript.length}
                  onBack={() => navigate("setup")}
                  onToggleHint={() => setHintOpen((current) => !current)}
                  onToggleTypedMode={() => setTypedMode((current) => !current)}
                  onNextResponse={handleNextResponse}
                  onEndSession={() => navigate("feedback")}
                />
              ) : null}
              {screen === "personaSim" ? (
                <LiveSessionScreen
                  surfaceClassName={personaScopeSurfaceMap[personaScope]}
                  sessionLabel="Persona Simulation"
                  contextLabel="Persona context"
                  personaName={resolvedCustomPersonaName}
                  personaRole={customPersona.role}
                  personaFocus={customPersona.responseTendencies[0] ?? customPersona.summary}
                  context={customPersona.simulation.context}
                  messages={messages}
                  progress={progress}
                  hint={currentHint}
                  hintOpen={hintOpen}
                  typedMode={typedMode}
                  reaction={currentReaction}
                  isComplete={revealedTurns >= customPersona.simulation.transcript.length}
                  onBack={() => navigate("personaReview")}
                  onToggleHint={() => setHintOpen((current) => !current)}
                  onToggleTypedMode={() => setTypedMode((current) => !current)}
                  onNextResponse={handleNextResponse}
                  onEndSession={() => navigate("feedback")}
                />
              ) : null}
              {screen === "feedback" ? (
                <FeedbackScreen
                  feedback={activeFeedback}
                  title={sessionType === "customPersona" ? "Persona Feedback" : "Session Feedback"}
                  summary={
                    sessionType === "customPersona"
                      ? `Strong calibration for ${resolvedCustomPersonaName} with room to tighten the next response even more.`
                      : "Strong command of the conversation with room to make the ending even sharper."
                  }
                  primaryActionLabel={sessionType === "customPersona" ? "Run Simulation Again" : "Practice Again"}
                  onPracticeAgain={sessionType === "customPersona" ? handleStartPersonaSimulation : handleStartSession}
                  onOpenAnalytics={() => navigate("analytics")}
                  onBack={() => navigate(sessionType === "customPersona" ? "personaSim" : "live")}
                />
              ) : null}
              {screen === "analytics" ? <AnalyticsScreen mode={mode} theme={resolvedTheme} /> : null}
              {screen === "profile" ? (
                <ProfileScreen
                  mode={mode}
                  notificationsEnabled={notificationsEnabled}
                  voiceEnabled={voiceEnabled}
                  theme={theme}
                  onToggleNotifications={() => setNotificationsEnabled((current) => !current)}
                  onToggleVoice={() => setVoiceEnabled((current) => !current)}
                  onThemeChange={setTheme}
                  onModeSelect={setMode}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
        {showTabBar ? (
          <TabBar currentScreen={screen} onNavigate={navigate} />
        ) : (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.82))] dark:bg-[linear-gradient(180deg,transparent,rgba(6,10,20,0.92))]" />
        )}
      </div>
  );

  if (renderMode === "screen") {
    return (
      <div
        className={cn(
          "relative mx-auto aspect-[402/874] w-full max-w-[402px] overflow-hidden bg-[#f7f9fc] dark:bg-[#070b16]",
          isDark && "dark",
          className
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_50%),linear-gradient(180deg,rgba(255,255,255,0.65),rgba(241,245,249,0.92))] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_42%),linear-gradient(180deg,rgba(6,10,20,0.96),rgba(10,15,28,0.98))]" />
        {appChrome}
      </div>
    );
  }

  return (
    <PhoneShell className={cn(className, isDark && "dark")}>
      {appChrome}
    </PhoneShell>
  );
}

function OnboardingScreen({
  onboardingIndex,
  onboardingStep,
  onboardingDirection,
  mode,
  onAdvance,
  onRetreat,
  onSelectMode,
  onShowModeSelection,
  onReturnToIntro,
  onContinueToApp,
  onExplorePrototype
}: {
  onboardingIndex: number;
  onboardingStep: OnboardingStep;
  onboardingDirection: number;
  mode: PracticeMode;
  onAdvance: () => void;
  onRetreat: () => void;
  onSelectMode: (mode: PracticeMode) => void;
  onShowModeSelection: () => void;
  onReturnToIntro: () => void;
  onContinueToApp: () => void;
  onExplorePrototype: () => void;
}) {
  const slide = onboardingSlides[onboardingIndex];
  const selectedScenario = practiceScenarios[mode];

  return (
    <AnimatePresence mode="wait" custom={onboardingDirection} initial={false}>
      <motion.div
        key={onboardingStep}
        custom={onboardingDirection}
        variants={onboardingPageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        {onboardingStep === "modeSelect" ? (
          <div className="flex h-full flex-col justify-between pb-4">
            <div>
              <div className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(37,99,235,0.88),rgba(139,92,246,0.82))] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                <p className="text-sm uppercase tracking-[0.24em] text-white/70">choose a mode</p>
                <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em]">
                  What do you want to rehearse first?
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
                  Start with the conversation that matters most right now. You can switch modes or build a custom persona anytime.
                </p>
              </div>
              <div className="mt-4 rounded-[30px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/6 dark:shadow-[0_24px_60px_rgba(2,6,23,0.32)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Starting room</p>
                <h4 className="mt-4 text-2xl font-semibold leading-snug tracking-[-0.03em] text-slate-950 dark:text-slate-100">
                  Pick one of the four practice modes.
                </h4>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {scenarioModes.map((item) => {
                    const Icon = modeIconMap[item];
                    const active = item === mode;

                    return (
                      <button
                        key={item}
                        onClick={() => onSelectMode(item)}
                        className={`rounded-[24px] border p-4 text-left transition ${
                          active
                            ? "border-slate-900/10 bg-slate-950 text-white shadow-[0_20px_40px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-white/10"
                            : `border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(255,255,255,0.72)),linear-gradient(135deg,var(--tw-gradient-stops))] text-slate-900 shadow-[0_14px_34px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(15,23,42,0.82),rgba(15,23,42,0.58)),linear-gradient(135deg,var(--tw-gradient-stops))] dark:text-slate-100 ${modeSurfaceMap[item]}`
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <p className="mt-4 text-sm font-semibold">{practiceScenarios[item].shortTitle}</p>
                        <p className={`mt-1 text-xs leading-5 ${active ? "text-white/72" : "text-slate-600 dark:text-slate-400"}`}>
                          {practiceScenarios[item].summary}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mode}
                    variants={modeFadeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="mt-4 rounded-[22px] bg-slate-50/90 p-4 dark:bg-white/6"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Selected</p>
                    <p className="mt-2 text-base font-semibold text-slate-950 dark:text-slate-100">{selectedScenario.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{selectedScenario.description}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={onContinueToApp}
                className="w-full rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.2)] transition hover:bg-slate-800"
              >
                Continue with {selectedScenario.shortTitle}
              </button>
              <button
                onClick={onReturnToIntro}
                className="w-full rounded-full border border-slate-200/80 bg-white/70 px-5 py-4 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-between pb-4">
            <div>
              <div className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(37,99,235,0.88),rgba(139,92,246,0.82))] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                <p className="text-sm uppercase tracking-[0.24em] text-white/70">maya</p>
                <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em]">
                  Practice conversations before they matter.
                </h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-white/75">
                  A premium rehearsal app for interviews, networking, dating, and presentations.
                </p>
              </div>
              <div className="mt-4 rounded-[30px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/6 dark:shadow-[0_24px_60px_rgba(2,6,23,0.32)]">
                <AnimatePresence mode="wait" custom={onboardingDirection} initial={false}>
                  <motion.div
                    key={slide.title}
                    custom={onboardingDirection}
                    variants={onboardingSlideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{slide.eyebrow}</p>
                    <h4 className="mt-4 text-2xl font-semibold leading-snug tracking-[-0.03em] text-slate-950 dark:text-slate-100">
                      {slide.title}
                    </h4>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{slide.body}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex gap-2">
                    {onboardingSlides.map((item, index) => (
                      <span
                        key={item.title}
                        className={cn(
                          "h-2 rounded-full transition-all",
                          index === onboardingIndex ? "w-8 bg-slate-900 dark:bg-white" : "w-2 bg-slate-300 dark:bg-slate-700"
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={onRetreat}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-white dark:border-white/10 dark:bg-white/6 dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={onAdvance}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-white dark:border-white/10 dark:bg-white/6 dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={onShowModeSelection}
                className="w-full rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.2)] transition hover:bg-slate-800"
              >
                Get Started
              </button>
              <button
                onClick={onExplorePrototype}
                className="w-full rounded-full border border-slate-200/80 bg-white/70 px-5 py-4 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
              >
                Explore the prototype
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function HomeScreen({
  mode,
  progressScore,
  onSelectMode,
  onContinueCurrentMode,
  onOpenCustomPersona,
  onOpenScenarios,
  onOpenAnalytics
}: {
  mode: PracticeMode;
  progressScore: number;
  onSelectMode: (mode: PracticeMode) => void;
  onContinueCurrentMode: () => void;
  onOpenCustomPersona: () => void;
  onOpenScenarios: () => void;
  onOpenAnalytics: () => void;
}) {
  return (
    <div className="h-full min-h-0 phone-scroll pb-24">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Daily focus</p>
          <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-slate-950 dark:text-slate-100">Good morning, Maya.</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Two sessions left to lock in your weekly goal.</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/80 shadow-[0_14px_36px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
          <UserRound className="h-5 w-5 text-slate-900 dark:text-slate-100" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[1.2fr_0.8fr] gap-3">
        <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(37,99,235,0.82),rgba(94,234,212,0.6))] p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            <Flame className="h-4 w-4" />
            18 day streak
          </div>
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">12 min</p>
          <p className="mt-1 text-sm text-white/75">Average daily practice this week</p>
          <button
            onClick={() => onSelectMode(mode)}
            className="mt-6 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
          >
            Continue practicing
          </button>
        </div>
        <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.76))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.34)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Skill score</p>
          <div className="mt-4 flex justify-center">
            <ScoreRing value={progressScore} size={96} strokeWidth={9} />
          </div>
          <button onClick={onOpenAnalytics} className="mt-4 w-full rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 dark:bg-white dark:text-slate-950">
            View analytics
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Continue where you left off</p>
            <h4 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">{practiceScenarios[mode].title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenScenarios}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
            >
              Switch
            </button>
            <button
              onClick={onContinueCurrentMode}
              className="rounded-full bg-slate-950 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.12)] transition hover:bg-slate-800"
            >
              Continue
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{practiceScenarios[mode].description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {practiceScenarios[mode].tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Quick actions</p>
          <button onClick={onOpenScenarios} className="text-xs font-medium text-slate-500 dark:text-slate-400">
            See all
          </button>
        </div>
        <button
          onClick={onOpenCustomPersona}
          className="w-full rounded-[28px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(244,247,255,0.78)),linear-gradient(135deg,rgba(59,130,246,0.08),rgba(14,165,233,0.05))] p-5 text-left shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(15,23,42,0.88),rgba(15,23,42,0.64))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Bring your own persona</p>
              <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">{customPersonaShowcase.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{customPersonaShowcase.summary}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
              <Paperclip className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">Reply coach</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">Live simulation</span>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">{customPersonaShowcase.stat}</span>
          </div>
        </button>
        <div className="grid grid-cols-2 gap-3">
          {scenarioModes.map((item) => {
            const Icon = modeIconMap[item];

            return (
              <button
                key={item}
                onClick={() => onSelectMode(item)}
                className={`mt-3 rounded-[24px] border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(255,255,255,0.62)),linear-gradient(135deg,var(--tw-gradient-stops))] p-4 text-left shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(15,23,42,0.82),rgba(15,23,42,0.56)),linear-gradient(135deg,var(--tw-gradient-stops))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)] ${modeSurfaceMap[item]}`}
              >
                <Icon className="h-5 w-5 text-slate-900 dark:text-slate-100" />
                <p className="mt-4 text-sm font-semibold text-slate-950 dark:text-slate-100">{practiceScenarios[item].shortTitle}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">{practiceScenarios[item].summary}</p>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent session</p>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">+9 this week</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <MiniStat label="Warmth" value="91" />
          <MiniStat label="Clarity" value="88" />
          <MiniStat label="Pacing" value="126" suffix=" wpm" />
        </div>
      </div>
    </div>
  );
}

function ScenarioSelectionScreen({
  activeMode,
  onSelectMode,
  onOpenCustomPersona
}: {
  activeMode: PracticeMode;
  onSelectMode: (mode: PracticeMode) => void;
  onOpenCustomPersona: () => void;
}) {
  return (
    <div className="h-full min-h-0 phone-scroll pb-24">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Scenario Selection</p>
      <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-slate-950 dark:text-slate-100">Choose your practice room.</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
        Each mode adapts the persona, pressure, and feedback language to the moment you are preparing for.
      </p>
      <div className="mt-5 space-y-3">
        {scenarioModes.map((item) => {
          const scenario = practiceScenarios[item];
          const Icon = modeIconMap[item];
          const active = item === activeMode;
          const isPresentation = item === "presentation";
          const title = isPresentation ? scenario.shortTitle : scenario.title;
          const description = isPresentation ? scenario.summary : scenario.description;
          const cardClassName = isPresentation
            ? active
              ? "border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.92))] text-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(15,23,42,0.78))] dark:text-slate-100 dark:shadow-[0_24px_60px_rgba(2,6,23,0.34)]"
              : "border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.88))] text-slate-950 shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.76))] dark:text-slate-100 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]"
            : active
              ? "border-slate-900/10 bg-slate-950 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-white/10 dark:text-white"
              : `border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.68)),linear-gradient(135deg,var(--tw-gradient-stops))] shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(15,23,42,0.62)),linear-gradient(135deg,var(--tw-gradient-stops))] dark:text-slate-100 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)] ${modeSurfaceMap[item]}`;
          const iconClassName = isPresentation
            ? "border border-white/70 bg-white/78 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
            : active
              ? "bg-white/10"
              : "border border-white/70 bg-white/82 dark:border-white/10 dark:bg-white/10";
          const descriptionClassName = isPresentation
            ? "text-slate-600 dark:text-slate-400"
            : active
              ? "text-white/70"
              : "text-slate-600 dark:text-slate-400";
          const chevronClassName = isPresentation
            ? "text-slate-400 dark:text-slate-500"
            : active
              ? "text-white/70"
              : "text-slate-400 dark:text-slate-500";
          const tagClassName = isPresentation
            ? "border border-slate-200/80 bg-white/80 text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            : active
              ? "bg-white/10 text-white/75"
              : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300";

          return (
            <button
              key={item}
              onClick={() => onSelectMode(item)}
              className={`w-full rounded-[28px] border p-5 text-left transition ${cardClassName}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {isPresentation ? (
                    <Icon className="mt-1 h-5 w-5 text-slate-900 dark:text-slate-100" />
                  ) : (
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClassName}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-semibold">{title}</p>
                    <p className={`mt-1 text-sm leading-6 ${descriptionClassName}`}>{description}</p>
                  </div>
                </div>
                <ChevronRight className={`mt-1 h-5 w-5 ${chevronClassName}`} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {scenario.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${tagClassName}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
      <button
        onClick={onOpenCustomPersona}
        className="mt-4 w-full rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,245,255,0.9))] p-5 text-left shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.68))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Specific person or room</p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">Create a custom persona</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Upload chats, screenshots, exports, or public URLs to build a reply coach or rehearsal partner.
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
            <Bot className="h-5 w-5" />
          </div>
        </div>
      </button>
    </div>
  );
}

function SessionSetupScreen({
  mode,
  personaId,
  difficulty,
  goal,
  onBack,
  onModeSelect,
  onPersonaSelect,
  onDifficultySelect,
  onGoalSelect,
  onOpenCustomPersona,
  onStartSession
}: {
  mode: PracticeMode;
  personaId: string;
  difficulty: string;
  goal: string;
  onBack: () => void;
  onModeSelect: (mode: PracticeMode) => void;
  onPersonaSelect: (value: string) => void;
  onDifficultySelect: (value: string) => void;
  onGoalSelect: (value: string) => void;
  onOpenCustomPersona: () => void;
  onStartSession: () => void;
}) {
  const scenario = practiceScenarios[mode];

  return (
    <div className="h-full min-h-0 phone-scroll pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:bg-white/6 dark:text-slate-400">
          Session Setup
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`setup-scenario-${mode}`}
          variants={modeFadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="mt-4"
        >
          <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.68)),linear-gradient(135deg,var(--tw-gradient-stops))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(15,23,42,0.62)),linear-gradient(135deg,var(--tw-gradient-stops))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Selected scenario</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">{scenario.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{scenario.context}</p>
            <p className="mt-4 text-sm font-medium text-slate-900 dark:text-slate-200">{scenario.stat}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 space-y-5">
        <SetupSectionTitle title="Scenario type" subtitle="Switch the rehearsal room instantly." />
        <div className="flex flex-wrap gap-2">
          {scenarioModes.map((item) => (
            <button
              key={item}
              onClick={() => onModeSelect(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                item === mode ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border border-slate-200 bg-white/75 text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
              }`}
            >
              {practiceScenarios[item].shortTitle}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`setup-details-${mode}`}
          variants={modeFadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <div className="mt-5 space-y-3">
            <SetupSectionTitle title="AI persona" subtitle="Pick a preset AI persona or build one from your own context." />
            <button
              onClick={onOpenCustomPersona}
              className="w-full rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,245,255,0.92))] p-4 text-left shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.68))] dark:text-slate-100 dark:shadow-[0_18px_40px_rgba(2,6,23,0.28)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
                    <Paperclip className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-slate-100">Create Persona</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Use chats, screenshots, exports, or public URLs to build someone specific.
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Custom</span>
              </div>
            </button>
            {scenario.personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => onPersonaSelect(persona.id)}
                className={`w-full rounded-[24px] border p-4 text-left transition ${
                  persona.id === personaId
                    ? "border-slate-900/10 bg-slate-950 text-white shadow-[0_20px_40px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-white/10"
                    : "border-white/70 bg-white/82 text-slate-900 shadow-[0_14px_34px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:shadow-[0_18px_40px_rgba(2,6,23,0.28)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{persona.name}</p>
                    <p className={`mt-1 text-sm ${persona.id === personaId ? "text-white/70" : "text-slate-600 dark:text-slate-400"}`}>{persona.role}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${persona.id === personaId ? "bg-white/10" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}>
                    {persona.focus}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-5">
            <SetupSectionTitle title="Difficulty" subtitle="Adjust pressure and realism." />
            <div className="mt-3 flex rounded-full border border-slate-200 bg-white/70 p-1 dark:border-white/10 dark:bg-white/6">
              {scenario.difficulties.map((item) => (
                <button
                  key={item}
                  onClick={() => onDifficultySelect(item)}
                  className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
                    item === difficulty ? "bg-slate-950 text-white shadow-[0_10px_20px_rgba(15,23,42,0.12)] dark:bg-white dark:text-slate-950" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <SetupSectionTitle title="Conversation goal" subtitle="Choose the outcome you want to optimize for." />
            <div className="mt-3 flex flex-wrap gap-2">
              {scenario.goals.map((item) => (
                <button
                  key={item}
                  onClick={() => onGoalSelect(item)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    item === goal ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border border-slate-200 bg-white/75 text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={onStartSession}
        className="mt-6 w-full rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
      >
        Start Practice Session
      </button>
    </div>
  );
}

function CustomPersonaCreateScreen({
  mode,
  personaName,
  personaScope,
  personaAction,
  selectedSources,
  visibleSources,
  sourcePreview,
  onBack,
  onModeChange,
  onPersonaNameChange,
  onActionChange,
  onToggleSource,
  onGeneratePersona
}: {
  mode: PracticeMode;
  personaName: string;
  personaScope: PersonaScope;
  personaAction: PersonaAction;
  selectedSources: PersonaSourceType[];
  visibleSources: typeof personaSourceCatalog;
  sourcePreview: typeof generatedPersonaProfiles.privatePerson.sources;
  onBack: () => void;
  onModeChange: (value: PracticeMode) => void;
  onPersonaNameChange: (value: string) => void;
  onActionChange: (value: PersonaAction) => void;
  onToggleSource: (value: PersonaSourceType) => void;
  onGeneratePersona: () => void;
}) {
  const [activeSourceSheet, setActiveSourceSheet] = useState<PersonaSourceType | null>(null);
  const [pendingRemovalSource, setPendingRemovalSource] = useState<PersonaSourceType | null>(null);
  const [sourceDrafts, setSourceDrafts] = useState<Record<PersonaSourceType, PersonaSourceDraft>>(personaSourceDraftDefaults);
  const compactSources = visibleSources.filter((source) => source.type !== "publicUrl");
  const webSearchSource = visibleSources.find((source) => source.type === "publicUrl");

  function updateSourceDraft(type: PersonaSourceType, nextDraft: Partial<PersonaSourceDraft>) {
    setSourceDrafts((current) => ({
      ...current,
      [type]: {
        ...current[type],
        ...nextDraft
      }
    }));
  }

  function handleSourcePress(type: PersonaSourceType) {
    if (selectedSources.includes(type)) {
      setPendingRemovalSource(type);
      return;
    }

    setActiveSourceSheet(type);
  }

  function handleConfirmSource(type: PersonaSourceType) {
    if (!selectedSources.includes(type)) {
      onToggleSource(type);
    }

    setActiveSourceSheet(null);
  }

  return (
    <div className="relative h-full">
      <div className="h-full min-h-0 phone-scroll pb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:bg-white/6 dark:text-slate-400">
            Custom Persona
          </div>
        </div>
        <div className={`mt-4 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.68)),linear-gradient(135deg,var(--tw-gradient-stops))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(15,23,42,0.62)),linear-gradient(135deg,var(--tw-gradient-stops))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)] ${personaScopeSurfaceMap[personaScope]}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Bring your own context</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">Create a persona from real signal.</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Upload what you already have, decide whether you want reply coaching or live rehearsal, and inspect the persona before you trust it.
          </p>
        </div>
        <div className="mt-5">
          <SetupSectionTitle title="Practice mode" subtitle="Choose the room this custom persona should be built for. Opening from a mode keeps that mode selected automatically." />
          <div className="mt-3 flex flex-wrap gap-2">
            {scenarioModes.map((item) => (
              <button
                key={item}
                onClick={() => onModeChange(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  item === mode
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "border border-slate-200 bg-white/75 text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
                }`}
              >
                {practiceScenarios[item].shortTitle}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`persona-room-${mode}`}
              variants={modeFadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="mt-3 rounded-[22px] bg-slate-50/90 p-4 dark:bg-white/6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Selected room</p>
              <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-slate-100">{practiceScenarios[mode].title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{practiceScenarios[mode].summary}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-5">
          <SetupSectionTitle title="Persona name" subtitle="Give this person, audience, or rehearsal partner a name." />
          <input
            value={personaName}
            onChange={(event) => onPersonaNameChange(event.target.value)}
            placeholder={generatedPersonaProfiles[personaScope].name}
            className="mt-3 w-full rounded-[24px] border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        <div className="mt-5">
          <SetupSectionTitle title="Persona action" subtitle="Choose whether you want drafts right away or a live practice room." />
          <div className="mt-3 grid grid-cols-2 gap-3">
            {personaActionOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onActionChange(option.id)}
                className={`rounded-[24px] border p-4 text-left transition ${
                  option.id === personaAction
                    ? "border-slate-900/10 bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-white/10"
                    : "border-white/70 bg-white/82 text-slate-900 shadow-[0_14px_34px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 dark:text-slate-100"
                }`}
              >
                <p className="text-sm font-semibold">{option.label}</p>
                <p className={`mt-2 text-xs leading-5 ${option.id === personaAction ? "text-white/72" : "text-slate-600 dark:text-slate-400"}`}>{option.description}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <SetupSectionTitle title="Source material" subtitle="" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            {compactSources.map((source) => {
              const Icon = personaSourceIconMap[source.type];
              const active = selectedSources.includes(source.type);

              return (
                <button
                  key={source.type}
                  onClick={() => handleSourcePress(source.type)}
                  className={`rounded-[24px] border p-4 text-left transition ${
                    active
                      ? "border-slate-900/10 bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-white/10"
                      : "border-white/70 bg-white/82 text-slate-900 shadow-[0_14px_34px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 dark:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <p className="text-sm font-semibold">{source.label}</p>
                  </div>
                  <p className={`mt-2 text-xs leading-5 ${active ? "text-white/72" : "text-slate-600 dark:text-slate-400"}`}>{source.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${active ? "bg-white/10 text-white/80" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"}`}>
                      {active ? "Attached" : "Tap to add"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          {webSearchSource ? (
            <div className="mt-3">
              {(() => {
                const Icon = personaSourceIconMap[webSearchSource.type];
                const active = selectedSources.includes(webSearchSource.type);

                return (
                  <button
                    onClick={() => handleSourcePress(webSearchSource.type)}
                    className={`w-full rounded-[24px] border p-4 text-left transition ${
                      active
                        ? "border-slate-900/10 bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-white/10"
                        : "border-white/70 bg-white/82 text-slate-900 shadow-[0_14px_34px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 dark:text-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{webSearchSource.label}</p>
                          <p className={`mt-1 text-sm leading-6 ${
                            active
                              ? "text-white/72"
                              : "text-slate-600 dark:text-slate-400"
                          }`}>
                            {webSearchSource.description}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          active
                            ? "bg-white/10 text-white/80"
                            : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"
                        }`}>
                          {active ? "Attached" : "Tap to add"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })()}
            </div>
          ) : null}
        </div>
        <div className="mt-5 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Source status preview</p>
          <div className="mt-4 space-y-3">
            {sourcePreview.length > 0 ? (
              sourcePreview.map((source) => {
                const Icon = personaSourceIconMap[source.type];

                return (
                  <div key={source.type} className="flex items-start gap-3 rounded-[22px] bg-slate-50/80 p-4 dark:bg-white/6">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:bg-white/10 dark:text-slate-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">{source.label}</p>
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">{source.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{source.summary}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{source.detail}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[22px] bg-slate-50/80 p-4 text-sm text-slate-500 dark:bg-white/6 dark:text-slate-400">
                Select at least one source to generate the persona.
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onGeneratePersona}
          disabled={selectedSources.length === 0}
          className="mt-6 w-full rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Generate Persona
        </button>
      </div>
      <AnimatePresence>
        {activeSourceSheet ? (
          <PersonaSourceSheet
            key={activeSourceSheet}
            sourceType={activeSourceSheet}
            draft={sourceDrafts[activeSourceSheet]}
            onClose={() => setActiveSourceSheet(null)}
            onDraftChange={(nextDraft) => {
              updateSourceDraft(activeSourceSheet, nextDraft);
            }}
            onConfirm={() => {
              handleConfirmSource(activeSourceSheet);
            }}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {pendingRemovalSource ? (
          <SourceRemovalSheet
            key={pendingRemovalSource}
            sourceType={pendingRemovalSource}
            onClose={() => setPendingRemovalSource(null)}
            onConfirm={() => {
              onToggleSource(pendingRemovalSource);
              setPendingRemovalSource(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PersonaSourceSheet({
  sourceType,
  draft,
  onClose,
  onDraftChange,
  onConfirm
}: {
  sourceType: PersonaSourceType;
  draft: PersonaSourceDraft;
  onClose: () => void;
  onDraftChange: (draft: Partial<PersonaSourceDraft>) => void;
  onConfirm: () => void;
}) {
  const copy = personaSourceSheetCopy[sourceType];
  const Icon = personaSourceIconMap[sourceType];
  const canConfirm =
    sourceType === "screenshot" || sourceType === "chatExport"
      ? draft.attachmentNames.length > 0
      : draft.primaryText.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute -bottom-4 -left-4 -right-4 -top-16 z-30 flex items-end justify-center bg-[rgba(15,23,42,0.46)] px-3 pb-3 backdrop-blur-sm"
    >
      <button
        aria-label="Close source sheet"
        className="absolute inset-0"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 44, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex w-full max-h-full min-h-0 flex-col overflow-hidden rounded-[30px] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.995),rgba(248,250,252,0.985))] shadow-[0_30px_80px_rgba(15,23,42,0.24)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(10,15,28,0.995),rgba(15,23,42,0.985))]"
      >
        <div className="border-b border-slate-200/80 px-5 pb-4 pt-5 dark:border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Add source</p>
                <h4 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">{copy.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{copy.body}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 space-y-4 phone-scroll px-5 py-5">
          {copy.attachmentLabel ? (
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/6">
              {sourceType === "screenshot" ? (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{copy.attachmentLabel}</p>
                      <p className="mt-2 text-sm font-medium text-slate-950 dark:text-slate-100">
                        {draft.attachmentNames.length > 0
                          ? `${draft.attachmentNames.length} screenshots attached`
                          : "No screenshots added yet"}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        onDraftChange({
                          attachmentNames: [
                            ...draft.attachmentNames,
                            getMockAttachmentName(sourceType, draft.attachmentNames.length)
                          ]
                        })
                      }
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                    >
                      {copy.attachmentButton}
                    </button>
                  </div>
                  {draft.attachmentNames.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {draft.attachmentNames.map((attachmentName, index) => (
                        <button
                          key={attachmentName}
                          onClick={() =>
                            onDraftChange({
                              attachmentNames: draft.attachmentNames.filter((_, attachmentIndex) => attachmentIndex !== index)
                            })
                          }
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                        >
                          {attachmentName} <span className="text-slate-400">x</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{copy.attachmentLabel}</p>
                    <p className="mt-2 text-sm font-medium text-slate-950 dark:text-slate-100">
                      {draft.attachmentNames[0] || "No attachment added yet"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      onDraftChange({
                        attachmentNames: draft.attachmentNames.length > 0 ? [] : [getMockAttachmentName(sourceType, 0)]
                      })
                    }
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                  >
                    {draft.attachmentNames.length > 0 ? "Clear" : copy.attachmentButton}
                  </button>
                </div>
              )}
            </div>
          ) : null}
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {copy.fieldLabel}
            </label>
            {sourceType === "publicUrl" ? (
              <input
                value={draft.primaryText}
                onChange={(event) => onDraftChange({ primaryText: event.target.value })}
                placeholder={copy.placeholder}
                className="mt-2 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            ) : (
              <textarea
                value={draft.primaryText}
                onChange={(event) => onDraftChange({ primaryText: event.target.value })}
                placeholder={copy.placeholder}
                rows={sourceType === "pastedText" ? 6 : 4}
                className="mt-2 w-full resize-none rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            )}
          </div>
          {copy.noteLabel ? (
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {copy.noteLabel}
              </label>
              <textarea
                value={draft.note}
                onChange={(event) => onDraftChange({ note: event.target.value })}
                placeholder={copy.notePlaceholder}
                rows={3}
                className="mt-2 w-full resize-none rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
          ) : null}
        </div>
        <div className="border-t border-slate-200/80 px-5 py-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!canConfirm}
              className="flex-1 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(15,23,42,0.16)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copy.saveLabel}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SourceRemovalSheet({
  sourceType,
  onClose,
  onConfirm
}: {
  sourceType: PersonaSourceType;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const Icon = personaSourceIconMap[sourceType];
  const sourceLabel = sourceType === "publicUrl" ? "Web search" : personaSourceCatalog.find((source) => source.type === sourceType)?.label ?? "Source";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute -bottom-4 -left-4 -right-4 -top-16 z-40 flex items-end justify-center bg-[rgba(15,23,42,0.42)] px-3 pb-3 backdrop-blur-sm"
    >
      <button aria-label="Close removal confirmation" className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.96 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full rounded-[28px] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.995),rgba(248,250,252,0.985))] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(10,15,28,0.995),rgba(15,23,42,0.985))]"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Remove source</p>
            <h4 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">
              Remove {sourceLabel}?
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              This source will be removed from the persona inputs until you add it again.
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(15,23,42,0.16)] transition hover:bg-slate-800"
          >
            Remove source
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CustomPersonaReviewScreen({
  personaName,
  personaProfile,
  selectedSources,
  sourceConfidence,
  activeAction,
  onBack,
  onEditPersona,
  onOpenReplyCoach,
  onStartSimulation
}: {
  personaName: string;
  personaProfile: (typeof generatedPersonaProfiles)[PersonaScope];
  selectedSources: typeof generatedPersonaProfiles.privatePerson.sources;
  sourceConfidence: typeof generatedPersonaProfiles.privatePerson.sourceConfidence;
  activeAction: PersonaAction;
  onBack: () => void;
  onEditPersona: () => void;
  onOpenReplyCoach: () => void;
  onStartSimulation: () => void;
}) {
  return (
    <div className="h-full min-h-0 phone-scroll pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:bg-white/6 dark:text-slate-400">
          Persona Review
        </div>
      </div>
      <div className={`mt-4 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.72)),linear-gradient(135deg,var(--tw-gradient-stops))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.68)),linear-gradient(135deg,var(--tw-gradient-stops))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)] ${personaScopeSurfaceMap[personaProfile.scope]}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{personaProfile.relationshipLabel}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">{personaName}</h3>
            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">{personaProfile.role}</p>
          </div>
          <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
            {activeAction === "replyCoach" ? "Reply-first" : "Simulation-first"}
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{personaProfile.summary}</p>
      </div>
      <div className="mt-4 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Style traits</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {personaProfile.styleTraits.map((trait) => (
            <span key={trait} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
              {trait}
            </span>
          ))}
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Response tendencies</p>
        <ul className="mt-3 space-y-2">
          {personaProfile.responseTendencies.map((item) => (
            <li key={item} className="text-sm leading-6 text-slate-600 dark:text-slate-400">{item}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[24px] border border-white/70 bg-white/82 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Common topics</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {personaProfile.commonTopics.map((topic) => (
              <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                {topic}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[24px] border border-white/70 bg-white/82 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Watch out</p>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{personaProfile.watchOut}</p>
        </div>
      </div>
      <div className="mt-4 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Source provenance</p>
        <div className="mt-4 space-y-3">
          {selectedSources.map((source) => {
            const Icon = personaSourceIconMap[source.type];
            const confidence = sourceConfidence.find((item) => item.type === source.type);

            return (
              <div key={source.type} className="flex items-start gap-3 rounded-[22px] bg-slate-50/80 p-4 dark:bg-white/6">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:bg-white/10 dark:text-slate-100">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">{source.label}</p>
                    {confidence ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                        {confidence.confidence}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{source.summary}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{confidence?.note ?? source.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={onOpenReplyCoach}
          className="rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]"
        >
          Get Reply Suggestions
        </button>
        <button
          onClick={onStartSimulation}
          className="rounded-full border border-slate-200 bg-white/75 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/6 dark:text-slate-200"
        >
          Start Simulation
        </button>
      </div>
      <button
        onClick={onEditPersona}
        className="mt-3 w-full rounded-full border border-slate-200 bg-white/75 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/6 dark:text-slate-200"
      >
        Edit Sources
      </button>
    </div>
  );
}

function ReplyCoachScreen({
  personaName,
  personaProfile,
  onBack,
  onStartSimulation
}: {
  personaName: string;
  personaProfile: (typeof generatedPersonaProfiles)[PersonaScope];
  onBack: () => void;
  onStartSimulation: () => void;
}) {
  return (
    <div className="h-full min-h-0 phone-scroll pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:bg-white/6 dark:text-slate-400">
          Reply Coach
        </div>
      </div>
        <div className={`mt-4 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.72)),linear-gradient(135deg,var(--tw-gradient-stops))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.68)),linear-gradient(135deg,var(--tw-gradient-stops))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)] ${personaScopeSurfaceMap[personaProfile.scope]}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Persona: {personaName}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{personaProfile.replyContextLabel}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">{personaProfile.replyContextTitle}</h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
            <Camera className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{personaProfile.replyContextBody}</p>
        <div className="mt-4 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 shadow-[0_14px_34px_rgba(245,158,11,0.14)]">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Watch out</span>
          <p className="mt-2">{personaProfile.watchOut}</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {personaProfile.replySuggestions.map((suggestion) => (
          <div key={suggestion.toneLabel} className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{suggestion.toneLabel}</p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">{suggestion.bestFor}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                Draft option
              </span>
            </div>
            <p className="mt-4 rounded-[22px] bg-slate-50/80 p-4 text-sm leading-6 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:bg-slate-900/80 dark:text-slate-100">
              {suggestion.draft}
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Why this works</p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{suggestion.rationale}</p>
            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Why it fits this persona</p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{suggestion.fitExplanation}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onStartSimulation}
        className="mt-4 w-full rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
      >
        Practice This Persona Live
      </button>
    </div>
  );
}

function LiveSessionScreen({
  surfaceClassName,
  sessionLabel,
  contextLabel,
  personaName,
  personaRole,
  personaFocus,
  context,
  messages,
  progress,
  hint,
  hintOpen,
  typedMode,
  reaction,
  isComplete,
  onBack,
  onToggleHint,
  onToggleTypedMode,
  onNextResponse,
  onEndSession
}: {
  surfaceClassName: string;
  sessionLabel: string;
  contextLabel: string;
  personaName: string;
  personaRole: string;
  personaFocus: string;
  context: string;
  messages: Message[];
  progress: number;
  hint: string;
  hintOpen: boolean;
  typedMode: boolean;
  reaction: string;
  isComplete: boolean;
  onBack: () => void;
  onToggleHint: () => void;
  onToggleTypedMode: () => void;
  onNextResponse: () => void;
  onEndSession: () => void;
}) {
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messageListRef.current;

    if (!container) {
      return;
    }

    const timer = window.setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: messages.length > 1 ? "smooth" : "auto"
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [messages.length]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:bg-white/6 dark:text-slate-400">
          {sessionLabel}
        </div>
      </div>
      <div className={`mt-4 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.7)),linear-gradient(135deg,var(--tw-gradient-stops))] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.62)),linear-gradient(135deg,var(--tw-gradient-stops))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)] ${surfaceClassName}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SpeakingOrb />
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">{personaName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{personaRole}</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">{reaction}</span>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{contextLabel}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{context}</p>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Persona focus: {personaFocus}</p>
        <div className="mt-4 h-2 rounded-full bg-slate-200/80 dark:bg-white/10">
          <motion.div
            className="h-full rounded-full bg-slate-950 dark:bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(progress, 12)}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>
      </div>
      <div className="relative mt-4 min-h-0 flex-1 overflow-hidden rounded-[28px] border border-white/70 bg-white/82 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
        <AnimatePresence>
          {hintOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-3 top-3 z-20 rounded-[22px] border border-amber-200 bg-amber-50/95 p-4 shadow-[0_18px_40px_rgba(245,158,11,0.18)] backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Coach hint</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-800">{hint}</p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div ref={messageListRef} className="h-full phone-scroll p-3 pb-4">
          <div className="space-y-3 pt-1">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={`${message.speaker}-${message.text}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.24 }}
                  className={cn("flex", message.speaker === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[82%] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]",
                      message.speaker === "user"
                        ? "rounded-br-md bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
                    )}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <button
        onClick={onNextResponse}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition hover:bg-slate-800"
      >
        {isComplete ? "View Feedback" : "Next Response"}
        <ChevronRight className="ml-2 h-4 w-4" />
      </button>
      <div className="mt-3 grid grid-cols-4 gap-2">
        <ControlButton icon={Mic} label="Mic" active={!typedMode} onClick={onToggleTypedMode} />
        <ControlButton icon={MessageSquare} label="Type" active={typedMode} onClick={onToggleTypedMode} />
        <ControlButton icon={Lightbulb} label="Hint" active={hintOpen} onClick={onToggleHint} />
        <ControlButton icon={Square} label="End" active={false} onClick={onEndSession} danger />
      </div>
    </div>
  );
}

function FeedbackScreen({
  feedback,
  title,
  summary,
  primaryActionLabel,
  onPracticeAgain,
  onOpenAnalytics,
  onBack
}: {
  feedback: SessionFeedback;
  title: string;
  summary: string;
  primaryActionLabel: string;
  onPracticeAgain: () => void;
  onOpenAnalytics: () => void;
  onBack: () => void;
}) {
  return (
    <div className="h-full min-h-0 phone-scroll pb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:bg-white/6 dark:text-slate-400">
          {title}
        </div>
      </div>
      <div className="mt-4 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.82),rgba(30,41,59,0.74))] p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Overall score</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{feedback.overallScore}</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">{summary}</p>
          </div>
          <ScoreRing value={feedback.overallScore} size={92} strokeWidth={9} light />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {feedback.metrics.map((metric) => (
          <div key={metric.label} className="rounded-[22px] border border-white/70 bg-white/82 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{metric.label}</p>
            <CountUp value={metric.value} className="mt-3 block text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-slate-100" />
            <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${metricToneMap[metric.tone] ?? "bg-slate-100 text-slate-700"}`}>
              Premium signal
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <MiniStatCard label="Filler words" value={String(feedback.fillerWords)} subtitle="Across the full session" />
        <MiniStatCard label="Pacing" value={feedback.pacing} subtitle="Steady and coachable" />
      </div>
      <div className="mt-4 rounded-[24px] border border-white/70 bg-white/82 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Strengths</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {feedback.strengths.map((item) => (
            <span key={item} className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 rounded-[24px] border border-white/70 bg-white/82 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Improvements</p>
        <ul className="mt-3 space-y-2">
          {feedback.improvements.map((item) => (
            <li key={item} className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,245,249,0.84))] p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.68))] dark:shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Rewritten response</p>
        <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{feedback.rewrittenResponse}</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={onPracticeAgain}
          className="rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]"
        >
          {primaryActionLabel}
        </button>
        <button
          onClick={onOpenAnalytics}
          className="rounded-full border border-slate-200 bg-white/75 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/6 dark:text-slate-200"
        >
          Open Analytics
        </button>
      </div>
    </div>
  );
}

function AnalyticsScreen({
  mode,
  theme
}: {
  mode: PracticeMode;
  theme: ResolvedTheme;
}) {
  const barGradient =
    theme === "dark"
      ? "bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(59,130,246,0.72))]"
      : "bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(59,130,246,0.72))]";

  return (
    <div className="h-full min-h-0 phone-scroll pb-24">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Progress Analytics</p>
      <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-slate-950 dark:text-slate-100">Momentum you can feel.</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <MiniStatCard label="Sessions completed" value="42" subtitle="Last 30 days" />
        <MiniStatCard label="Current streak" value="18" subtitle="Days in a row" />
      </div>
      <div className="mt-4 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Weekly reps</p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">Steady, compounding practice</p>
          </div>
          <TrendingUp className="h-5 w-5 text-slate-900 dark:text-slate-100" />
        </div>
        <div className="mt-6 flex items-end gap-2">
          {weeklyPractice.map((value, index) => (
            <motion.div
              key={`${value}-${index}`}
              initial={{ height: 0 }}
              animate={{ height: value * 12 }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              className={`flex-1 rounded-t-[14px] ${barGradient}`}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Skill trend</p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">Confidence and clarity are climbing.</p>
          </div>
          <BarChart3 className="h-5 w-5 text-slate-900 dark:text-slate-100" />
        </div>
        <TrendLine values={skillTrend} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <MiniStatCard label="Best scenario" value={practiceScenarios[mode].shortTitle} subtitle="Highest consistency score" />
        <MiniStatCard label="Weakest area" value="Pacing" subtitle="Mostly on fast openings" />
      </div>
    </div>
  );
}

function ProfileScreen({
  mode,
  notificationsEnabled,
  voiceEnabled,
  theme,
  onToggleNotifications,
  onToggleVoice,
  onThemeChange,
  onModeSelect
}: {
  mode: PracticeMode;
  notificationsEnabled: boolean;
  voiceEnabled: boolean;
  theme: ThemePreference;
  onToggleNotifications: () => void;
  onToggleVoice: () => void;
  onThemeChange: (value: ThemePreference) => void;
  onModeSelect: (mode: PracticeMode) => void;
}) {
  return (
    <div className="h-full min-h-0 phone-scroll pb-24">
      <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(241,245,249,0.75))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.7))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">Jordan Lee</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Goal: sound calmer and clearer under pressure</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">Pro</span>
        </div>
      </div>
      <div className="mt-4 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Preferred practice modes</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {scenarioModes.map((item) => (
            <button
              key={item}
              onClick={() => onModeSelect(item)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                item === mode
                  ? "bg-slate-950 text-white dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  : "border border-slate-200 bg-white/70 text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              }`}
            >
              {practiceScenarios[item].shortTitle}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)]">
        <SettingRow
          icon={Bell}
          title="Practice reminders"
          description="Gentle daily prompts to keep the streak moving."
          enabled={notificationsEnabled}
          onToggle={onToggleNotifications}
        />
        <div className="my-4 h-px bg-slate-200/80 dark:bg-white/10" />
        <SettingRow
          icon={Mic}
          title="Voice mode"
          description="Prefer spoken rehearsal by default when sessions begin."
          enabled={voiceEnabled}
          onToggle={onToggleVoice}
        />
        <div className="my-4 h-px bg-slate-200/80 dark:bg-white/10" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-10 w-10 items-center justify-center text-slate-700 dark:text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">Theme preference</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">Keep the prototype crisp in light mode, switch to dark, or adapt automatically.</p>
            </div>
          </div>
          <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/6">
            {(["Light", "Dark", "Auto"] as const).map((option) => (
              <button
                key={option}
                onClick={() => onThemeChange(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  option === theme
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabBar({
  currentScreen,
  onNavigate
}: {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}) {
  const tabs = [
    { screen: "home" as const, label: "Home", icon: Home },
    { screen: "scenarios" as const, label: "Modes", icon: Target },
    { screen: "analytics" as const, label: "Progress", icon: TrendingUp },
    { screen: "profile" as const, label: "Profile", icon: UserRound }
  ];

  return (
    <div className="absolute inset-x-4 bottom-4 z-30 rounded-[26px] border border-white/80 bg-white/86 p-2 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/78 dark:shadow-[0_24px_60px_rgba(2,6,23,0.42)]">
      <div className="grid grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const active = tab.screen === currentScreen;

          return (
            <button
              key={tab.label}
              onClick={() => onNavigate(tab.screen)}
              className={cn(
                "flex min-h-[52px] w-full flex-col items-center justify-center rounded-[18px] px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] transition",
                active ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-500 dark:text-slate-400"
              )}
            >
              <tab.icon className="mb-1 h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SpeakingOrb() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <motion.span
        className="absolute h-12 w-12 rounded-full bg-sky-400/30"
        animate={{ scale: [1, 1.26, 1], opacity: [0.65, 0.2, 0.65] }}
        transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute h-9 w-9 rounded-full bg-violet-400/25"
        animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.18, 0.55] }}
        transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
      />
      <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_12px_24px_rgba(15,23,42,0.2)]">
        <WandSparkles className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}

function ControlButton({
  icon: Icon,
  label,
  active,
  onClick,
  danger
}: {
  icon: typeof Mic;
  label: string;
  active: boolean;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-[20px] border px-1.5 py-2 text-[10px] font-semibold uppercase leading-none tracking-[0.08em] transition",
        danger
          ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/12 dark:text-rose-200"
          : active
            ? "border-slate-900/10 bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            : "border-slate-200 bg-white/80 text-slate-500 dark:border-white/10 dark:bg-white/6 dark:text-slate-300"
      )}
    >
      <Icon className="mx-auto mb-1 h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-white/8 dark:text-slate-200">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        onClick={onToggle}
        className={cn(
          "relative mt-0.5 h-[31px] w-[51px] shrink-0 rounded-full border p-[2px] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
          enabled
            ? "border-slate-900/5 bg-[linear-gradient(135deg,#1b2457,#0f172a)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_-1px_2px_rgba(15,23,42,0.18),0_10px_20px_rgba(15,23,42,0.08)]"
            : "border-slate-200 bg-[linear-gradient(180deg,#e2e8f0,#cbd5e1)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_16px_rgba(15,23,42,0.06)] dark:border-white/12 dark:bg-[linear-gradient(180deg,#334155,#1e293b)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_8px_16px_rgba(2,6,23,0.28)]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute inset-[2px] rounded-full transition-opacity duration-300",
            enabled
              ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_60%)] opacity-100"
              : "bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_65%)] opacity-80"
          )}
        />
        <span
          className={cn(
            "absolute left-[2px] top-1/2 h-[27px] w-[27px] -translate-y-1/2 rounded-full bg-[linear-gradient(180deg,#ffffff,#f8fafc)] shadow-[0_6px_16px_rgba(15,23,42,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] transition-transform duration-300 ease-out",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

function SetupSectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}

function MiniStat({ label, value, suffix = "" }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-[20px] bg-slate-50 p-3 dark:bg-white/6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">
        {value}
        {suffix}
      </p>
    </div>
  );
}

function MiniStatCard({
  label,
  value,
  subtitle
}: {
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/82 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6 dark:shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-slate-100">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}

function ScoreRing({
  value,
  size,
  strokeWidth,
  light
}: {
  value: number;
  size: number;
  strokeWidth: number;
  light?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ height: size, width: size }}>
      <svg className="-rotate-90" height={size} width={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke={light ? "rgba(255,255,255,0.16)" : "var(--score-ring-track)"}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke={light ? "#ffffff" : "var(--score-ring-stroke)"}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <CountUp
          value={value}
          className={cn("text-2xl font-semibold tracking-[-0.04em]", light ? "text-white" : "text-[color:var(--score-ring-text)]")}
        />
      </div>
    </div>
  );
}

function TrendLine({ values }: { values: number[] }) {
  const width = 256;
  const height = 96;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / Math.max(max - min, 1)) * (height - 18) - 9;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="mt-5">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full overflow-visible">
        <defs>
          <linearGradient id="trend-line" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="var(--trend-line-start)" />
            <stop offset="100%" stopColor="var(--trend-line-end)" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          points={points}
          stroke="url(#trend-line)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        {values.map((value, index) => {
          const x = (index / (values.length - 1)) * width;
          const y = height - ((value - min) / Math.max(max - min, 1)) * (height - 18) - 9;

          return <circle key={`${value}-${index}`} cx={x} cy={y} fill="var(--trend-line-dot)" r="4" />;
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        {["W1", "W2", "W3", "W4", "W5", "W6", "W7"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
