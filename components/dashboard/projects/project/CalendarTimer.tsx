import { useRouter } from "next/router";
import React, { useState } from "react";

import styles from "./CalendarTimer.module.scss";
import { useTodayTracks } from "@/hooks/use-api-hooks";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { sendTimeTrack, TimeTrackRecording } from "@/lib/utils/services";
import { useTimeTrackContext, useTimerContext } from "@/hooks/use-store-hooks";

interface CalendarTimerProps {
  selectedDate?: Date;
  onTimerStart?: () => void;
  onTimerStop?: () => void;
}

const CalendarTimer: React.FC<CalendarTimerProps> = ({
  selectedDate,
  onTimerStart,
  onTimerStop,
}) => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const { mutate } = useTodayTracks();
  const timeTrackContext = useTimeTrackContext();
  const timerContext = useTimerContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (!title.trim()) {
      alert("Please enter a title for your time track");
      return;
    }

    // Set the time track context
    timeTrackContext.setTitle(title);
    timeTrackContext.setProjectId(projectId);
    timeTrackContext.setNotes(description);
    timeTrackContext.setStartTime(new Date());

    // Start the timer
    timerContext.setTimer(true);

    if (onTimerStart) {
      onTimerStart();
    }
  };

  const handleStop = async () => {
    if (!timeTrackContext.startTime) return;

    try {
      const timeTrackData: TimeTrackRecording = {
        title: timeTrackContext.title,
        start: timeTrackContext.startTime.toISOString(),
        end: new Date().toISOString(),
        projectId: projectId,
        tag: timeTrackContext.tag,
        notes: timeTrackContext.notes,
        trackingType: "system_tracked",
      };

      await sendTimeTrack(timeTrackData);
      mutate(); // Refresh the time tracks

      // Reset everything
      timerContext.setTimer(false);
      timeTrackContext.setTitle("");
      timeTrackContext.setProjectId("");
      timeTrackContext.setNotes("");
      timeTrackContext.setStartTime(null);
      setTitle("");
      setDescription("");

      if (onTimerStop) {
        onTimerStop();
      }
    } catch (error) {
      console.error("Error saving time track:", error);
      alert("Error saving time track. Please try again.");
    }
  };

  const handleReset = () => {
    timerContext.setTimer(false);
    timeTrackContext.setTitle("");
    timeTrackContext.setProjectId("");
    timeTrackContext.setNotes("");
    timeTrackContext.setStartTime(null);
    setTitle("");
    setDescription("");
  };

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerHeader}>
        <h3>Timer</h3>
        {selectedDate && (
          <p className={styles.selectedDate}>
            Selected: {selectedDate.toLocaleDateString()}
          </p>
        )}
      </div>

      <div className={styles.timerDisplay}>
        <div className={styles.time}>{formatTime(timerContext.time)}</div>
        <div className={styles.status}>
          {timerContext.timer ? "Running" : "Stopped"}
        </div>
      </div>

      {!timerContext.timer && (
        <div className={styles.inputs}>
          <input
            type="text"
            placeholder="What are you working on?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.titleInput}
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.descriptionInput}
            rows={2}
          />
        </div>
      )}

      <div className={styles.controls}>
        {!timerContext.timer ? (
          <PrimaryButton onClick={handleStart} disabled={!title.trim()}>
            Start Timer
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={handleStop} ariaLabel="Stop and Save">
            Stop & Save
          </PrimaryButton>
        )}

        {!timerContext.timer && timerContext.time > 0 && (
          <PrimaryButton onClick={handleReset} ariaLabel="Reset Timer">
            Reset
          </PrimaryButton>
        )}
      </div>

      {timerContext.timer && (
        <div className={styles.currentTrack}>
          <p>
            <strong>Current Track:</strong> {timeTrackContext.title}
          </p>
          {timeTrackContext.notes && (
            <p>
              <strong>Description:</strong> {timeTrackContext.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarTimer;
