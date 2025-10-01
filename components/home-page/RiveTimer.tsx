import React, { useState, useEffect } from "react";
import { useRive } from "@rive-app/react-canvas";
import styles from "./RiveTimer.module.scss";

const RiveTimer: React.FC = () => {
  const [showFallback, setShowFallback] = useState(false);

  const { RiveComponent, rive } = useRive({
    src: "/animations/timer.riv",
    autoplay: true,
    onLoad: () => {
      console.log("Rive animation loaded successfully");
      setShowFallback(false);
    },
    onLoadError: (error) => {
      console.error("Rive animation failed to load:", error);
      setShowFallback(true);
    },
  });

  // Fallback to CSS animation if Rive fails
  if (showFallback) {
    return (
      <div className={styles.timerContainer}>
        <div className={styles.fallbackClock}>
          <div className={styles.clockFace}>
            <div className={styles.hourHand}></div>
            <div className={styles.minuteHand}></div>
            <div className={styles.secondHand}></div>
            <div className={styles.centerDot}></div>
          </div>
          <div className={styles.clockNumbers}>
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => (
              <div
                key={num}
                className={styles.number}
                style={{
                  transform: `rotate(${index * 30}deg)`,
                  transformOrigin: "0 0",
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.pulseRing}></div>
        <div className={styles.pulseRing2}></div>
      </div>
    );
  }

  return (
    <div className={styles.timerContainer}>
      {RiveComponent ? (
        <RiveComponent />
      ) : (
        <div
          style={{
            width: "300px",
            height: "300px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "18px",
          }}
        >
          Loading Animation...
        </div>
      )}
    </div>
  );
};

export default RiveTimer;
