import React, { useState } from "react";
import { useRouter } from "next/router";

import Layout from "./Layout";
import styles from "./Project.module.scss";
import ProjectSkeleton from "./ProjectSkeleton";
import { ITimeTrack } from "@/models/time-track";
import ManualTimeDialog from "./ManualTimeDialog";
import EventDetailsModal from "./EventDetailsModal";
import { useProject } from "@/hooks/use-api-hooks";
import ErrorMessage from "@/components/ui/ErrorMessage";
import OverviewView from "./components/OverviewView";
import DetailedView from "./components/DetailedView";
import ReportView from "./components/ReportView";
import EmptyProject from "./components/EmptyProject";
import ProjectOperations from "../ProjectOperations";

const Project = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const {
    project,
    isLoading,
    error,
    mutate: mutateProject,
  } = useProject(projectId);
  const [currentView, setCurrentView] = useState<
    "overview" | "calendar" | "report"
  >("overview");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<ITimeTrack | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isManualTimeDialogOpen, setIsManualTimeDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <ProjectSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage />
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className={styles.container}>
          <h2 className={styles.title}>Project not found</h2>
          <p>This project could not be loaded.</p>
        </div>
      </Layout>
    );
  }

  const changeView = (view: "overview" | "calendar" | "report") => {
    setCurrentView(view);
  };

  const handleDateSelect = (start: Date, end: Date) => {
    setSelectedDate(start);
  };

  const handleEventClick = (track: ITimeTrack) => {
    setSelectedEvent(track);
    setIsEventModalOpen(true);
  };

  const handleAddManualTime = (date: Date) => {
    setSelectedDate(date);
    setIsManualTimeDialogOpen(true);
  };

  const handleTimerStart = () => {
    console.log("Timer started");
  };

  const handleTimerStop = () => {
    console.log("Timer stopped");
    setSelectedDate(undefined);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.projectHeader}>
          <h2 className={styles.title}>{project.projectTitle}</h2>
          <ProjectOperations project={project} />
        </div>

        {!project.timeTracks || project.timeTracks.length === 0 ? (
          <EmptyProject />
        ) : (
          <>
            <div className={styles.controller}>
              <div>
                <button
                  className={`${styles.switch} ${
                    currentView === "overview" && styles.active
                  }`}
                  onClick={() => changeView("overview")}
                >
                  Overview
                </button>
                <button
                  className={`${styles.switch} ${
                    currentView === "calendar" && styles.active
                  }`}
                  onClick={() => changeView("calendar")}
                >
                  Calendar
                </button>
                <button
                  className={`${styles.switch} ${
                    currentView === "report" && styles.active
                  }`}
                  onClick={() => changeView("report")}
                >
                  Report
                </button>
              </div>
            </div>

            <div className={styles.content}>
              {currentView === "overview" && (
                <DetailedView project={project} mutateProject={mutateProject} />
              )}
              {currentView === "calendar" && (
                <OverviewView
                  project={project}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  onEventClick={handleEventClick}
                  onAddManualTime={handleAddManualTime}
                  onTimerStart={handleTimerStart}
                  onTimerStop={handleTimerStop}
                />
              )}
              {currentView === "report" && <ReportView project={project} />}
            </div>
          </>
        )}
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        projectId={projectId}
      />

      {/* Manual Time Dialog */}
      <ManualTimeDialog
        isOpen={isManualTimeDialogOpen}
        onClose={() => {
          setIsManualTimeDialogOpen(false);
          setSelectedDate(undefined);
        }}
        selectedDate={selectedDate}
      />
    </Layout>
  );
};

export default Project;
