"use client";
import React, { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { FiHeart, FiBook } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import "./our-story.css";


export default function OurStoryPage() {

  const [showStory, setShowStory ] = useState(true);
  
  useEffect(() => {

  }, []);
  return (
    <div className="home-container">
      <SiteHeader currentPage="story" />

      <main className="home-main home-story-page">

        {showStory && (
          <div>
          <section className="hero-story-intro">
            <p className="hero-story-topline">A story written in the stars</p>
            <h1 className="hero-story-title">The Story of Us (According to Me)</h1>
            <p className="hero-story-subtitle">
              “Before I was even a thought in my parents’ minds, God was already weaving our lives together.”
            </p>
            <div className="hero-story-icon">⌄</div>
          </section>
          <section className="timeline">

            <div className="timeline__line"></div>

            <section className="chapter">
              <div className="chapter__content chapter__content--right">
                <span className="chapter__label">Chapter 1</span>
                <h2 className="chapter__title">Before Me</h2>
                <p className="chapter__description">
                  "I was essentially floating on a very fluffy cloud, 
                  eating celestial cookies and scrolling through the 'Potential Parents' catalog. 
                  I saw two kids sharing a pencil in the back of a classroom and thought... 
                  'Huh, they look promising.'"
                </p>
              </div>

              <div className="chapter__media">
                <img
                  src="/chapter1.png"
                  alt="Ethereal clouds and a vintage telescope"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__marker"></div>
            </section>

            <section className="chapter chapter--reverse">
              <div className="chapter__media">
                <img
                  src="/chapter2.png"
                  alt="School classroom sharing a pencil"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__content">
                <span className="chapter__label">Chapter 2</span>
                <h2 className="chapter__title">The Pencil Partnership</h2>
                <p className="chapter__description">
                  "They thought they were just sharing a pencil in class. 
                  How cute. They had no idea they were sharing a destiny."
                  <br /><br/> 
                  <b>Funny Visual</b>I whispered into Dad's ear: 
                  "Psst... that's your future wife." He just thought he had an itch.
                </p>
              </div>

              <div className="chapter__marker"></div>
            </section>

            <section className="chapter">
              <div className="chapter__content chapter__content--right">
                <span className="chapter__label">Chapter 3</span>
                <h2 className="chapter__title">The Friendship Upgrade</h2>
                <p className="chapter__description">
                  "Phone calls that lasted forever. Their battery died, 
                  their data ran out, but their conversation? 
                  That was infinite. I was mostly worried about Dad's morning alarm."
                </p>
              </div>
              <div className="chapter__media">
                <img
                  src="/chapter3.png"
                  alt="School classroom sharing a pencil"
                  className="chapter__image"
                />
              </div>
              <div className="chapter__marker"></div>
            </section>

            <section className="chapter chapter--reverse">
              <div className="chapter__media">
                <img
                  src="/chapter4.png"
                  alt="School classroom sharing a pencil"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__content">
                <span className="chapter__label">Chapter 4</span>
                <h2 className="chapter__title">Different Cities</h2>
                <p className="chapter__description">
                  Life pulled them in different directions.
                  Different maps, different streets, different sunsets. 
                  But even miles apart, they always seemed to be looking 
                  at the same stars.
                </p>
              </div>

              <div className="chapter__marker"></div>
            </section>

            <section className="chapter">
              <div className="chapter__content chapter__content--right">
                <span className="chapter__label">Chapter 5</span>
                <h2 className="chapter__title">The Sailor &amp; The Engineer</h2>
                <p className="chapter__description">
                  "Dad was fighting literal storms at sea. 
                  Mom was fighting bugs in the system. 
                  Personally? I think Mom's battle looked harder. 
                  Ever tried debugging at 2 AM?"
                </p>
              </div>

              <div className="chapter__media">
                <img
                  src="/chapter5.png"
                  alt="Ethereal clouds and a vintage telescope"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__marker"></div>
            </section>


            <section className="chapter chapter--reverse">
              <div className="chapter__media">
                <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqdZzHBsACPamx82tuzC7TbtEo_AP-jRj80vUCFhZfLvfmgddqzpbWjzEWvKvN-fclkzQib9W2twuXbg4YbHLFK7hVPyVlB_XpZZ_xkKLjtMWSvyTxwm28cg6xRnNpYKsBwJPl5VuGgVVdAdUdJaSs_Yi6H7lQxIz_eI9cBQxwgMN9RBWEw_6zXR1bzZiaWlC7pv5HYgFB_J37DCeUQnCiGiKnFoNraKWc_m9VTssaXzjF53gJIfyTQ0UWJPTnhfxm2JXd4VudRTU"
                  alt="School classroom sharing a pencil"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__content">
                <span className="chapter__label">Chapter 6</span>
                <h2 className="chapter__title">Long Distance Magic</h2>
                <p className="chapter__description">
                  They say long distance is hard, but they made it look like magic. 
                  Thousands of miles of ocean couldn't stop those nightly "how was your day?" calls. 
                  I kept track of every minute from my cloud.
                </p>
              </div>

              <div className="chapter__marker"></div>
            </section>

            <section className="chapter">
              <div className="chapter__content chapter__content--right">
                <span className="chapter__label">Chapter 7</span>
                <h2 className="chapter__title">The Big Question</h2>
                <p className="chapter__description">
                  Dad was so nervous! He practiced saying "I love you" and "Will you?" to the mirror, 
                  to the stars, and even to a stray cat once. 
                  He wanted every word to be perfect for Mom.
                </p>
              </div>

              <div className="chapter__media">
                <img
                  src="/chapter7.png"
                  alt="Ethereal clouds and a vintage telescope"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__marker"></div>
            </section>

            <section className="chapter chapter--reverse">
              <div className="chapter__media">
                <img
                  src="/chapter8.png"
                  alt="School classroom sharing a pencil"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__content">
                <span className="chapter__label">Chapter 8</span>
                <h2 className="chapter__title">Mom's Response</h2>
                <p className="chapter__description">
                  And just like every classic love story...
                  Mom didn't immediately say yes.  
                  Dad's heart was stuck in 'airplane mode' waiting for her to land. 
                  And then, she said the most beautiful word in the world: YES.
                </p>
              </div>

              <div className="chapter__marker"></div>
            </section>

            <section className="chapter">
              <div className="chapter__content chapter__content--right">
                <span className="chapter__label">Chapter 9</span>
                <h2 className="chapter__title">Faith Wins</h2>
                <p className="chapter__description">
                  They brought their love to the church and knelt in prayer. 
                  I watched as their two separate paths merged into one single, 
                  golden road directed by the Divine. 
                  It was the moment they stopped being 'him and her' and started being 'us'.
                </p>
              </div>

              <div className="chapter__media">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDas5l430NDpR65enszeqrcVEVYjCRTrYxT3c6Rpp-pKo0W6QUBd5PH8KiDtdn0H_NUMsGeo6ZclEJVMysaPBDd6RipzRWWUpBo2F3EJNst6WtY62ty51334Ofss1EsOYgvnwak9MJ3-b40iEamnxRYFeh342HJVxi1uPR8EEuFF-eRJmw4GeC3a40ZODpb4gwyJaI3RDEGs5StGYn1LogZw9RmD3Gt_8DCc3OtT5dAMTWuCLRvokRwAYMuSjYSHEaty4UIZ94mAZA"
                  alt="Ethereal clouds and a vintage telescope"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__marker"></div>
            </section>

            <section className="chapter chapter--reverse">
              <div className="chapter__media">
                <img
                  src="/chapter10.png"
                  alt="School classroom sharing a pencil"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__content">
                <span className="chapter__label">Chapter 10</span>
                <h2 className="chapter__title">Wedding Bells</h2>
                <p className="chapter__description">
                  Then came the big day! Music, dancing, and so much laughter. 
                  They promised forever in front of everyone they loved. 
                  I danced a little bit on my cloud that day too.
                </p>
              </div>

              <div className="chapter__marker"></div>
            </section>

            <section className="chapter">
              <div className="chapter__content chapter__content--right">
                <span className="chapter__label">Chapter 11</span>
                <h2 className="chapter__title">My Favorite Part</h2>
                <p className="chapter__description">
                  One morning, the calendar flipped and there it was—a positive test! 
                  The moment their world changed forever. 
                  It was the moment I knew my time to come down was getting close.              </p>
              </div>

              <div className="chapter__media">
                <img
                  src="/chapter11.png"
                  alt="Ethereal clouds and a vintage telescope"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__marker"></div>
            </section>

                      <section className="chapter chapter--reverse">
              <div className="chapter__media">
                <img
                  src="/chapter12.png"
                  alt="School classroom sharing a pencil"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__content">
                <span className="chapter__label">Chapter 12</span>
                <h2 className="chapter__title">Choosing My Parents</h2>
                <p className="chapter__description">
                  I had a lot of applications to look at, but Mom and Dad’s were the best. 
                  I did a very thorough interview (mostly while they were sleeping). 
                  They passed with flying colors!
                </p>
              </div>

              <div className="chapter__marker"></div>
            </section>

            <section className="chapter">
              <div className="chapter__content chapter__content--right">
                <span className="chapter__label">Chapter 13</span>
                <h2 className="chapter__title">The Big Reveal</h2>
                <p className="chapter__description">
                  And now, the countdown is on! I’m packing my bags (do I need diapers? probably) 
                  and getting ready for the big reveal. I can't wait to meet the two people who 
                  have been loving me before I even existed.             
                </p>
              </div>

              <div className="chapter__media">
                <img
                  src="/chapter13.png"
                  alt="Ethereal clouds and a vintage telescope"
                  className="chapter__image"
                />
              </div>

              <div className="chapter__marker"></div>
            </section>
          </section>
          </div>
        )}
        {!showStory && (
          <div className="section__coming-soon">
            <h3>Under Construction 🚧</h3>
            <p>
              Mom and Dad are still working on this chapter. 
              I’m just here supervising from the inside.
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
    
  );
}
