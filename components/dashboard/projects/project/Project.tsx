import React, { useState } from "react";
import { useRouter } from "next/router";

import Layout from "./Layout";
import {
  calculateTotalDuration,
  getTrackDuration,
  aggregateTagTimeUsage,
} from "@/lib/utils/date";
import styles from "./Project.module.scss";
import CalendarTimer from "./CalendarTimer";
import ProjectSkeleton from "./ProjectSkeleton";
import { ITimeTrack } from "@/models/time-track";
import ManualTimeDialog from "./ManualTimeDialog";
import ProjectCalendar from "./ProjectCalendar";
import EventDetailsModal from "./EventDetailsModal";
import { useProject } from "@/hooks/use-api-hooks";
import ErrorMessage from "@/components/ui/ErrorMessage";
import WeeklyPieChart from "../../reports/charts/WeeklyPieChart";

const Project = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const { project, isLoading, error } = useProject(projectId);
  const [currentView, setCurrentView] = useState<
    "overview" | "detailed" | "report"
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

  const changeView = (view: "overview" | "detailed" | "report") => {
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
        <h2 className={styles.title}>{project.projectTitle}</h2>

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
                    currentView === "detailed" && styles.active
                  }`}
                  onClick={() => changeView("detailed")}
                >
                  Detailed
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
              {currentView === "detailed" && <DetailedView project={project} />}
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

const OverviewView = ({
  project,
  selectedDate,
  onDateSelect,
  onEventClick,
  onAddManualTime,
  onTimerStart,
  onTimerStop,
}: {
  project: any;
  selectedDate?: Date;
  onDateSelect?: (start: Date, end: Date) => void;
  onEventClick?: (track: ITimeTrack) => void;
  onAddManualTime?: (date: Date) => void;
  onTimerStart?: () => void;
  onTimerStop?: () => void;
}) => {
  return (
    <div className={styles.overview}>
      <div className={styles.calendarSection}>
        <ProjectCalendar
          timeTracks={project.timeTracks || []}
          onDateSelect={onDateSelect}
          onEventClick={onEventClick}
          onAddManualTime={onAddManualTime}
        />
      </div>
    </div>
  );
};

const DetailedView = ({ project }: { project: any }) => {
  return (
    <div className={styles.detailed}>
      <p className={styles.total}>
        Total time spent on this project:
        <span>{calculateTotalDuration(project.timeTracks || [])}</span>
      </p>
      <ul className={styles.list}>
        {(project.timeTracks || []).map((track: ITimeTrack) => (
          <li key={track._id.toString()}>
            <p className={styles.description}>{track.title}</p>
            <span>
              Duration:
              <span className={styles.duration}>
                {getTrackDuration(new Date(track.start), new Date(track.end))}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ReportView = ({ project }: { project: any }) => {
  const tagUsage = aggregateTagTimeUsage(project.timeTracks || []);
  return (
    <div className={styles.charts}>
      <div className={styles.pie}>
        <WeeklyPieChart tagUsage={tagUsage} />
      </div>
    </div>
  );
};

const EmptyProject = () => {
  return (
    <div className={styles.empty}>
      <h3>No Time Tracks Recorded</h3>
      <p>
        Start tracking your time by selecting this project when recording your
        activities to see details here.
      </p>
    </div>
  );
};
