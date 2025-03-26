"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  isRunning?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function CountdownTimer({
  duration,
  onComplete,
  isRunning = true,
  size = "md",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(isRunning);

  // Calculate percentage for the progress ring
  const percentage = (timeLeft / duration) * 100;
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine size classes
  const sizeClasses = {
    sm: "w-16 h-16 text-xl",
    md: "w-24 h-24 text-3xl",
    lg: "w-32 h-32 text-4xl",
  };

  // Determine color based on time left
  const getColor = () => {
    if (timeLeft <= duration * 0.25) return "text-red-500 stroke-red-500";
    if (timeLeft <= duration * 0.5) return "text-orange-500 stroke-orange-500";
    return "text-green-500 stroke-green-500";
  };

  useEffect(() => {
    setIsActive(isRunning);
  }, [isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 0.1;
          return newTime > 0 ? newTime : 0;
        });
      }, 100);
    } else if (timeLeft === 0 && onComplete) {
      onComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  return (
    <div
      className={`relative ${sizeClasses[size]} flex items-center justify-center`}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="stroke-gray-200 fill-none"
          cx="50"
          cy="50"
          r="45"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          className={`fill-none ${getColor()}`}
          cx="50"
          cy="50"
          r="45"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className={`absolute ${getColor().split(" ")[0]} font-bold`}>
        {timeLeft.toFixed(1)}
      </div>
    </div>
  );
}
