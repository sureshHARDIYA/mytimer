import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useSWRConfig } from "swr";
import Modal from "@/components/ui/Modal";
import styles from "./ManualTimeDialog.module.scss";
import { useTodayTracks } from "@/hooks/use-api-hooks";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { sendTimeTrack, TimeTrackRecording } from "@/lib/utils/services";

interface ManualTimeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

const ManualTimeDialog: React.FC<ManualTimeDialogProps> = ({
  isOpen,
  onClose,
  selectedDate,
}) => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const { mutate } = useTodayTracks();
  const { mutate: globalMutate } = useSWRConfig();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title for your time track");
      return;
    }

    if (!startTime || !endTime) {
      alert("Please select both start and end times");
      return;
    }

    // Create date objects for validation
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    // Validate that times are not in the future
    if (startDate > now || endDate > now) {
      alert("Cannot add time entries in the future");
      return;
    }

    // Validate that start time is before end time
    if (startDate >= endDate) {
      alert("Start time must be before end time");
      return;
    }

    setIsSubmitting(true);

    try {
      const timeTrackData: TimeTrackRecording = {
        title: title.trim(),
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        projectId: projectId,
        notes: description.trim(),
      };

      await sendTimeTrack(timeTrackData);
      mutate(); // Refresh today's tracks
      // Refresh the project data so calendar updates without a full reload
      if (projectId) {
        await globalMutate(`/api/user/projects/${projectId}`);
      }

      // Reset form
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");

      onClose();
    } catch (error) {
      console.error("Error saving time track:", error);
      alert("Error saving time track. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    onClose();
  };

  useEffect(() => {
    if (isOpen && selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      setStartTime(`${dateStr}T09:00`);
      setEndTime(`${dateStr}T17:00`);
    } else if (isOpen) {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      setStartTime(`${dateStr}T09:00`);
      setEndTime(`${dateStr}T17:00`);
    }
  }, [isOpen, selectedDate]);

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Modal.Content title="Add Manual Time Entry">
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What did you work on?"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional notes (optional)"
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.timeFields}>
            <div className={styles.field}>
              <label htmlFor="startTime" className={styles.label}>
                Start Time *
              </label>
              <input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={styles.input}
                max={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="endTime" className={styles.label}>
                End Time *
              </label>
              <input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={styles.input}
                max={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              disabled={isSubmitting || !title.trim() || !startTime || !endTime}
            >
              {isSubmitting ? "Saving..." : "Add Time Entry"}
            </PrimaryButton>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default ManualTimeDialog;
