"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  defaultGender: "boy" | "girl";
  onClose: () => void;
  onSubmit: (payload: { name: string; gender: string; prayer: string }) => void;
};

export default function VoteModal({ open, defaultGender, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState(defaultGender);
  const [prayer, setPrayer] = useState("");
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      // defer state resets to avoid synchronous setState-in-effect lint
      const t = setTimeout(() => {
        setName("");
        setPrayer("");
        setGender(defaultGender);
        dialogRef.current?.querySelector<HTMLInputElement>('input[name="yourName"]')?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [open, defaultGender]);

  if (!open) return null;

  function handleOverlay(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, gender, prayer });
    console.log({ name, gender, prayer });
    onClose();
  }

  return (
    <div className="vote-modal-overlay" onClick={handleOverlay}>
      <div className="vote-modal" role="dialog" aria-modal="true" ref={dialogRef}>
        <button className="vote-modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <h3 className="vote-modal-title">Peek-a-boo! Guess who I am? 🍼</h3>
        <br />
        <h2> can't wait to meet you! Will you guess if I'm a little prince or a radiant princess?</h2>
        <br />
        <form className="vote-modal-form" onSubmit={handleSubmit}>
          <label className="vote-label">
            Your Name
            <input
              name="yourName"
              className="vote-input"
              placeholder="Brother or Sister..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <div className="vote-label">Guess my gender</div>
          <div className="vote-radio-group">
            <label className="vote-radio">
              <input
                type="radio"
                name="gender"
                value="boy"
                checked={gender === "boy"}
                onChange={() => setGender("boy")}
              />
              Prince of the king
            </label>
            <label className="vote-radio">
              <input
                type="radio"
                name="gender"
                value="girl"
                checked={gender === "girl"}
                onChange={() => setGender("girl")}
              />
              Daughter of the King
            </label>
          </div>

          <label className="vote-label">
            Want to leave a sweet note for me? 🧸
            <textarea
              className="vote-textarea"
              placeholder="Speak your blessings..."
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
            />
          </label>

          <div className="vote-modal-actions">
            <button type="submit" className="vote-modal-submit">
              Submit Your Vote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
