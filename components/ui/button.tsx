import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function buttonStyles(variant: ButtonProps["variant"] = "primary") {
  if (variant === "secondary") {
    return "inline-flex items-center justify-center rounded-full border border-white/60 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white";
  }

  if (variant === "ghost") {
    return "inline-flex items-center justify-center rounded-full border border-slate-300/70 bg-transparent px-5 py-3 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-950";
  }

  return "inline-flex items-center justify-center rounded-full border border-slate-900/10 bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800";
}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles(variant), className)} {...props} />;
}
