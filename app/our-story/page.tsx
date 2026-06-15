"use client";
import React, { useEffect } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { FiHeart, FiBook } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import "./our-story.css";


export default function OurStoryPage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
      section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-8');
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div className="home-container">
      <SiteHeader currentPage="story" />

      <main className="home-main home-story-page">
        <section className="hero-story-intro">
          <p className="hero-story-topline">A story written in the stars</p>
          <h1 className="hero-story-title">The Story of Us (According to Me)</h1>
          <p className="hero-story-subtitle">
            “Before I was even a thought in my parents’ minds, God was already weaving our lives together.”
          </p>
          <div className="hero-story-icon">⌄</div>
        </section>

        <section className="story-content">
          <div className="story-content-left">
            <article className="story-block story-block-large">
              <span className="story-chapter">Chapter 1</span>
              <h2>Before I Existed</h2>
              <p>
                I was carefully floating on a web of hope and waiting to be called visible, while my parents were still learning how to say the word "together".
                The beginning of this story was written in whispers and soft prayers.
              </p>
            </article>

            <article className="story-block story-block-row">
              <div>
                <span className="story-chapter">Chapter 3</span>
                <h3>The Friendship Upgrade</h3>
                <p>
                  Their relationship grew from a close friendship into something deeper. Every conversation felt like a new chapter toward forever.
                </p>
              </div>

              <div className="story-icon-row">
                <div className="story-icon-card">CITY</div>
                <div className="story-icon-card">CITY</div>
              </div>
            </article>

            <article className="story-block story-block-bottom">
              <span className="story-chapter">Chapter 7</span>
              <h3>The Big Question</h3>
              <p>
                He got on one knee and asked, and the answer came from the heart. It was the moment when dreams joined their hands and became a promise.
              </p>
            </article>
          </div>

          <div className="story-content-right">
            <article className="story-block story-image hero-story-image">
              <img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80" alt="Morning sun through clouds over water" />
            </article>

            <article className="story-block story-block-small">
              <span className="story-chapter">Chapter 2</span>
              <h3>The Pencil Partnership</h3>
              <p>
                They thought their story began with a pencil in class, but it was destiny writing itself with every small gesture.
              </p>
            </article>

            <div className="story-grid-images">
              <article className="story-image-card">
                <img src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80" alt="Couple on a path" />
              </article>
              <article className="story-image-card">
                <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80" alt="Woman at desk writing" />
              </article>
            </div>

            <article className="story-block story-block-small story-block-alt">
              <span className="story-chapter">Chapter 4</span>
              <h3>Different Cities</h3>
              <p>
                Distance only made their love stronger. They discovered that every mile between them was another line of poetry.
              </p>
            </article>

            <article className="story-block story-image story-image-glow">
              <img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80" alt="Couple in golden light" />
            </article>

            <article className="story-block story-block-large story-block-bottom-right">
              <span className="story-chapter">Chapter 5</span>
              <h3>Long Distance Magic</h3>
              <p>
                The nights were long, but their love felt as if it had been written in starlight. Every reunion was a little miracle.
              </p>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
    
  );
}
