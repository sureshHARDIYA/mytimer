import React from "react";
import { ITimeTrack } from "@/models/time-track";
import ProjectCalendar from "../ProjectCalendar";

interface OverviewViewProps {
  project: any;
  selectedDate?: Date;
  onDateSelect?: (start: Date, end: Date) => void;
  onEventClick?: (track: ITimeTrack) => void;
  onAddManualTime?: (date: Date) => void;
  onTimerStart?: () => void;
  onTimerStop?: () => void;
}

const OverviewView = ({
  project,
  selectedDate,
  onDateSelect,
  onEventClick,
  onAddManualTime,
  onTimerStart,
  onTimerStop,
}: OverviewViewProps) => {
  return (
    <div className="overview">
      <div className="calendarSection">
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

export default OverviewView;
