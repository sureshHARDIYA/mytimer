import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import PrimaryButton from "@/components/ui/PrimaryButton";
import styles from "./CheckOutDialog.module.scss";

interface CheckOutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string, notes: string) => void;
  projectTitle: string;
  duration: string;
}

const CheckOutDialog: React.FC<CheckOutDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  duration,
}) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  // Convert duration from HH:MM:SS to readable format like "1h 23m"
  const formatDurationForTitle = (duration: string) => {
    const parts = duration.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return minutes > 0 ? `${minutes}m` : "0m";
  };

  // Update title when dialog opens or duration changes
  useEffect(() => {
    if (isOpen) {
      const formattedDuration = formatDurationForTitle(duration);
      setTitle(`${formattedDuration} Work on ${projectTitle}`);
    }
  }, [isOpen, duration, projectTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    onConfirm(title.trim(), notes.trim());
  };

  const handleClose = () => {
    setTitle("");
    setNotes("");
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Modal.Content title="Check Out">
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.durationInfo}>
            <span className={styles.label}>Time Tracked:</span>
            <span className={styles.duration}>{duration}</span>
          </div>

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
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="notes" className={styles.label}>
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes (optional)"
              className={styles.textarea}
              rows={4}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <PrimaryButton type="submit">Save & Check Out</PrimaryButton>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default CheckOutDialog;
