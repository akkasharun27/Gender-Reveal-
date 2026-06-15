"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import "../home.css";

type SiteHeaderProps = {
  currentPage: "home" | "story";
  signedIn?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
};

export default function SiteHeader({ currentPage, signedIn, onSignIn, onSignOut }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  const voteHref = currentPage === "home" ? "/#vote" : "/#vote";

  return (
    <header ref={headerRef} className="home-header">
      <div className="home-header-content">
        <div className="home-header-title">𝒱𝒾𝒿𝒶𝓎 ♥ 𝒞𝓎𝓃𝓉𝒽𝒾𝒶</div>

        <button
          className="home-mobile-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((state) => !state)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <nav className={`home-header-nav ${menuOpen ? "open" : ""}`}>
          <Link className={`home-nav-link ${currentPage === "home" ? "active" : ""}`} href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link className={`home-nav-link ${currentPage === "story" ? "active" : ""}`} href="/our-story" onClick={() => setMenuOpen(false)}>
            Our Story
          </Link>
          <Link className="home-nav-link" href={voteHref} onClick={() => setMenuOpen(false)}>
            Vote Now
          </Link>
          {signedIn ? (
            <button className="home-signin-btn" onClick={() => { setMenuOpen(false); onSignOut?.(); }}>
              Sign Out
            </button>
          ) : (
            <button className="home-signin-btn" onClick={() => { setMenuOpen(false); onSignIn?.(); }}>
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
