"use client";
import React, { useState, useEffect } from "react";
import Countdown from "./components/Countdown";
import VoteModal from "./components/VoteModal";
import SignInModal from "./components/SignInModal";
import { FiChevronDown, FiHeart, FiArrowRight, FiBook, FiMenu, FiX } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import "./home.css";

type RevealState = {
  dadRevealed: boolean;
  momRevealed: boolean;
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [voteOpen, setVoteOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signedInName, setSignedInName] = useState("");
  const [signInError, setSignInError] = useState("");
  const [voteGender, setVoteGender] = useState<"boy" | "girl">("boy");
  const [totalWishes, setTotalWishes] = useState(1);
  const [revealState, setRevealState] = useState<RevealState>({ dadRevealed: false, momRevealed: false });
  const [revealLoading, setRevealLoading] = useState<'dad' | 'mom' | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/wishes');
        const json = await res.json();
        if (res.ok && typeof json.total === 'number') {
          if (mounted) setTotalWishes(json.total);
        }
      } catch (e) {
        console.error('Failed to fetch total wishes', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth');
        const json = await res.json();
        if (mounted && res.ok && json?.ok) {
          setSignedIn(Boolean(json.signedIn));
          setSignedInName(typeof json.name === 'string' ? json.name : '');
        }
      } catch (e) {
        console.error('Failed to fetch auth status', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/reveal');
        const json = await res.json();
        if (mounted && res.ok && json?.ok) {
          setRevealState({
            dadRevealed: Boolean(json.dadRevealed),
            momRevealed: Boolean(json.momRevealed),
          });
        }
      } catch (e) {
        console.error('Failed to fetch reveal state', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleSignIn = async (payload: { name: string; password: string }) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json?.ok) {
        setSignedIn(true);
        setSignedInName(payload.name);
        setSignInError("");
        setSignInOpen(false);
      } else {
        setSignInError(json?.error || 'Sign-in failed');
      }
    } catch (e) {
      console.error('Sign in error', e);
      setSignInError('Sign-in failed');
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } catch (e) {
      console.error('Sign out error', e);
    } finally {
      setSignedIn(false);
      setSignedInName("");
    }
  };

  const handleReveal = async (who: 'dad' | 'mom') => {
    const already = who === 'dad' ? revealState.dadRevealed : revealState.momRevealed;
    if (revealLoading || already || !signedIn) return;
    setRevealLoading(who);

    try {
      const res = await fetch('/api/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ who }),
      });
      const json = await res.json();

      if (res.ok && json?.ok) {
        setRevealState({
          dadRevealed: Boolean(json.dadRevealed),
          momRevealed: Boolean(json.momRevealed),
        });
      } else {
        if (res.status === 401) {
          setSignedIn(false);
          setSignedInName("");
        }
        console.error('Reveal update failed', json);
      }
    } catch (e) {
      console.error('Reveal request failed', e);
    } finally {
      setRevealLoading(null);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
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
            <a className="home-nav-link active" href="#">
              Home
            </a>
            <a className="home-nav-link" href="#our-journey">
              Our Story
            </a>
            <a className="home-nav-link" href="#vote">
              Vote Now
            </a>
            {signedIn ? (
              <button className="home-signin-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            ) : (
              <button className="home-signin-btn" onClick={() => setSignInOpen(true)}>
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="home-hero" id="hero">
          <div className="home-hero-bg">
            <div className="home-hero-image"></div>
            <div className="home-hero-overlay"></div>
            <div className="home-hero-glow-1"></div>
            <div className="home-hero-glow-2"></div>
          </div>

          <div className="home-hero-content">
            <div className="home-hero-intro">
              <span className="home-hero-label">Heaven Sent</span>
              <h1 className="home-hero-title">A Gift from Above</h1>
              <p className="home-hero-subtitle">
                Blessed and chosen, we wait to see who God has sent to us.
              </p>
            </div>

            <div className="home-hero-countdown">
              <Countdown
                targetIso="2026-06-13T17:16:00"
                revealState={revealState}
                signedIn={signedIn}
                onReveal={handleReveal}
              />
            </div>

            <div className="home-hero-cta">
              <a href="#vote" className="home-hero-btn">Guess the Gift</a>
              <a className="home-hero-link" href="#our-journey">
                <span>Our Journey</span>
                <FiArrowRight />
              </a>
            </div>
          </div>

          <div className="home-hero-scroll">
            <FiChevronDown />
          </div>
        </section>

        <div className="home-divider">
          <div className="divider-diamond">
            <div className="diamond-icon"></div>
          </div>
        </div>

        <section className="home-vote" id="vote">
          <div className="home-vote-grid">
            <div className="home-vote-card">
              <div className="home-vote-card-overlay"></div>
              <div className="home-vote-card-image">
                <img alt="Blue baby accessories" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQl4T85w6skgNiWdES5o-wxCvWv4VTHhM2RV2WYtgjdW523IHoeV6cRdcWoaaTabZ0WshkG_-OSLZcbnC_xb4CSGYZToSkF50KyVDXWbmFhPiSVHEovtMnVxNuWW3j9UDIKnMpMjFx_U5845NZ5_7tFGosBRWAoxFNlmbvYtqxaz_ihXD_0ddGg3e1NeG8r8YiaOGUtZP0ASAXBjFoGRwh3RSCbLzYSaZaGB8SObQdR4OhpZ5ukuHPtFK8nIgMqpjaJH6ZkMp4Dnk" />
              </div>
              <div className="home-vote-card-content boy">
                <h3 className="home-vote-card-title" style={{ color: 'var(--color-tertiary)' }}>A Brave Little Prince</h3>
                <p className="home-vote-card-text">&quot;Be strong and courageous... for the Lord your God will be with you.&quot;</p>
                <button className="home-vote-card-btn" onClick={() => { setVoteGender("boy"); setVoteOpen(true); }}>
                  Vote Boy
                </button>
              </div>
            </div>

            <div className="home-vote-center">
              <div className="home-vote-icon">
                <FiHeart />
              </div>
              <h2 className="home-vote-center-title">Join the Celebration</h2>
              <p className="home-vote-center-text">
                Every child is a heritage from the Lord. Cast your prayerful vote on who you believe our little one will be.
              </p>
              <div className="home-vote-stats">
                <div className="home-vote-stats-label">Total Wishes Cast</div>
                <div className="home-vote-stats-number">{totalWishes}</div>
              </div>
            </div>

            <div className="home-vote-card home-vote-princess">
              <div className="home-vote-card-overlay"></div>
              <div className="home-vote-card-image">
                <img alt="Pink baby floral detail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiRTmRaskF22cq766QTuisVS-3bcU8_4IuV1KSjE42nZjxmMQkw9k9-HLMLWEye53m9b0pe2Aawz-2Xe__F2uu98PK4ZmC_xtNURJAMvua72RUDKeXj1bil3dGbXYmaYXPakHiMPDj19Lvg_dq9sQhLsacGi8UiTrQz2qxlsG8ovzSiQITGEj20kyePaYisEq-vs4aIKJOXd1ItIbCQ_tlccwYPzrwph7iAdfm-yWqsnqooLE6ckNTA8xUU5ZHh53Z56iJzAJsTsg" />
              </div>
              <div className="home-vote-card-content girl">
                <h3 className="home-vote-card-title" style={{ color: '#ad1457' }}>A Radiant Little Princess</h3>
                <p className="home-vote-card-text">&quot;She is clothed in strength and dignity, and she laughs without fear of the future.&quot;</p>
                <button className="home-vote-card-btn" style={{ 
                  backgroundColor: 'rgba(173, 20, 87, 0.1)',
                  color: '#ad1457',
                  borderColor: 'rgba(173, 20, 87, 0.3)'
                }} onClick={() => { setVoteGender("girl"); setVoteOpen(true); }}>
                  Vote Girl
                </button>
              </div>
            </div>
          </div>
        </section>

        <VoteModal
          open={voteOpen}
          defaultGender={voteGender}
          onClose={() => setVoteOpen(false)}
          onSubmit={async (payload) => {
            try {
              const res = await fetch('/api/wishes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
              const json = await res.json();
              if (res.ok && json?.ok) {
                // use server returned total when available
                if (typeof json.total === 'number') setTotalWishes(json.total);
                else setTotalWishes((n) => n + 1);
                console.log('Saved', json);
              } else {
                // show validation errors if present
                if (json?.errors) {
                  const msgs = Object.values(json.errors).join('\n');
                  alert(msgs || 'Failed to save prayer.');
                } else if (json?.error) {
                  alert(json.error);
                } else {
                  alert('Failed to save prayer.');
                }
                console.error('Save failed', json);
              }
            } catch (e) {
              console.error(e);
              alert('Failed to save prayer.');
            }
          }}
        />

        <section className="home-journey" id="our-journey">
          <div className="home-journey-container">
            <div className="home-journey-header">
              <div className="home-journey-intro">
                <span className="home-journey-label">The Beginning</span>
                <h2 className="home-journey-title">The Gift of Expectation</h2>
                <p className="home-journey-text">
                  Our journey toward parenthood has been paved with faith. Each step of the way, we have felt the divine hand of God guiding us toward this beautiful moment.
                </p>
              </div>
              <button className="home-journey-btn">
                View Full Story
              </button>
            </div>
            <div className="home-journey-grid">
              <div className="home-journey-image">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkeVvEZBYeFfj54jdN0XIH59es9E8zhVOzcKCJJX_F_8E41JYOthKIk3aqPouJ7OaPD_dJ0P8JbkKmiCtP0B78vQtdSaZzWMo8t9nebzHvpQbRw_8ZosBYaQ-tf49NlvnQQYv1xPMKWniMjUOgc5lZuIvq1ypBfT5D5W40SjxFe8OmkpP3TSAI26UuUQYFZIVhkZuMYqxQW0nhACx9o6CYBErcW_A5adwZ6qLQAHqL274xEGYguTxR30qD8_su5q5bxYWC7Rnm7p4" alt="Pregnant woman cradling belly" />
                <div className="home-journey-image-overlay">
                  <AiFillHeart />
                </div>
              </div>
              <div className="home-journey-image">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZGCGQRX6RsYNfw-IQ-pzTEbjy6QgZO_7mvdT-ArgsM687QXLuSdfACy8qV6-HALgVJylA8Ac-v4kZiQtwXpb5oxps1NnKwdQzhNLsenGTMEypLSV10QTr0jQMlhAWdX0R5KheSKxVVT7HJ8HZKNPaQnesoLiGzMgmfMEqqiXIeMjyRKm3fZdmIIWqwQyqm5ESDLlwmSFgwT0xlZaLwai0RM5Tw7baQbpeijQJluBLlYv5pL85cuAE9gi8qt3SnghFf_qgLkYYqSI" alt="Couple praying at sunset" />
                <div className="home-journey-image-overlay">
                  <AiFillHeart />
                </div>
              </div>
              <div className="home-journey-image">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTTdJnUvoN6sp-c-OGKVhutXTvphK-w0XOkOjZfC03P4wKgtsXbfG4FmnLLmfSKUO3O2viC5ssnUSIH-MDHpq46zEUVvdxlQ5KiY6h2JztQTYf9a2BAJW2IM40ckCzUgAqAo_ga03sI2OyJN_CjAZ_F_nu1BvnHxNr3w7KiQ-jLuFulNICgM215tA4iTGAvE-mxDwbZ9CALofnxtTznMfvph32-oKO-Uc3AU2z5cStp5XoNe1_Wf-wpOieyiWvHvEKhGn-AGgiYwg" alt="Open Bible with olive branch" />
                <div className="home-journey-image-overlay">
                  <FiBook />
                </div>
              </div>
            </div>
          </div>
        </section>

        <SignInModal
          open={signInOpen}
          onClose={() => setSignInOpen(false)}
          onSubmit={handleSignIn}
          error={signInError}
        />
      </main>

      <footer className="home-footer">
        <div className="home-footer-content">
          <div className="home-footer-title">𝒱𝒾𝒿𝒶𝓎 ♥ 𝒞𝓎𝓃𝓉𝒽𝒾𝒶</div>
          <p className="home-footer-copyright">© 2026. Blessed be His name.</p>
        </div>
      </footer>
    </div>
  );
}
