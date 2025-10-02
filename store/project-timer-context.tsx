import React, { createContext, useState, useEffect, useCallback } from "react";

type ProjectTimerState = {
  projectId: string;
  projectTitle: string;
  startTime: string; // ISO string
} | null;

type ContextType = {
  activeTimer: ProjectTimerState;
  checkIn: (projectId: string, projectTitle: string) => void;
  checkOut: () => {
    projectId: string;
    projectTitle: string;
    startTime: string;
    endTime: string;
  } | null;
  isCheckedIn: (projectId: string) => boolean;
};

export const ProjectTimerContext = createContext<ContextType | null>(null);

const STORAGE_KEY = "project-timer-state";

export const ProjectTimerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeTimer, setActiveTimer] = useState<ProjectTimerState>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setActiveTimer(parsed);
      } catch (error) {
        console.error("Error loading timer state:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage whenever activeTimer changes
  useEffect(() => {
    if (activeTimer) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTimer));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeTimer]);

  const checkIn = useCallback((projectId: string, projectTitle: string) => {
    const startTime = new Date().toISOString();
    setActiveTimer({
      projectId,
      projectTitle,
      startTime,
    });
  }, []);

  const checkOut = useCallback(() => {
    if (!activeTimer) return null;

    const endTime = new Date().toISOString();
    const timerData = {
      ...activeTimer,
      endTime,
    };

    setActiveTimer(null);
    return timerData;
  }, [activeTimer]);

  const isCheckedIn = useCallback(
    (projectId: string) => {
      return activeTimer?.projectId === projectId;
    },
    [activeTimer]
  );

  return (
    <ProjectTimerContext.Provider
      value={{
        activeTimer,
        checkIn,
        checkOut,
        isCheckedIn,
      }}
    >
      {children}
    </ProjectTimerContext.Provider>
  );
};
