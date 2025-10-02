import React from "react";
import styles from "../Project.module.scss";

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

export default EmptyProject;
