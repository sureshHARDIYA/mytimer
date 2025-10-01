import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectField from "@/components/ui/SelectField";

import {
  timeTrackUpdateSchema,
  TimeTrackUpdateType,
} from "@/lib/validations/time-track";
import { IProject } from "@/models/project";
import styles from "../SharedStyles.module.scss";
import { editTimeTrack } from "@/lib/utils/services";
import { ITimeTrack } from "@/models/time-track";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useProjects, useTags } from "@/hooks/use-api-hooks";

interface EditFormProps {
  afterSave: () => void;
  initialTrack: ITimeTrack;
}

const EditForm = ({ afterSave, initialTrack }: EditFormProps) => {
  const [selectedProject, setSelectedProject] = useState<{
    value: string;
    label: string;
  } | null>(
    initialTrack.projectId
      ? { value: initialTrack.projectId.toString(), label: "Loading..." }
      : null
  );

  const [selectedTag, setSelectedTag] = useState<{
    value: string;
    label: string;
  } | null>(
    initialTrack.tag
      ? { value: initialTrack.tag, label: initialTrack.tag }
      : null
  );

  const { projects } = useProjects();
  const { tags } = useTags();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TimeTrackUpdateType>({
    resolver: zodResolver(timeTrackUpdateSchema),
    mode: "all",
    defaultValues: {
      newTitle: initialTrack.title,
      projectId: initialTrack.projectId?.toString(),
      notes: initialTrack.notes || "",
    },
  });

  // Update selected project when projects are loaded
  useEffect(() => {
    if (projects && initialTrack.projectId) {
      const project = projects.find(
        (p: IProject) =>
          p._id?.toString() === initialTrack.projectId?.toString()
      );
      if (project) {
        setSelectedProject({
          value: project._id!.toString(),
          label: project.projectTitle,
        });
      }
    }
  }, [projects, initialTrack.projectId]);

  const projectOptions = [
    { value: "", label: "No Project" },
    ...(projects?.map((project: IProject) => ({
      value: project._id!.toString(),
      label: project.projectTitle,
    })) || []),
  ];

  const tagOptions = [
    { value: "", label: "No Tag" },
    ...(tags?.map((tag: string) => ({
      value: tag,
      label: tag,
    })) || []),
  ];

  async function onSubmit(enteredData: TimeTrackUpdateType) {
    const { newTitle, notes } = enteredData;
    const projectId = selectedProject?.value || undefined;
    const tag = selectedTag?.value || undefined;

    const hasChanges =
      newTitle !== initialTrack.title ||
      projectId !== (initialTrack.projectId?.toString() || "") ||
      tag !== (initialTrack.tag || "") ||
      notes !== (initialTrack.notes || "");

    if (!hasChanges) {
      afterSave();
      return;
    }

    try {
      await editTimeTrack(
        initialTrack._id.toString(),
        newTitle,
        projectId,
        tag,
        notes
      );
      toast.success("Time track updated successfully");
      reset();
    } catch (error) {
      toast.error("An error occurred. Please try again");
    }
    afterSave();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.control}>
        <input {...register("newTitle")} type="text" placeholder="Title" />
      </div>
      {errors.newTitle && (
        <p className={styles.error}>{`${errors.newTitle.message}`}</p>
      )}

      <div className={styles.control}>
        <SelectField
          label="Project"
          value={selectedProject}
          onChange={(option) => setSelectedProject(option)}
          options={projectOptions}
          placeholder="Select a project..."
          isClearable
        />
      </div>

      <div className={styles.control}>
        <SelectField
          label="Tag"
          value={selectedTag}
          onChange={(option) => setSelectedTag(option)}
          options={tagOptions}
          placeholder="Select a tag..."
          isClearable
        />
      </div>

      <div className={styles.control}>
        <label className={styles.label}>Notes</label>
        <textarea
          {...register("notes")}
          placeholder="Add notes (optional)"
          rows={3}
          className={styles.textarea}
        />
        {errors.notes && <p className={styles.error}>{errors.notes.message}</p>}
      </div>

      <div className={styles.action}>
        <PrimaryButton
          type="submit"
          className={isSubmitting ? styles.submitting : ""}
          disabled={errors.newTitle && true}
        >
          Update
        </PrimaryButton>
        {errors.root?.serverError && (
          <span className={styles.error}>
            {errors.root.serverError.message}
          </span>
        )}
      </div>
    </form>
  );
};

export default EditForm;
