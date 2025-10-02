import React, { useState } from "react";
import { useSWRConfig } from "swr";
import { ITimeTrack } from "@/models/time-track";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { deleteTimeTrack } from "@/lib/utils/services";
import styles from "./EventDetailsModal.module.scss";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ITimeTrack | null;
  projectId?: string;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  event,
  projectId,
}) => {
  const { mutate: globalMutate } = useSWRConfig();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!event) return null;

  const handleDelete = async () => {
    if (!event._id) return;

    if (!confirm("Are you sure you want to delete this time entry?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteTimeTrack(event._id.toString());
      
      // Refresh the project data to update the calendar
      if (projectId) {
        await globalMutate(`/api/user/projects/${projectId}`);
      }
      
      onClose();
    } catch (error) {
      console.error("Error deleting time track:", error);
      alert("Failed to delete time entry. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

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
            <PrimaryButton 
              onClick={handleDelete} 
              disabled={isDeleting}
              className={styles.deleteButton}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </PrimaryButton>
            <PrimaryButton onClick={onClose}>
              Close
            </PrimaryButton>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default EventDetailsModal;
