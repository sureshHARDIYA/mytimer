import React from "react";
import { ITimeTrack } from "@/models/time-track";
import Modal from "@/components/ui/Modal";
import styles from "./EventDetailsModal.module.scss";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ITimeTrack | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  if (!event) return null;

  const formatDateTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (start: string | Date, end: string | Date) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const getDurationInMinutes = (start: string | Date, end: string | Date) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Content title="Time Track Details">
        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>{event.title}</h3>
            <div className={styles.duration}>
              {formatDuration(event.start, event.end)}
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Start Time:</span>
              <span className={styles.value}>
                {formatDateTime(event.start)}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>End Time:</span>
              <span className={styles.value}>{formatDateTime(event.end)}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Duration:</span>
              <span className={styles.value}>
                {formatDuration(event.start, event.end)}
                <span className={styles.minutes}>
                  ({getDurationInMinutes(event.start, event.end)} minutes)
                </span>
              </span>
            </div>

            {event.notes && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Notes:</span>
                <span className={styles.value}>{event.notes}</span>
              </div>
            )}

            {event.tag && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Tag:</span>
                <span className={styles.tag}>{event.tag}</span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button className={styles.closeButton} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default EventDetailsModal;
