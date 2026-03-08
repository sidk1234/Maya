import {
  AppScreen,
  OnboardingSlide,
  PracticeMode,
  PracticeScenario,
  PricingTier,
  ShowcaseScreenSummary
} from "@/lib/types";

export const onboardingSlides: OnboardingSlide[] = [
  {
    eyebrow: "Practice Engine",
    title: "Rehearse the conversation before the room gets real.",
    body:
      "Switch between interviews, networking, dating, and presentations with AI personas calibrated for each scenario."
  },
  {
    eyebrow: "Live Persona",
    title: "Talk through pressure with grounded, realistic responses.",
    body:
      "Each practice run adapts to your pacing, confidence, and answer structure so the session feels like an actual conversation."
  },
  {
    eyebrow: "Instant Review",
    title: "Get sharp feedback on clarity, warmth, pacing, and filler words.",
    body:
      "maya turns every rehearsal into a scorecard, a rewrite, and a plan for the next round."
  }
];

export const practiceScenarios: Record<PracticeMode, PracticeScenario> = {
  interview: {
    id: "interview",
    title: "Interview Coach",
    shortTitle: "Interviews",
    summary: "Practice crisp, confident stories for interviews that matter.",
    description:
      "Mock behavioral interviews, role-specific prompts, and hiring manager follow-ups with live coaching cues.",
    stat: "94% stronger answer structure",
    accentFrom: "from-sky-400/70",
    accentTo: "to-cyan-300/60",
    tags: ["Behavioral", "Hiring Manager", "Storytelling"],
    difficulties: ["Warm-up", "Realistic", "Stretch"],
    personas: [
      { id: "avery", name: "Avery Chen", role: "Engineering Manager", focus: "Leadership under pressure" },
      { id: "maya", name: "Maya Patel", role: "PM Director", focus: "Cross-functional influence" },
      { id: "jonah", name: "Jonah Brooks", role: "Recruiter", focus: "Clear and concise storytelling" }
    ],
    goals: ["Tell a sharper story", "Handle follow-up pressure", "Sound senior and calm"],
    context: "Software engineer behavioral interview for a growth-stage product team.",
    opening:
      "Thanks for being here today. Tell me about a project where you influenced a team without formal authority.",
    transcript: [
      {
        user:
          "At my last internship I noticed our release notes process kept slipping, so I set up a simple review flow with design, QA, and product to cut the lag.",
        ai:
          "That is a promising start. What resistance did you hit, and how did you earn buy-in from people who did not report to you?",
        reaction: "Engaged",
        hint: "Lead with the outcome first, then show the conflict, then the action you owned."
      },
      {
        user:
          "The biggest pushback was that everyone felt another process would slow launches, so I ran a one-week pilot and showed that we actually reduced bug-related hotfixes.",
        ai:
          "Good. You are getting more concrete. Tighten the ending by quantifying the impact and your personal contribution in one sentence.",
        reaction: "Impressed",
        hint: "Use a single metric and a direct phrase like “I drove” or “I proposed.”"
      }
    ],
    feedback: {
      overallScore: 92,
      fillerWords: 6,
      pacing: "132 wpm",
      strengths: ["Strong ownership language", "Clear conflict-to-resolution arc", "Calm executive tone"],
      improvements: ["Quantify impact earlier", "Trim setup details by 12 seconds", "Close with the team outcome"],
      rewrittenResponse:
        "I noticed release notes were delaying launches, so I proposed a lightweight review flow across product, design, and QA. After piloting it for one sprint, we reduced bug-related hotfixes by 22% and cut release prep time by nearly a day.",
      metrics: [
        { label: "Confidence", value: 94, tone: "sky" },
        { label: "Clarity", value: 90, tone: "emerald" },
        { label: "Warmth", value: 82, tone: "violet" },
        { label: "Question Quality", value: 88, tone: "amber" }
      ]
    }
  },
  networking: {
    id: "networking",
    title: "Networking Coach",
    shortTitle: "Networking",
    summary: "Rehearse natural intros, follow-ups, and recruiter conversations.",
    description:
      "From career fairs to coffee chats, practice sounding curious, memorable, and easy to continue talking to.",
    stat: "2.3x more confident first intros",
    accentFrom: "from-violet-400/70",
    accentTo: "to-sky-300/55",
    tags: ["Career Fair", "Recruiter Chat", "Founder Intro"],
    difficulties: ["Warm-up", "Conference", "High Signal"],
    personas: [
      { id: "reid", name: "Reid Lawson", role: "Campus Recruiter", focus: "Compelling and concise introductions" },
      { id: "sana", name: "Sana Ahmed", role: "Startup Founder", focus: "Curiosity and quick rapport" },
      { id: "nina", name: "Nina Torres", role: "Product Designer", focus: "Coffee chat follow-ups" }
    ],
    goals: ["Make a memorable intro", "Ask better follow-ups", "Keep the energy natural"],
    context: "A college career fair with limited time and a recruiter juggling multiple students.",
    opening:
      "Hey there. I only have a minute before the next student, so give me the quick version. What should I remember about you?",
    transcript: [
      {
        user:
          "I am a computer science student who likes building user-facing tools, and lately I have been focused on making AI features easier to understand for everyday users.",
        ai:
          "Nice direction. That is broad though. Pick one example that shows initiative and tell me why it matters.",
        reaction: "Curious",
        hint: "Use one project, one result, one reason it connects to this company."
      },
      {
        user:
          "I built a study planner that used simple recommendation prompts to help classmates organize deadlines, and more than 120 students used it during finals week.",
        ai:
          "That lands well. End by connecting it to what you want next so the recruiter knows how to respond.",
        reaction: "Warm",
        hint: "Close with what kind of role or team you are exploring."
      }
    ],
    feedback: {
      overallScore: 89,
      fillerWords: 4,
      pacing: "124 wpm",
      strengths: ["Natural warmth", "Strong project example", "Good recruiter energy"],
      improvements: ["State your target role sooner", "Make the closing ask more direct", "Reduce soft qualifiers"],
      rewrittenResponse:
        "I build user-facing AI tools, and one recent example is a study planner I shipped for classmates that helped more than 120 students manage finals deadlines. I am looking for product-minded software internships where I can keep building clear, practical experiences like that.",
      metrics: [
        { label: "Confidence", value: 88, tone: "violet" },
        { label: "Clarity", value: 91, tone: "emerald" },
        { label: "Warmth", value: 95, tone: "rose" },
        { label: "Question Quality", value: 82, tone: "amber" }
      ]
    }
  },
  dating: {
    id: "dating",
    title: "Dating Coach",
    shortTitle: "Dating",
    summary: "Practice chemistry, confidence, and low-pressure banter.",
    description:
      "Work through first messages, first dates, and playful conversation without sounding scripted or overrehearsed.",
    stat: "31% warmer first impressions",
    accentFrom: "from-rose-400/70",
    accentTo: "to-orange-300/55",
    tags: ["First Message", "Banter", "First Date"],
    difficulties: ["Comfort", "Natural", "High Chemistry"],
    personas: [
      { id: "zoe", name: "Zoe Lin", role: "First Date Match", focus: "Playful confidence" },
      { id: "dylan", name: "Dylan Moss", role: "Hinge Match", focus: "Warm opener energy" },
      { id: "riley", name: "Riley James", role: "Coffee Date", focus: "Balanced curiosity" }
    ],
    goals: ["Sound playful, not forced", "Ask better questions", "Stay relaxed and present"],
    context: "A first date at a stylish neighborhood coffee bar after matching earlier in the week.",
    opening:
      "I am glad we finally made this happen. Your profile said you are into low-stakes adventures. What counts as an ideal one?",
    transcript: [
      {
        user:
          "Honestly, my favorite kind is when the plan feels loose enough to wander a little, like finding a place we did not mean to end up at.",
        ai:
          "That sounds relaxed. You can make it more memorable by adding one specific example and then turning the question back.",
        reaction: "Interested",
        hint: "Specificity makes you more vivid. Think one recent place, not a general pattern."
      },
      {
        user:
          "A few weeks ago I ended up at a tiny bookstore cafe because the rain messed up my plans, and it ended up being the best part of the day. What is your version of that?",
        ai:
          "Much better. The image is doing work for you, and the question feels easy to answer.",
        reaction: "Smiling",
        hint: "Stay with concrete details. They make you sound grounded and confident."
      }
    ],
    feedback: {
      overallScore: 87,
      fillerWords: 3,
      pacing: "118 wpm",
      strengths: ["Specific storytelling", "Warm and curious energy", "Balanced back-and-forth"],
      improvements: ["Keep answers 10% shorter", "Use fewer hedge phrases", "Add one more playful callback"],
      rewrittenResponse:
        "A few weeks ago the rain derailed my plans, so I ducked into a tiny bookstore cafe and stayed way longer than I expected. That kind of accidental detour is my favorite. What about you?",
      metrics: [
        { label: "Confidence", value: 84, tone: "rose" },
        { label: "Clarity", value: 88, tone: "amber" },
        { label: "Warmth", value: 96, tone: "rose" },
        { label: "Question Quality", value: 90, tone: "sky" }
      ]
    }
  },
  presentation: {
    id: "presentation",
    title: "Presentation Coach",
    shortTitle: "Presentations",
    summary: "Sharpen delivery for investor pitches, team updates, and classes.",
    description:
      "Practice speaking with structure, command, and clean pacing for audiences that expect clarity fast.",
    stat: "41% stronger executive presence",
    accentFrom: "from-teal-400/70",
    accentTo: "to-sky-300/55",
    tags: ["Pitch", "Team Update", "Classroom"],
    difficulties: ["Guided", "Investor Room", "Boardroom"],
    personas: [
      { id: "elena", name: "Elena Ross", role: "Seed Investor", focus: "Story and conviction" },
      { id: "omar", name: "Omar Singh", role: "Team Lead", focus: "Executive clarity" },
      { id: "lila", name: "Lila Hart", role: "Professor", focus: "Structure and pacing" }
    ],
    goals: ["Open with more authority", "Make the narrative tighter", "Land the ask clearly"],
    context: "A five-minute investor pitch for a communication coaching product.",
    opening:
      "You have five minutes. Give me the opening that makes me care about this problem before slide three.",
    transcript: [
      {
        user:
          "High-stakes conversations decide careers, deals, and relationships, but most people only realize they needed practice after the moment has already passed.",
        ai:
          "Strong tension. Now ground it in a customer and a concrete consequence so it feels urgent, not abstract.",
        reaction: "Focused",
        hint: "Use one persona and a single cost of poor communication."
      },
      {
        user:
          "For a student walking into a final-round interview, one weak answer can erase months of preparation. maya gives them a way to rehearse that moment before it arrives.",
        ai:
          "That lands. Your next improvement is pacing. Pause after the first sentence and let the claim breathe.",
        reaction: "Locked In",
        hint: "Short sentence. Pause. Then customer story."
      }
    ],
    feedback: {
      overallScore: 95,
      fillerWords: 2,
      pacing: "126 wpm",
      strengths: ["Clear thesis", "Strong audience command", "Convincing problem framing"],
      improvements: ["Use one slower pause after the hook", "Make the market transition cleaner", "Add a sharper closing ask"],
      rewrittenResponse:
        "High-stakes conversations shape careers, deals, and relationships. Yet most people only discover they needed practice after the moment is gone. For a student entering a final-round interview, one weak answer can erase months of preparation. maya lets them rehearse that moment before it arrives.",
      metrics: [
        { label: "Confidence", value: 97, tone: "teal" },
        { label: "Clarity", value: 94, tone: "emerald" },
        { label: "Warmth", value: 83, tone: "sky" },
        { label: "Question Quality", value: 90, tone: "amber" }
      ]
    }
  }
};

