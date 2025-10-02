import { useContext } from "react";

import { TimerContext } from "@/store/timer-context";
import { TimeTrackContext } from "@/store/time-track-context";
import { ProjectTimerContext } from "@/store/project-timer-context";

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (context === null)
    throw new Error("useTimerContext must be used within a TimerProvider");

  return context;
};

export const useTimeTrackContext = () => {
  const context = useContext(TimeTrackContext);
  if (context === null)
    throw new Error(
      "useTimeTrackContext must be used within a TimeTrackProvider"
    );

  return context;
};

export const useProjectTimerContext = () => {
  const context = useContext(ProjectTimerContext);
  if (context === null)
    throw new Error(
      "useProjectTimerContext must be used within a ProjectTimerProvider"
    );

  return context;
};
