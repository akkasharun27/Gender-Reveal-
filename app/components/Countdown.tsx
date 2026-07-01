"use client";
import React, { useEffect, useState, useRef } from "react";
import { pickRevealMedia } from "../constants/reveal";

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
  userRole?: 'dad' | 'mom' | 'guest';
  revealGender?: 'boy' | 'girl';
  onReveal?: (who: 'dad' | 'mom') => Promise<void>;
};

export default function Countdown({
  targetIso,
  revealState = { dadRevealed: false, momRevealed: false },
  signedIn = true,
  userRole = 'guest',
  revealGender,
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
  const role = userRole ?? 'guest';

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const playFinalVideo = async () => {
    // Show the video element first (no preview before user clicks)
    setIsPlaying(true);

    requestAnimationFrame(async () => {
      const overlay = overlayRef.current;
      const v = videoRef.current;
      if (!v) return;

      const tryPlay = async (retry = 0) => {
        try {
          await v.play();
        } catch (err) {
          if (retry < 1) {
            await new Promise((resolve) => window.setTimeout(resolve, 120));
            await tryPlay(1);
          }
        }
      };

      try {
        await tryPlay();
      } catch (err) {
        // ignore playback errors; the UI still shows the video
      }

      try {
        if (overlay && typeof overlay.requestFullscreen === 'function') {
          // request fullscreen on the overlay so we can control layout
          // @ts-ignore
          await overlay.requestFullscreen();
          try {
            // @ts-ignore
            if (screen && screen.orientation && typeof screen.orientation.lock === 'function') {
              // attempt to lock to portrait; browsers may deny this
              // @ts-ignore
              await screen.orientation.lock('portrait');
            }
          } catch (e) {
            // ignore orientation lock failures
          }
        } else if (typeof v.requestFullscreen === 'function') {
          // fallback: request fullscreen on the video
          // @ts-ignore
          await v.requestFullscreen();
        } else if (typeof (v as any).webkitEnterFullscreen === 'function') {
          try { (v as any).webkitEnterFullscreen(); } catch {}
        }
      } catch (e) {
        // ignore fullscreen errors
      }
    });
  };

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
    const roleMismatch = (who === 'dad' && role !== 'dad') || (who === 'mom' && role !== 'mom');
    if (!onReveal || loading || already || !signedIn || roleMismatch) return;
    setLoading(who);
    try {
      await onReveal(who);
    } finally {
      setLoading(null);
    }
  };

  if (done && revealState.dadRevealed && revealState.momRevealed) {
    return (
      <div
        ref={overlayRef}
        className="countdown-final-overlay"
        role="button"
        tabIndex={0}
        onClick={playFinalVideo}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') playFinalVideo(); }}
        aria-label="Play reveal video"
      >
          {isPlaying ? (
                <video
                  ref={videoRef}
                  src={pickRevealMedia(revealGender ?? 'girl')}
                  className="countdown-final-video"
                  preload="auto"
                  playsInline
                  autoPlay
                  controls
                  muted={false}
                  style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 'auto', height: '100%', objectFit: 'contain' }}
                />
          ) : null}
        <div className="countdown-final-content">
          <button
            className="countdown-play-button"
            onClick={(e) => { e.stopPropagation(); playFinalVideo(); }}
            aria-label="Play reveal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
            </svg>
          </button>
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
            disabled={revealState.dadRevealed || loading === 'dad' || !signedIn || role !== 'dad'}
          >
            {revealState.dadRevealed
              ? 'Dad Revealed'
              : signedIn && role !== 'dad'
              ? 'Only Dad Can Reveal'
              : 'Dad Happy To Reveal'}
          </button>
          <button
            type="button"
            className={`countdown-reveal-button ${revealState.momRevealed ? 'revealed' : ''}`}
            onClick={() => handleReveal('mom')}
            disabled={revealState.momRevealed || loading === 'mom' || !signedIn || role !== 'mom'}
          >
            {revealState.momRevealed
              ? 'Mom Revealed'
              : signedIn && role !== 'mom'
              ? 'Only Mom Can Reveal'
              : 'Mom Happy To Reveal'}
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