export const scenarioModes = Object.keys(practiceScenarios) as PracticeMode[];

export const showcaseScreenSummaries: Record<AppScreen, ShowcaseScreenSummary> = {
  onboarding: {
    eyebrow: "Onboarding",
    title: "A first-run flow designed to feel like premium iOS software.",
    description:
      "The opening experience introduces the core value quickly, uses motion for depth, and invites the user into the product without feeling like a checklist."
  },
  home: {
    eyebrow: "Dashboard",
    title: "The home screen centers momentum, not admin.",
    description:
      "Daily streaks, quick actions, a progress ring, and recent practice history make the product feel like a habit-forming coach instead of a one-off utility."
  },
  scenarios: {
    eyebrow: "Modes",
    title: "Every practice mode is framed like its own product surface.",
    description:
      "Scenarios are rich enough to feel specific, but still compact enough to scan in seconds. Each card previews the tone, context, and difficulty."
  },
  setup: {
    eyebrow: "Session Setup",
    title: "The setup flow makes personalization feel instant.",
    description:
      "Users can lock in mode, persona, difficulty, and goal with chips and segmented controls that mimic a polished Figma prototype."
  },
  live: {
    eyebrow: "Live Session",
    title: "This is the core product: AI conversation rehearsal with visible momentum.",
    description:
      "An animated persona, hint surface, rich chat bubbles, and response progression make the practice loop feel alive, not like fake placeholder content."
  },
  feedback: {
    eyebrow: "Results",
    title: "Feedback reads like a premium analytics stack, not a report dump.",
    description:
      "Scores animate in, strengths and improvements are easy to scan, and a rewritten response turns abstract feedback into something instantly usable."
  },
  analytics: {
    eyebrow: "Progress",
    title: "Progress tracking is calm, visual, and investor-demo ready.",
    description:
      "The analytics screen uses elegant charts, concise metric cards, and clear trend language to reinforce long-term value."
  },
  profile: {
    eyebrow: "Profile",
    title: "Settings keep the app feeling personal and high-touch.",
    description:
      "Goals, preferred modes, toggles, and subscription status all live inside the same premium visual language without turning into a cluttered settings dump."
  }
};

