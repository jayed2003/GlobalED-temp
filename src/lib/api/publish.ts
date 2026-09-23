import { ApiError } from "@/lib/api/admin-route";
import { fromDhaka } from "@/lib/validation/dates";

/**
 * The moment a blog post goes live, from the form's publish choice.
 * `current` is the post's existing publish time (when editing).
 */
export function publishTimestamp(
  post: { publishMode: "now" | "schedule" | "keep"; publishDate: string; publishTime: string },
  current?: Date,
): Date {
  if (post.publishMode === "now") return new Date();
  if (post.publishMode === "schedule") return fromDhaka(post.publishDate, post.publishTime);
  if (!current) throw new ApiError(400, 'Choose "Publish now" or schedule a date and time', "publishMode");
  return current;
}
