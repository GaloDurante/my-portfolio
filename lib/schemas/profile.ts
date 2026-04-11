import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().max(100, "Name must be less than 100 characters").optional(),
  title: z.string().max(200, "Title must be less than 200 characters").optional(),
  email: z.string().email("Must be a valid email address").optional(),
  bio: z.string().max(2000, "Bio must be less than 2000 characters").optional(),
  shortBio: z.string().max(300, "Short bio must be less than 300 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