export const featureHighlights = [
  {
    mode: "interview",
    title: "Interviews",
    description: "Rehearse behavioral stories, follow-up pressure, and concise answers for real hiring conversations."
  },
  {
    mode: "networking",
    title: "Networking",
    description: "Practice recruiter intros, career fair chats, coffee conversations, and cleaner follow-up asks."
  },
  {
    mode: "dating",
    title: "Dating",
    description: "Build confidence for first messages, first dates, and playful back-and-forth without sounding scripted."
  },
  {
    mode: "presentation",
    title: "Presentations",
    description: "Sharpen your opening, pacing, and executive presence for investor rooms, classrooms, and team updates."
  }
] as const;

export const howItWorks = [
  {
    step: "01",
    title: "Choose a scenario",
    body: "Pick the exact conversation you want to rehearse, from a behavioral interview to a first date."
  },
  {
    step: "02",
    title: "Practice with an AI persona",
    body: "Talk through the moment with a responsive persona tuned for the pressure, tone, and context."
  },
  {
    step: "03",
    title: "Get instant feedback",
    body: "See how you landed on confidence, clarity, warmth, pacing, and question quality right after the session."
  },
  {
    step: "04",
    title: "Improve over time",
    body: "Track streaks, weekly reps, and skill trends so every practice loop compounds."
  }
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "For people testing the habit.",
    cta: "Start Free",
    features: ["2 practice modes", "3 sessions per week", "Basic feedback", "Streak tracking"]
  },
  {
    name: "Pro",
    price: "$29",
    description: "For serious interview prep and daily reps.",
    featured: true,
    cta: "Choose Pro",
    features: ["Unlimited sessions", "All 4 practice modes", "Advanced feedback", "Saved personas and goals"]
  },
  {
    name: "Teams",
    price: "$79",
    description: "For coaching cohorts, clubs, and recruiting teams.",
    cta: "Talk to Sales",
    features: ["Shared templates", "Team analytics", "Coach dashboards", "Priority onboarding"]
  }
];

export const trustBadges = ["Used for interviews, networking, dating, and presentations", "AI persona feedback in under 60 seconds", "Designed like a polished product demo, not a concept deck"];
