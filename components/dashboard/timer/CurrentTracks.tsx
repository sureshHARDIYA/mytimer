import React from "react";

import { ITimeTrack } from "@/models/time-track";
import TrackOperations from "../TrackOperations";
import Skeleton from "@/components/ui/Skeleton";
import styles from "./CurrentTracks.module.scss";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useTodayTracks } from "@/hooks/use-api-hooks";
import { calculateTotalDuration, getTrackDuration } from "@/lib/utils/date";

const CurrentTracks = () => {
  const { timeTracks, isLoading, error } = useTodayTracks();

  if (isLoading) {
    return <TracksSkeleton />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  if (timeTracks.length === 0) {
    return (
      <div className={styles.container}>
        <h3>No time tracks for today</h3>
        <p>
          Looks like you haven&#39;t started tracking your activities yet. Ready
          to begin?
        </p>
      </div>
    );
  }

  const totalDaily = calculateTotalDuration(timeTracks);

  return (
    <div className={styles.container}>
      <h3>Total time today: {totalDaily}</h3>
      <p>Your latest time tracks for today</p>
      <ul className={styles.list}>
        {timeTracks.map((track: ITimeTrack) => (
          <li key={track._id.toString()}>
            <div className={styles.content}>
              <div className={styles.mainInfo}>
                <span>{track.title}</span>
                <span className={styles.tag}>{track.tag || "No tag"}</span>
              </div>
              {track.notes && (
                <div className={styles.notes}>
                  {track.notes.length > 300
                    ? track.notes.slice(0, 297) + "..."
                    : track.notes}
                </div>
              )}
            </div>
            <div className={styles.control}>
              <span className={styles.duration}>
                {getTrackDuration(new Date(track.start), new Date(track.end))}
              </span>
              <TrackOperations timeTrack={track} dateType="daily" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrentTracks;

const TracksSkeleton = () => {
  return (
    <div>
      <Skeleton className={styles.header} />
      <Skeleton className={styles.description} />
      <div className={styles.divider}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.item}>
            <Skeleton className={styles.left} />
            <Skeleton className={styles.right} />
          </div>
        ))}
      </div>
    </div>
  );
};
