import { useSWRConfig } from "swr";
import React, { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

import CheckOutDialog from "./CheckOutDialog";
import { formatDuration } from "@/lib/utils/date";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useProjectTimerContext } from "@/hooks/use-store-hooks";
import styles from "./ProjectCheckInButton.module.scss";
import { sendTimeTrack, TimeTrackRecording } from "@/lib/utils/services";

interface ProjectCheckInButtonProps {
  projectId: string;
  projectTitle: string;
}

const ProjectCheckInButton: React.FC<ProjectCheckInButtonProps> = ({
  projectId,
  projectTitle,
}) => {
  const { activeTimer, checkIn, checkOut, isCheckedIn } =
    useProjectTimerContext();
  const { mutate: globalMutate } = useSWRConfig();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckOutDialogOpen, setIsCheckOutDialogOpen] = useState(false);

  const isCurrentProjectCheckedIn = isCheckedIn(projectId);

  // Update elapsed time every second when checked in
  useEffect(() => {
    if (!isCurrentProjectCheckedIn || !activeTimer) {
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
  }, [isCurrentProjectCheckedIn, activeTimer]);

  const handleCheckIn = async () => {
    // Check if there's an active timer for a different project
    if (activeTimer && activeTimer.projectId !== projectId) {
      const confirmed = confirm(
        `You're currently checked in to "${activeTimer.projectTitle}". Would you like to check out from that project and check in to this one?`
      );

      if (confirmed) {
        setIsProcessing(true);
        try {
          // Check out from the other project first with default title
          await handleCheckOutInternal(
            activeTimer.projectId,
            `Work on ${activeTimer.projectTitle}`,
            ""
          );
          // Then check in to this project
          checkIn(projectId, projectTitle);
        } finally {
          setIsProcessing(false);
        }
      }
      return;
    }

    checkIn(projectId, projectTitle);
  };

  const handleCheckOutInternal = async (
    targetProjectId: string,
    title: string,
    notes: string
  ) => {
    const timerData = checkOut();

    if (!timerData) {
      console.error("No timer data available");
      return;
    }

    // Create time track entry
    const timeTrackData: TimeTrackRecording = {
      title: title,
      start: timerData.startTime,
      end: timerData.endTime,
      projectId: timerData.projectId,
      trackingType: "system_tracked",
      notes: notes || undefined,
    };

    await sendTimeTrack(timeTrackData);

    // Refresh the project data
    await globalMutate(`/api/user/projects/${targetProjectId}`);
  };

  const handleCheckOut = async () => {
    // Show the dialog instead of immediately checking out
    setIsCheckOutDialogOpen(true);
  };

  const handleCheckOutConfirm = async (title: string, notes: string) => {
    setIsCheckOutDialogOpen(false);
    setIsProcessing(true);
    try {
      await handleCheckOutInternal(projectId, title, notes);
    } catch (error) {
      console.error("Error saving time track:", error);
      alert("Failed to save time entry. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      {isCurrentProjectCheckedIn ? (
        <PrimaryButton
          onClick={handleCheckOut}
          disabled={isProcessing}
          className={styles.outlinedButton}
        >
          <Pause size={18} className={styles.icon} />
          {isProcessing ? "Checking Out..." : "Check Out"}
        </PrimaryButton>
      ) : (
        <PrimaryButton
          onClick={handleCheckIn}
          className={styles.outlinedButton}
        >
          <Play size={18} className={styles.icon} />
          Check In
        </PrimaryButton>
      )}

      <CheckOutDialog
        isOpen={isCheckOutDialogOpen}
        onClose={() => setIsCheckOutDialogOpen(false)}
        onConfirm={handleCheckOutConfirm}
        projectTitle={projectTitle}
        duration={formatDuration(elapsedTime)}
      />
    </div>
  );
};

export default ProjectCheckInButton;
