"use client";

import { cn } from "@/lib/utils";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

// ── Animated Number ──────────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => {
    const num =
      decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
    return `${prefix}${num}${suffix}`;
  });

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: shouldReduceMotion ? 0 : 1,
      ease: [0.215, 0.61, 0.355, 1],
    });
    return controls.stop;
  }, [value, mv, shouldReduceMotion]);

  return <motion.span>{display}</motion.span>;
}

// ── Stat Card ────────────────────────────────────────────────────────────────

export interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  secondaryValue?: string;
  trend?: { value: number; positive: boolean };
}

export function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  secondaryValue,
  trend,
}: StatCardProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[16px] bg-white p-4 shadow-card">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-outfit text-[22px] font-extrabold leading-tight text-black">
            <AnimatedNumber
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
            />
          </span>
          {secondaryValue && (
            <span className="font-open-sans text-xs text-gray">
              {secondaryValue}
            </span>
          )}
        </div>
        <span className="font-open-sans text-xs text-dark-gray">{label}</span>
      </div>
    </div>
  );
}
