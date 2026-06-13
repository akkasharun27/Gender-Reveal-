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
    <div className="countdown-grid">
      <div className="countdown-card">
        <div className="countdown-value">{timeLeft.days}</div>
        <div className="countdown-label">DAYS</div>
      </div>
      <div className="countdown-card">
        <div className="countdown-value">{String(timeLeft.hours).padStart(2, "0")}</div>
        <div className="countdown-label">HOURS</div>
      </div>
      <div className="countdown-card">
        <div className="countdown-value">{String(timeLeft.minutes).padStart(2, "0")}</div>
        <div className="countdown-label">MINS</div>
      </div>
      <div className="countdown-card countdown-card-seconds">
        <div className="countdown-value">{String(timeLeft.seconds).padStart(2, "0")}</div>
        <div className="countdown-label">SECS</div>
      </div>
    </div>
  );
}
