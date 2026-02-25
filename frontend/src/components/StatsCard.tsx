"use client";

import { useEffect, useState, useRef } from "react";

interface StatsCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  delay?: number;
}

export function StatsCard({ label, value, subtext, icon, delay = 0 }: StatsCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState("0");
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  // Animate number counting for numeric values
  useEffect(() => {
    if (!isVisible) return;

    // Check if value is numeric (handles $ prefix and suffixes like M, K)
    const numericMatch = value.match(/^\$?([\d,]+\.?\d*)([MK]?)$/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const prefix = value.startsWith("$") ? "$" : "";
    const suffix = numericMatch[2] || "";
    const targetNum = parseFloat(numericMatch[1].replace(/,/g, ""));
    
    if (isNaN(targetNum)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = targetNum / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, targetNum);
      
      // Format number
      let formatted: string;
      if (targetNum >= 1000) {
        formatted = Math.round(current).toLocaleString();
      } else {
        formatted = current.toFixed(2);
      }
      
      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      ref={cardRef}
      className={`
        glass rounded-xl p-5 relative overflow-hidden group
        hover-lift cursor-default
        transition-all duration-500
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-xl border border-white/5 group-hover:border-white/15 transition-colors duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
            {icon}
          </div>
          <span className="text-sm text-text-muted group-hover:text-text-secondary transition-colors duration-300">
            {label}
          </span>
        </div>
        <p className="font-display text-2xl font-bold text-text-primary group-hover:gradient-text transition-all duration-300">
          {displayValue}
        </p>
        {subtext && (
          <p className="text-xs text-text-muted mt-1 group-hover:text-text-secondary/70 transition-colors duration-300">
            {subtext}
          </p>
        )}
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
