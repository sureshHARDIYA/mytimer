import React from "react";
import { ITimeTrack } from "@/models/time-track";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./ProjectCalendar.module.scss";

interface ProjectCalendarProps {
  timeTracks: ITimeTrack[];
  onDateSelect?: (start: Date, end: Date) => void;
  onEventClick?: (track: ITimeTrack) => void;
  onAddManualTime?: (date: Date) => void;
}

const ProjectCalendar: React.FC<ProjectCalendarProps> = ({
  timeTracks,
  onDateSelect,
  onEventClick,
  onAddManualTime,
}) => {
  const handleDateClick = (info: any) => {
    if (onDateSelect) {
      onDateSelect(info.date, info.date);
    }
  };

  const handleCalendarDoubleClick = (event: React.MouseEvent) => {
    const target = event.target as Element;
    const dayElement = target.closest(".fc-daygrid-day");
    if (dayElement) {
      const dateStr = dayElement.getAttribute("data-date");
      if (dateStr) {
        const clickedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today

        // Allow adding time tracks for any date
        if (onAddManualTime) {
          onAddManualTime(clickedDate);
        }
      }
    }
  };

  const handleEventClick = (info: any) => {
    if (onEventClick) {
      onEventClick(info.event.extendedProps.originalTrack);
    }
  };

  // Convert time tracks to FullCalendar events with manual/system indicators
  const events = timeTracks.map((track) => {
    // Determine if it's manual or system tracked based on notes or other criteria
    const isManual = track.notes && track.notes.includes("[MANUAL]");
    const isSystem = !isManual;

    return {
      id: track._id.toString(),
      title: isManual ? `📝 ${track.title}` : `⏱️ ${track.title}`,
      start: track.start,
      end: track.end,
      className: isManual ? "manual-track" : "system-track",
      extendedProps: {
        originalTrack: track,
        isManual,
        isSystem,
      },
    };
  });

  return (
    <div className={styles.calendar} onDoubleClick={handleCalendarDoubleClick}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        aspectRatio={1.8}
        dayMaxEvents={3}
        eventDisplay="block"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        nowIndicator={true}
        dayMaxEventRows={3}
        moreLinkText="more"
      />
    </div>
  );
};

export default ProjectCalendar;
