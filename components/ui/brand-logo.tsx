import Image from "next/image";

import mayaDarkMark from "@/assets/Maya dark logo.png";
import mayaDarkWordmark from "@/assets/Maya dark Word + Text.png";
import mayaLightMark from "@/assets/Maya light Logo.png";
import mayaLightWordmark from "@/assets/Maya Word + Text.png";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  kind?: "mark" | "wordmark";
  tone?: "light" | "dark";
  className?: string;
  alt?: string;
  priority?: boolean;
};

const brandSources = {
  mark: {
    light: mayaLightMark,
    dark: mayaDarkMark
  },
  wordmark: {
    light: mayaLightWordmark,
    dark: mayaDarkWordmark
  }
};

export function BrandLogo({
  kind = "wordmark",
  tone = "light",
  className,
  alt = "Maya",
  priority = false
}: BrandLogoProps) {
  const src = brandSources[kind][tone];

  return (
    <span
      className={cn(
        "relative block overflow-hidden",
        kind === "mark" ? "h-10 w-10 rounded-[12px]" : "h-10 w-32 rounded-[14px]",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={kind === "mark" ? "40px" : "128px"}
        className="object-cover object-center"
      />
    </span>
  );
}
