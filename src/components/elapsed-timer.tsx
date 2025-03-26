"use client";

import { useEffect, useState } from "react";

interface ElapsedTimerProps {
  isRunning: boolean;
  onReset?: () => void;
}

export default function ElapsedTimer({
  isRunning,
  onReset,
}: ElapsedTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      if (startTime === null) {
        setStartTime(Date.now());
      }

      intervalId = setInterval(() => {
        if (startTime !== null) {
          const elapsed = (Date.now() - startTime) / 1000;
          setElapsedTime(elapsed);
        }
      }, 100); // Update every 100ms for smoother display
    } else if (!isRunning && startTime !== null) {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, startTime]);

  useEffect(() => {
    if (!isRunning && onReset) {
      setElapsedTime(0);
      setStartTime(null);
    }
  }, [isRunning, onReset]);

  return (
    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-sm">
      <p className="text-sm text-gray-500 mb-1">Time:</p>
      <h2 className="text-2xl font-bold text-red-500">
        {elapsedTime.toFixed(1)}s
      </h2>
    </div>
  );
}
