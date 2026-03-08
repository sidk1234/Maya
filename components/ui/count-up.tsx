"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

type CountUpProps = {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
};

export function CountUp({ value, suffix = "", decimals = 0, className }: CountUpProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(current) {
        setDisplay(Number(current.toFixed(decimals)));
      }
    });

    return () => controls.stop();
  }, [decimals, value]);

  return (
    <span className={className}>
      {display}
      {suffix}
    </span>
  );
}
