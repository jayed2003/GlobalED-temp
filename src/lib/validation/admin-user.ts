import { z } from "zod";

export const adminPermissionValues = ["DESTINATIONS", "COURSES", "BLOGS", "EVENTS", "IELTS", "LEADS", "TESTIMONIALS"] as const;

// Role is never user-editable: create always makes an EDITOR, and the one
// seeded master ADMIN account keeps its role forever (see the API routes).
const baseFields = {
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  permissions: z.array(z.enum(adminPermissionValues)),
};

export const createAdminUserSchema = z.object({
  ...baseFields,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateAdminUserSchema = z.object({
  ...baseFields,
  // Blank means "keep current password".
  password: z.string().refine((v) => v === "" || v.length >= 8, "Password must be at least 8 characters"),
});

export type CreateAdminUserFormValues = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserFormValues = z.infer<typeof updateAdminUserSchema>;
