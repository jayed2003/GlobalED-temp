import { jsonError } from "@/lib/api/admin-route";

// Any /api/* path without its own route: a JSON 404 instead of an HTML page,
// whatever the method.
function notFound() {
  return jsonError(404, "This API endpoint does not exist.");
}

export const GET = notFound;
export const POST = notFound;
export const PUT = notFound;
export const PATCH = notFound;
export const DELETE = notFound;
