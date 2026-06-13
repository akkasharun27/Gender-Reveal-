"use client";
import React, { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type RevealState = {
  dadRevealed: boolean;
  momRevealed: boolean;
};

type CountdownProps = {
  targetIso: string;
  revealState?: RevealState;
  signedIn?: boolean;
  onReveal?: (who: 'dad' | 'mom') => Promise<void>;
};

export default function Countdown({
  targetIso,
  revealState = { dadRevealed: false, momRevealed: false },
  signedIn = true,
  onReveal,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState<'dad' | 'mom' | null>(null);

  useEffect(() => {
    const target = new Date(targetIso);

    function update() {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setDone(true);
        return;
      }

      setDone(false);
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

  useEffect(() => {
    if (done && onReveal) {
      // no-op callback path, but keep effect for future extension if needed
    }
  }, [done, onReveal]);

  const handleReveal = async (who: 'dad' | 'mom') => {
    const already = who === 'dad' ? revealState.dadRevealed : revealState.momRevealed;
    if (!onReveal || loading || already || !signedIn) return;
    setLoading(who);
    try {
      await onReveal(who);
    } finally {
      setLoading(null);
    }
  };

  if (done && revealState.dadRevealed && revealState.momRevealed) {
    return (
      <div className="countdown-final-overlay">
        <div className="countdown-final-content">
          <div className="countdown-final-text">IT&apos;S A GIRL</div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="countdown-reveal">
        <div className="countdown-reveal-buttons">
          <button
            type="button"
            className={`countdown-reveal-button ${revealState.dadRevealed ? 'revealed' : ''}`}
            onClick={() => handleReveal('dad')}
            disabled={revealState.dadRevealed || loading === 'dad' || !signedIn}
          >
            {revealState.dadRevealed ? 'Dad Revealed' : 'Dad Happy To Reveal'}
          </button>
          <button
            type="button"
            className={`countdown-reveal-button ${revealState.momRevealed ? 'revealed' : ''}`}
            onClick={() => handleReveal('mom')}
            disabled={revealState.momRevealed || loading === 'mom' || !signedIn}
          >
            {revealState.momRevealed ? 'Mom Revealed' : 'Mom Happy To Reveal'}
          </button>
        </div>
        {!signedIn ? (
          <div className="countdown-reveal-notice">
            Sign in to unlock the reveal buttons.
          </div>
        ) : null}
      </div>
    );
  }

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
