import React from "react";
import styles from "./Hero.module.scss";
import PrimaryButton from "../ui/PrimaryButton";
import RiveTimer from "./RiveTimer";

const HeroSection = () => {
  return (
    <section>
      <div className={styles.container}>
        <div className={styles.text}>
          <div>
            <h1>Master Your Time, Master Your Success</h1>
          </div>
          <div>
            <p>
              Transform your productivity with intelligent time tracking. Track
              projects, analyze patterns, and achieve your goals with precision.
              Start your journey to peak performance today.
            </p>
          </div>
          <div>
            <PrimaryButton href="/login" className={styles.btn}>
              Start Tracking Now
            </PrimaryButton>
          </div>
        </div>
        <div className={styles.image}>
          <RiveTimer />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
