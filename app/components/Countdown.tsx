"use client";
import React, { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function Countdown({ targetIso }: { targetIso: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetIso);

    function update() {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return (
    <div className="mt-12 flex items-center justify-center gap-12 text-gold">
      <div className="text-center">
        <div className="text-4xl font-medium">{timeLeft.days}</div>
        <div className="text-sm text-gray-500">DAYS</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-medium">{String(timeLeft.hours).padStart(2, "0")}</div>
        <div className="text-sm text-gray-500">HOURS</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-medium">{String(timeLeft.minutes).padStart(2, "0")}</div>
        <div className="text-sm text-gray-500">MINS</div>
      </div>
      <div className="text-center hidden md:block">
        <div className="text-4xl font-medium">{String(timeLeft.seconds).padStart(2, "0")}</div>
        <div className="text-sm text-gray-500">SECS</div>
      </div>
    </div>
  );
}
