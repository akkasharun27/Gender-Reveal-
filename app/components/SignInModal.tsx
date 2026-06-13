"use client";
import React, { useState, useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; password: string }) => void;
  error?: string;
};

export default function SignInModal({ open, onClose, onSubmit, error }: Props) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        setName("");
        setPassword("");
        dialogRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  function handleOverlay(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, password });
  }

  return (
    <div className="signin-modal-overlay" onClick={handleOverlay}>
      <div className="signin-modal" ref={dialogRef} role="dialog" aria-modal="true">
        <button className="signin-modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <h3 className="signin-modal-title">Sign In</h3>

        <form className="signin-modal-form" onSubmit={handleSubmit}>
          <label className="signin-label">
            Name
            <input
              name="name"
              className="signin-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </label>

          <label className="signin-label">
            Password
            <input
              type="password"
              name="password"
              className="signin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </label>

          {error ? <div className="signin-error">{error}</div> : null}

          <div className="signin-modal-actions">
            <button type="submit" className="signin-modal-submit">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
