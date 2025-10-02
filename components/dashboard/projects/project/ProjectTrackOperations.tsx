import { toast } from "sonner";
import React, { useState } from "react";
import { MoreVertical } from "lucide-react";

import Modal from "@/components/ui/Modal";
import EditForm from "../../reports/EditForm";
import Dropdown from "@/components/ui/Dropdown";
import { ITimeTrack } from "@/models/time-track";
import AlertDialog from "@/components/ui/AlertDialog";
import { deleteTimeTrack } from "@/lib/utils/services";

import styles from "../../SharedStyles.module.scss";

const ProjectTrackOperations = ({
  timeTrack,
  mutateProject,
}: {
  timeTrack: ITimeTrack;
  mutateProject: () => void;
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const deleteTimeTrackHandler = async () => {
    try {
      await deleteTimeTrack(timeTrack._id.toString());
      mutateProject(); // Use project-specific mutate
      toast.success("Time Track deleted successfully");
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Button className={styles.operation} aria-label="Operations">
          <MoreVertical />
        </Dropdown.Button>
        <Dropdown.Menu sideOffset={5} align="end">
          <Dropdown.MenuItem
            className={styles.edit}
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </Dropdown.MenuItem>
          <Dropdown.Separator className={styles.separator} />
          <Dropdown.MenuItem
            className={styles.delete}
            onClick={() => setShowDeleteAlert(true)}
          >
            Delete
          </Dropdown.MenuItem>
        </Dropdown.Menu>
      </Dropdown>
      <AlertDialog open={showDeleteAlert} setOpen={setShowDeleteAlert}>
        <AlertDialog.Content
          title="Are you sure you want to delete this time track?"
          description="This action can&#39;t be undone."
          action="Delete time track"
          onAction={deleteTimeTrackHandler}
        />
      </AlertDialog>
      <Modal open={showEditModal} onOpenChange={setShowEditModal}>
        <Modal.Content title="Edit title" className={styles.modal}>
          <EditForm
            initialTrack={timeTrack}
            afterSave={() => {
              setShowEditModal(false);
              mutateProject(); // Use project-specific mutate
            }}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default ProjectTrackOperations;
