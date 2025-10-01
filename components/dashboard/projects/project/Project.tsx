import React, { useState } from "react";
import { useRouter } from "next/router";
import { useProject } from "@/hooks/use-api-hooks";
import Layout from "./Layout";
import {
  calculateTotalDuration,
  getTrackDuration,
  aggregateTagTimeUsage,
} from "@/lib/utils/date";
import { ITimeTrack } from "@/models/time-track";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ProjectSkeleton from "./ProjectSkeleton";
import WeeklyPieChart from "../../reports/charts/WeeklyPieChart";
import styles from "./Project.module.scss";

const Project = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const { project, isLoading, error } = useProject(projectId);
  const [currentView, setCurrentView] = useState<"overview" | "detailed">(
    "detailed"
  );

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

  const changeView = (view: "overview" | "detailed") => {
    setCurrentView(view);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.title}>{project.projectTitle}</h2>

        {project.timeTracks.length === 0 ? (
          <EmptyProject />
        ) : (
          <>
            <div className={styles.controller}>
              <div>
                <button
                  className={`${styles.switch} ${
                    currentView === "detailed" && styles.active
                  }`}
                  onClick={() => changeView("detailed")}
                >
                  Overview
                </button>
                <button
                  className={`${styles.switch} ${
                    currentView === "overview" && styles.active
                  }`}
                  onClick={() => changeView("overview")}
                >
                  Summary
                </button>
              </div>
            </div>

            <div className={styles.content}>
              {currentView === "overview" ? (
                <OverviewView project={project} />
              ) : (
                <DetailedView project={project} />
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Project;

const OverviewView = ({ project }: { project: any }) => {
  const tagUsage = aggregateTagTimeUsage(project.timeTracks);

  return (
    <div className={styles.overview}>
      <p className={styles.total}>
        Total time spent on this project:
        <span>{calculateTotalDuration(project.timeTracks)}</span>
      </p>

      <div className={styles.charts}>
        <div className={styles.pie}>
          <WeeklyPieChart tagUsage={tagUsage} />
        </div>
      </div>
    </div>
  );
};

const DetailedView = ({ project }: { project: any }) => {
  return (
    <div className={styles.detailed}>
      <p className={styles.total}>
        Total time spent on this project:
        <span>{calculateTotalDuration(project.timeTracks)}</span>
      </p>
      <ul className={styles.list}>
        {project.timeTracks.map((track: ITimeTrack) => (
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
