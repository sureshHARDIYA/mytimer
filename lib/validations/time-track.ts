import { z } from "zod";
import mongoose from "mongoose";
import { objectIdValidation } from "./helpers";

export const timeTrackSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(128),
  start: z.coerce.date(),
  end: z.coerce.date(),
  projectId: objectIdValidation.optional(),
  tag: z.string().optional(),
  notes: z.string().max(1000).optional(),
  trackingType: z.enum(["manual", "system_tracked"]).optional(),
});

export const timeTrackUpdateSchema = z.object({
  newTitle: z.string().trim().min(1, "Title is required").max(128),
  projectId: z
    .string()
    .optional()
    .refine((value) => !value || mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid MongoDB ObjectId",
    }),
  tag: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export type TimeTrackSchemaType = z.infer<typeof timeTrackSchema>;
export type TimeTrackUpdateType = z.infer<typeof timeTrackUpdateSchema>;
