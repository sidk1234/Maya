import { ConversationCoachDemo } from "@/components/phone/conversation-coach-demo";
import { AppScreen, PracticeMode } from "@/lib/types";

const validScreens: AppScreen[] = [
  "onboarding",
  "home",
  "scenarios",
  "setup",
  "live",
  "feedback",
  "analytics",
  "profile"
];

const validModes: PracticeMode[] = ["interview", "networking", "dating", "presentation"];

function getRenderMode(value: string | undefined): "device" | "screen" {
  if (value === "device") {
    return "device";
  }

  return "screen";
}

function getScreen(value: string | undefined): AppScreen {
  if (value && validScreens.includes(value as AppScreen)) {
    return value as AppScreen;
  }

  return "onboarding";
}

function getMode(value: string | undefined): PracticeMode {
  if (value && validModes.includes(value as PracticeMode)) {
    return value as PracticeMode;
  }

  return "interview";
}

export default async function FigmaIphonePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const screen = getScreen(typeof params.screen === "string" ? params.screen : undefined);
  const mode = getMode(typeof params.mode === "string" ? params.mode : undefined);
  const renderMode = getRenderMode(typeof params.frame === "string" ? params.frame : undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.24),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,248,252,0.88))] px-6 py-8">
      <div
        id="single-iphone-app"
        className={renderMode === "screen" ? "w-full max-w-[402px]" : "w-full max-w-[420px]"}
      >
        <ConversationCoachDemo initialMode={mode} initialScreen={screen} renderMode={renderMode} />
      </div>
    </main>
  );
}
