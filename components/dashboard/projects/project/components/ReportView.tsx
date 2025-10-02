import React from "react";

import styles from "../Project.module.scss";
import ProjectPieChart from "../ProjectPieChart";
import { aggregateTagTimeUsage } from "@/lib/utils/date";

interface ReportViewProps {
  project: any;
}

const ReportView = ({ project }: ReportViewProps) => {
  const tagUsage = aggregateTagTimeUsage(project.timeTracks || []);
  return (
    <div className={styles.charts}>
      <div className={styles.largePie}>
        <ProjectPieChart tagUsage={tagUsage} />
      </div>
    </div>
  );
};

export default ReportView;
