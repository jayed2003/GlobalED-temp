import { z } from "zod";
import { plainText } from "./public-forms";
import { imageAlt } from "./image-alt";
import { imageUrl } from "./image-url";

export const teamMemberSchema = z.object({
  name: plainText({ min: 2, max: 100, minMessage: "Enter the name" }),
  role: plainText({ min: 2, max: 120, minMessage: "Enter the role, e.g. Head of Counselling" }),
  photo: imageUrl("Upload a photo"),
  photoAlt: imageAlt(true),
  bio: plainText({ max: 300 }),
  group: z.enum(["BOARD", "TEAM"], "Choose Board of Directors or Team"),
  shown: z.boolean(),
});

export type TeamMemberFormValues = z.input<typeof teamMemberSchema>;
