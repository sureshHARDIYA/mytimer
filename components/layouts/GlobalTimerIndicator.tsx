import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

import { formatDuration } from "@/lib/utils/date";
import styles from "./GlobalTimerIndicator.module.scss";
import { useProjectTimerContext } from "@/hooks/use-store-hooks";

const GlobalTimerIndicator: React.FC = () => {
  const { activeTimer } = useProjectTimerContext();
  const [elapsedTime, setElapsedTime] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!activeTimer) {
      setElapsedTime(0);
      return;
    }

    const updateElapsedTime = () => {
      const start = new Date(activeTimer.startTime);
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - start.getTime()) / 1000
      );
      setElapsedTime(diffInSeconds);
    };

    updateElapsedTime();
    const interval = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  if (!activeTimer) return null;

  const handleClick = () => {
    router.push(`/dashboard/projects/${activeTimer.projectId}`);
  };

  return (
    <div
      className={styles.container}
      onClick={handleClick}
      title={`Checked in to ${activeTimer.projectTitle}`}
    >
      <Clock className={styles.icon} size={16} />
      <span className={styles.projectTitle}>{activeTimer.projectTitle}</span>
      <span className={styles.timer}>{formatDuration(elapsedTime)}</span>
    </div>
  );
};

export default GlobalTimerIndicator;
