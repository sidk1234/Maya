import {
  AppScreen,
  GeneratedPersonaProfile,
  OnboardingSlide,
  PersonaAction,
  PersonaScope,
  PersonaSourceType,
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

export const personaScopeOptions: Array<{
  id: PersonaScope;
  label: string;
  description: string;
  eyebrow: string;
}> = [
  {
    id: "privatePerson",
    label: "Private person",
    description: "Use your own chats, screenshots, and exports to model someone you actually talk to.",
    eyebrow: "Private inputs only"
  },
  {
    id: "publicFigure",
    label: "Public figure",
    description: "Blend your notes with public interviews, posts, and public-facing writing for sharper prep.",
    eyebrow: "User data + public web"
  },
  {
    id: "audience",
    label: "Audience",
    description: "Create an interviewer, investor, professor, or exec room and rehearse against likely reactions.",
    eyebrow: "Presentation prep"
  }
];

export const personaActionOptions: Array<{
  id: PersonaAction;
  label: string;
  description: string;
}> = [
  {
    id: "replyCoach",
    label: "Reply Coach",
    description: "Get three tailored drafts and understand why each one fits the person."
  },
  {
    id: "practiceConversation",
    label: "Practice Conversation",
    description: "Roleplay the moment live with a persona tuned from your source material."
  }
];

export const personaSourceCatalog: Array<{
  type: PersonaSourceType;
  label: string;
  description: string;
  requiresPublicWeb?: boolean;
}> = [
  {
    type: "pastedText",
    label: "Pasted chats",
    description: "Paste texts, emails, DMs, or notes to capture rhythm, pacing, and recurring phrases."
  },
  {
    type: "screenshot",
    label: "Screenshots",
    description: "Upload message screenshots, story captures, or presentation snippets to preserve context."
  },
  {
    type: "chatExport",
    label: "Chat exports",
    description: "Drop in a longer export when you want the persona to reflect more than one interaction."
  },
  {
    type: "publicUrl",
    label: "Web search",
    description: "Search public interviews, posts, company pages, or talk videos for public figures and audiences.",
    requiresPublicWeb: true
  }
];

export const generatedPersonaProfiles: Record<PersonaScope, GeneratedPersonaProfile> = {
  privatePerson: {
    id: "alex-rivera",
    name: "Alex Rivera",
    role: "Close friend with low-pressure, playful energy",
    relationshipLabel: "Private person",
    scope: "privatePerson",
    summary:
      "Alex answers in short bursts, likes witty callbacks, and responds best when the message feels specific instead of over-explained.",
    styleTraits: ["Brief texter", "Playful", "Specific over generic"],
    commonTopics: ["Weekend plans", "Creative hobbies", "Inside jokes"],
    responseTendencies: [
      "Opens with a reaction before adding detail",
      "Rewards confident but low-pressure messages",
      "Loses interest when the message feels too polished"
    ],
    cautions: ["Do not stack three questions at once", "Avoid sounding like you wrote it with a script open"],
    sources: [
      {
        type: "pastedText",
        label: "Texts from the last 3 weeks",
        summary: "Recent back-and-forth about pottery, coffee, and flaky plans.",
        status: "Parsed",
        detail: "The model found a pattern of short replies, fast reactions, and playful teasing."
      },
      {
        type: "screenshot",
        label: "Instagram story screenshot",
        summary: "Story captioned “Accidentally obsessed now” from a pottery class.",
        status: "Interpreted",
        detail: "The model linked the image context to an easy opener instead of a generic compliment."
      },
      {
        type: "chatExport",
        label: "Exported DM archive",
        summary: "Longer thread with pacing, emoji restraint, and recurring jokes.",
        status: "Merged",
        detail: "Long-form history tightened confidence around tone and timing."
      }
    ],
    sourceConfidence: [
      { type: "pastedText", label: "Pasted chats", confidence: "High", note: "Strong signal on tone, pacing, and question style." },
      { type: "screenshot", label: "Screenshots", confidence: "Medium", note: "Useful for moment-specific context and references." },
      { type: "chatExport", label: "Chat exports", confidence: "High", note: "Best source for consistency over time." }
    ],
    watchOut: "Alex tends to pull back when the reply feels too eager or tries to force a plan immediately.",
    replyContextTitle: "How should I reply to this story?",
    replyContextBody:
      "Alex posted a pottery story with the caption “Accidentally obsessed now.” You want to reply in a way that feels natural, playful, and not too thirsty.",
    replyContextLabel: "Instagram story screenshot",
    replySuggestions: [
      {
        toneLabel: "Playful",
        bestFor: "Best for chemistry",
        draft: "This is exactly how pottery gets you. Give it two weeks and you’ll be judging mugs like a sommelier.",
        rationale: "Keeps the tone light, references the specific story, and gives Alex something easy to riff on.",
        fitExplanation: "The teasing style matches the dry humor pattern in your chats without sounding try-hard."
      },
      {
        toneLabel: "Warm",
        bestFor: "Best for low-risk",
        draft: "Okay this looks very you. If you start making unreasonably good coffee cups, I’m calling dibs.",
        rationale: "Adds a small compliment without overdoing it and creates a soft opening for continued banter.",
        fitExplanation: "Alex responds well when you anchor the message in something specific and leave room for a quick comeback."
      },
      {
        toneLabel: "Direct",
        bestFor: "Best for moving it forward",
        draft: "Honestly that looks fun. If you go again sometime, I’d be very open to being your extremely average assistant.",
        rationale: "Turns the story into an invitation without sounding formal or overly planned.",
        fitExplanation: "This works because Alex’s past replies reward confidence when the ask still feels casual."
      }
    ],
    simulation: {
      context: "You are trying to reconnect after a few lighter exchanges and see if Alex wants to keep the momentum going.",
      opening: "Hey, I saw your message. What made you think of me right after the pottery class?",
      transcript: [
        {
          user: "It felt extremely on brand for you, and I figured I should acknowledge the start of your ceramic era.",
          ai: "That is fair. Ceramic era sounds dramatic enough that I might keep it. What else would be on brand for me then?",
          reaction: "Amused",
          hint: "Stay playful, but give one concrete observation so it feels personal."
        },
        {
          user: "Definitely pretending you are casual about it while secretly researching glaze colors at midnight.",
          ai: "Rude. Accurate, but rude. I respect it though. What about you, what random hobby would catch you way too fast?",
          reaction: "Leaning In",
          hint: "Answer directly, then bounce the energy back with a detail that opens the door to plans."
        }
      ]
    },
    feedback: {
      overallScore: 90,
      fillerWords: 2,
      pacing: "111 wpm",
      strengths: ["Specific callback to the source", "Playful tone without overpursuing", "Good read of their texting rhythm"],
      improvements: ["Ask for a plan one beat later", "Keep the second message slightly shorter", "Avoid stacking multiple jokes in one reply"],
      rewrittenResponse:
        "This looks extremely on brand for you. Give it a week and you will absolutely have pottery opinions. If you go again, I would happily support your ceramic era from a safe distance.",
      metrics: [
        { label: "Tone match", value: 93, tone: "rose" },
        { label: "Clarity", value: 88, tone: "emerald" },
        { label: "Warmth", value: 92, tone: "violet" },
        { label: "Timing", value: 87, tone: "amber" }
      ]
    }
  },
  publicFigure: {
    id: "elena-ross",
    name: "Elena Ross",
    role: "Seed investor who prefers concise, evidence-heavy answers",
    relationshipLabel: "Public figure",
    scope: "publicFigure",
    summary:
      "Elena talks in sharp, compressed questions, dislikes bloated setup, and rewards clear conviction backed by one real proof point.",
    styleTraits: ["Compressed", "Skeptical", "Evidence-first"],
    commonTopics: ["Traction", "Urgency", "Founder insight"],
    responseTendencies: [
      "Pushes for the why-now quickly",
      "Prefers one metric over three soft claims",
      "Tests whether the speaker can hold tension under pressure"
    ],
    cautions: ["Do not over-contextualize before answering", "Avoid vague growth language with no proof"],
    sources: [
      {
        type: "pastedText",
        label: "Meeting notes",
        summary: "Notes from prior investor Q&A and internal prep docs.",
        status: "Mapped",
        detail: "Your notes anchored the investor’s interests to traction and founder-market fit."
      },
      {
        type: "publicUrl",
        label: "Podcast and essays",
        summary: "Public interviews, essays, and portfolio memo excerpts.",
        status: "Researched",
        detail: "The model pulled recurring phrases around urgency, distribution, and signal density."
      },
      {
        type: "chatExport",
        label: "Email thread export",
        summary: "Short follow-up emails after the intro meeting.",
        status: "Blended",
        detail: "Email cadence reinforced that Elena rewards short, direct responses."
      }
    ],
    sourceConfidence: [
      { type: "pastedText", label: "Meeting notes", confidence: "Medium", note: "Useful for topic fit, less precise on exact voice." },
      { type: "publicUrl", label: "Web search", confidence: "High", note: "Strong signal on question style and public communication habits." },
      { type: "chatExport", label: "Email exports", confidence: "High", note: "Best signal on how she actually responds to you directly." }
    ],
    watchOut: "If you sound polished but ungrounded, Elena will likely press harder instead of helping you find the answer.",
    replyContextTitle: "How do I answer this investor follow-up?",
    replyContextBody:
      "Elena replied: “Happy to look. In one sentence, what changed in the last 6 months that makes this urgent now?” You need a crisp answer that earns the next meeting.",
    replyContextLabel: "Investor follow-up email",
    replySuggestions: [
      {
        toneLabel: "Crisp",
        bestFor: "Best for strongest signal",
        draft: "AI-native hiring now creates more practice demand than coaching teams can meet manually, and our usage data shows candidates come back multiple times per week when feedback is instant.",
        rationale: "Leads with the market change, then lands a usage proof point without drifting into pitch mode.",
        fitExplanation: "Elena’s public and direct communications consistently reward compressed answers with one credible metric."
      },
      {
        toneLabel: "Founder-conviction",
        bestFor: "Best for urgency",
        draft: "Candidates are already using AI to prepare, but almost none of them have a product that simulates the actual conversation pressure, and our retention is proving that gap is real.",
        rationale: "Keeps the answer thesis-driven while still grounding it in observed behavior.",
        fitExplanation: "This fits Elena’s style because it frames urgency as an emerging wedge, not just a generic market trend."
      },
      {
        toneLabel: "Measured",
        bestFor: "Best for low-risk follow-up",
        draft: "The last six months made two things clear: candidates want instant rehearsal instead of delayed coaching, and our repeat usage suggests that need is persistent rather than novelty-driven.",
        rationale: "Safer tone, still concise, and avoids overclaiming before the next meeting.",
        fitExplanation: "This works when you want to sound controlled and credible while matching her preference for clean logic."
      }
    ],
    simulation: {
      context: "You are rehearsing a five-minute investor conversation with someone who values signal density and direct answers.",
      opening: "You have one minute. Why does this need to exist now instead of two years from now?",
      transcript: [
        {
          user: "Because candidates already rehearse with AI, but most tools still optimize for generic prep instead of the actual pressure of the room.",
          ai: "That is directionally fine, but it is still broad. What proof do you have that this pain is strong enough to create repeat behavior?",
          reaction: "Focused",
          hint: "Cut the framing by one sentence and answer with one observed metric or repeated behavior."
        },
        {
          user: "Our best users come back multiple times per week before a single high-stakes event, which tells us the value is in iterative rehearsal, not one-off novelty.",
          ai: "Better. Now tell me why that becomes venture-scale rather than a nice coaching tool with good retention.",
          reaction: "Testing",
          hint: "Bridge from user behavior to market expansion without sounding inflated."
        }
      ]
    },
    feedback: {
      overallScore: 93,
      fillerWords: 1,
      pacing: "122 wpm",
      strengths: ["Strong compression", "Good investor-language match", "Clear why-now framing"],
      improvements: ["Add one sharper traction number", "Name the wedge before the expansion path", "Pause after the first sentence"],
      rewrittenResponse:
        "The urgency comes from a behavior shift that already happened: candidates now expect instant AI prep, but almost nothing simulates the real conversation pressure. Our repeat usage shows that once people feel the difference, they come back multiple times before a single interview or pitch.",
      metrics: [
        { label: "Signal density", value: 95, tone: "teal" },
        { label: "Clarity", value: 92, tone: "emerald" },
        { label: "Command", value: 94, tone: "sky" },
        { label: "Warmth", value: 76, tone: "amber" }
      ]
    }
  },
  audience: {
    id: "boardroom-audience",
    name: "Boardroom Audience",
    role: "Executive audience looking for clarity, proof, and downside awareness",
    relationshipLabel: "Audience persona",
    scope: "audience",
    summary:
      "This audience wants crisp narrative structure, explicit tradeoffs, and a clear answer to what changes if they say yes.",
    styleTraits: ["Outcome-focused", "Risk-aware", "Structured"],
    commonTopics: ["Business impact", "Execution risk", "Decision clarity"],
    responseTendencies: [
      "Interrupts when a point takes too long to land",
      "Pushes for tradeoffs, not only upside",
      "Rewards speakers who answer the question before zooming out"
    ],
    cautions: ["Do not bury the recommendation", "Avoid sounding vague about downside or sequencing"],
    sources: [
      {
        type: "pastedText",
        label: "Presentation outline",
        summary: "Draft deck narrative, opening hook, and planned recommendation.",
        status: "Mapped",
        detail: "The model aligned the room’s likely pushback to the structure of your current talk."
      },
      {
        type: "screenshot",
        label: "Slide screenshots",
        summary: "Evidence slides, headline choices, and one crowded appendix screen.",
        status: "Reviewed",
        detail: "The screenshots exposed where the audience would likely want tighter messaging."
      },
      {
        type: "publicUrl",
        label: "Company and speaker research",
        summary: "Public interviews, quarterly letter excerpts, and operating principles.",
        status: "Researched",
        detail: "The model learned how this audience frames tradeoffs and asks follow-up questions."
      }
    ],
    sourceConfidence: [
      { type: "pastedText", label: "Presentation outline", confidence: "High", note: "Best signal on what you are trying to say." },
      { type: "screenshot", label: "Slide screenshots", confidence: "Medium", note: "Useful for context and likely confusion points." },
      { type: "publicUrl", label: "Web search", confidence: "High", note: "Strong signal on how the audience talks and evaluates decisions." }
    ],
    watchOut: "This room will punish elegant framing if it never resolves into a concrete recommendation and explicit tradeoff.",
    replyContextTitle: "How should I answer the follow-up after the presentation?",
    replyContextBody:
      "After your pitch, the VP emailed: “Can you send the sharper recommendation and the tradeoff we accept if we choose this path?” You want a reply that sounds board-ready.",
    replyContextLabel: "Presentation follow-up email",
    replySuggestions: [
      {
        toneLabel: "Executive",
        bestFor: "Best for clarity",
        draft: "My recommendation is to launch the guided rehearsal product first because it gives us the fastest path to repeat usage and clearer retention signal. The tradeoff is that we delay broader coaching workflows until we validate that core loop.",
        rationale: "Leads with the recommendation, then names the accepted downside in plain language.",
        fitExplanation: "That structure matches executive audiences that value decision clarity over exploratory framing."
      },
      {
        toneLabel: "Measured",
        bestFor: "Best for low-risk follow-up",
        draft: "I would frame the decision as focus versus breadth: we should prioritize guided rehearsal first because it is the clearest retention wedge, while accepting that adjacent coaching use cases move to a later phase.",
        rationale: "Keeps the tone calm and strategic while still sounding decisive.",
        fitExplanation: "This fits audiences that expect clear tradeoffs but dislike overstatement."
      },
      {
        toneLabel: "Direct",
        bestFor: "Best for conviction",
        draft: "The sharper recommendation is to bet on rehearsal first. It gives us the strongest repeat-behavior signal now, and the tradeoff is deliberately postponing feature breadth until that core behavior is proven.",
        rationale: "Condenses the answer to the essential decision logic with no padding.",
        fitExplanation: "Board-style rooms reward this structure because it answers the actual decision before defending it."
      }
    ],
    simulation: {
      context: "You are rehearsing a presentation Q&A with a room that wants tighter reasoning and concrete tradeoffs.",
      opening: "Before I buy into this, what changes materially for the business if your recommendation works?",
      transcript: [
        {
          user: "If it works, we build a repeat behavior around rehearsal instead of a one-time utility, which improves retention and lowers the cost of proving value.",
          ai: "That is the right shape, but it still sounds abstract. What specific metric or business behavior improves first?",
          reaction: "Skeptical",
          hint: "Name the first observable change the room can track after launch."
        },
        {
          user: "The first thing that should move is repeat session frequency per active user, because that tells us the product is becoming part of prep behavior rather than a one-off experiment.",
          ai: "Better. Now tell me what tradeoff you are accepting by focusing there first.",
          reaction: "Interested",
          hint: "State the tradeoff plainly and make it sound deliberate, not accidental."
        }
      ]
    },
    feedback: {
      overallScore: 91,
      fillerWords: 2,
      pacing: "119 wpm",
      strengths: ["Strong recommendation framing", "Good audience calibration", "Clearer business language"],
      improvements: ["Name one leading metric sooner", "Use shorter sentences in the answer open", "Make the tradeoff sound more intentional"],
      rewrittenResponse:
        "If this works, the product shifts from a one-off prep tool to a repeat rehearsal habit, and the first signal of that is session frequency per active user. The tradeoff is focus: we delay broader coaching workflows so we can prove that one high-retention behavior first.",
      metrics: [
        { label: "Audience fit", value: 94, tone: "teal" },
        { label: "Clarity", value: 90, tone: "emerald" },
        { label: "Conviction", value: 89, tone: "sky" },
        { label: "Tradeoff framing", value: 92, tone: "amber" }
      ]
    }
  }
};

export const customPersonaShowcase = {
  title: "Custom Persona Workspace",
  summary: "Build a persona from chats, screenshots, exports, or public web research and switch between reply coaching and live simulation.",
  stat: "3 draft replies + live persona simulation"
};

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
  personaCreate: {
    eyebrow: "Create Persona",
    title: "Build a persona from your own material or approved public-web research.",
    description:
      "Scope, goal, and source selection all happen in one polished setup surface so the feature feels like a real product, not a lab tool."
  },
  personaReview: {
    eyebrow: "Persona Review",
    title: "The generated profile explains how the AI formed its read on the person or audience.",
    description:
      "Traits, tendencies, source provenance, and red flags make the persona feel inspectable before the user trusts it."
  },
  replyCoach: {
    eyebrow: "Reply Coach",
    title: "Reply suggestions are tuned to the persona, not just the raw message.",
    description:
      "Each draft comes with a tone label, rationale, and why-it-fits note so the user can choose a response instead of blindly copy-pasting one."
  },
  personaSim: {
    eyebrow: "Persona Simulation",
    title: "Custom personas can turn directly into a live rehearsal partner.",
    description:
      "The same premium chat surface now supports founder prep, audience Q&A, and person-specific conversations with realistic pressure."
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
    title: "Choose a mode or persona",
    body: "Start with a preset scenario or build a custom person or audience from your own material."
  },
  {
    step: "02",
    title: "Bring the source material",
    body: "Upload chats, screenshots, exports, and approved public URLs so the persona feels grounded."
  },
  {
    step: "03",
    title: "Coach or simulate",
    body: "Get tailored reply drafts or roleplay the conversation live with a responsive persona."
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
    billingPeriod: "/ month",
    description: "For people testing the habit.",
    cta: "Start Free",
    features: ["2 practice modes", "3 sessions per week", "Basic feedback", "Streak tracking"]
  },
  {
    name: "Pro",
    price: "$3.75",
    billingPeriod: "/ month",
    description: "For serious interview prep and daily reps.",
    featured: true,
    badge: "Most Popular",
    priceBadge: "Save 25%",
    priceNote: "Billed annually at $45/year.\nMonth-to-month is $5/mo.",
    cta: "Choose Pro Annual",
    features: ["Unlimited sessions", "All 4 practice modes", "Advanced feedback", "Saved personas and goals"]
  },
  {
    name: "Teams",
    price: "$79",
    billingPeriod: "/ month",
    description: "For coaching cohorts, clubs, and recruiting teams.",
    cta: "Talk to Sales",
    features: ["Shared templates", "Team analytics", "Coach dashboards", "Priority onboarding"]
  }
];

export const trustBadges = [
  "Bring your own persona from chats, screenshots, and exports",
  "Public-figure and audience research for presentation prep",
  "AI reply drafts tailored to how someone actually communicates"
];
