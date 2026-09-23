import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import type { z } from "zod";
import { Prisma, type AdminPermission } from "@/generated/prisma/client";
import { requireAdmin, requirePermission, requireSession } from "@/lib/authz";

/**
 * Shared plumbing for every /api/admin route: auth, JSON body parsing and
 * validation, and turning any failure into a consistent JSON error
 * `{ error: string, field?: string }` with the right status code — never an
 * HTML error page or a leaked stack trace.
 *
 *   export const PATCH = adminRoute({ permission: "BLOGS" }, async ({ request, params }) => {
 *     const data = await readJson(request, blogSchema);
 *     ...
 *   });
 *
 * Throw ApiError(status, message) anywhere inside a handler to return that error.
 */

/** Largest JSON body an admin form legitimately sends is well under this. */
const MAX_JSON_BYTES = 1024 * 1024;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly field?: string,
  ) {
    super(message);
  }
}

type Access = { permission: AdminPermission } | { adminOnly: true } | { anyAdmin: true };

interface HandlerContext<P> {
  request: Request;
  session: Session;
  params: P;
}

function authorize(access: Access): Promise<Session | null> {
  if ("permission" in access) return requirePermission(access.permission);
  if ("adminOnly" in access) return requireAdmin();
  return requireSession();
}

export function jsonError(status: number, message: string, field?: string): NextResponse {
  return NextResponse.json(field ? { error: message, field } : { error: message }, { status });
}

/** Wrap an admin route handler with auth + uniform error handling. */
export function adminRoute<P = Record<string, never>>(
  access: Access,
  handler: (ctx: HandlerContext<P>) => Promise<Response>,
) {
  return async (request: Request, context: { params: Promise<P> }): Promise<Response> => {
    try {
      const session = await authorize(access);
      if (!session) {
        return jsonError(401, "Your session has expired or you don't have access. Please sign in again.");
      }
      const params = context?.params ? await context.params : ({} as P);
      return await handler({ request, session, params });
    } catch (err) {
      return toErrorResponse(err);
    }
  };
}

/**
 * Read and validate a JSON request body. Throws ApiError for a wrong content
 * type (415), an oversized body (413), malformed JSON (400) or data that
 * fails the schema (400, with the offending field).
 */
export async function readJson<S extends z.ZodType>(request: Request, schema: S): Promise<z.output<S>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new ApiError(415, "Request must be sent as JSON.");
  }
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_JSON_BYTES) throw new ApiError(413, "This request is too large.");

  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > MAX_JSON_BYTES) throw new ApiError(413, "This request is too large.");

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new ApiError(400, "Request body must be valid JSON.");
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path.length ? issue.path.join(".") : undefined;
    throw new ApiError(400, issue?.message ?? "Some of the data is invalid.", field);
  }
  return parsed.data;
}

// "Course_slug_key" -> "slug", "AdminUser_email_key" -> "email".
function uniqueFieldFrom(err: Prisma.PrismaClientKnownRequestError): string | undefined {
  const meta = err.meta as
    | { target?: string[] | string; driverAdapterError?: { cause?: { constraint?: { index?: string; fields?: string[] } } } }
    | undefined;
  if (Array.isArray(meta?.target)) return meta.target.join(", ");
  const constraint = meta?.driverAdapterError?.cause?.constraint;
  if (constraint?.fields?.length) return constraint.fields.join(", ");
  const index = constraint?.index;
  if (index) return index.replace(/^[A-Za-z]+_/, "").replace(/_key$/, "").replace(/_/g, ", ");
  return undefined;
}

export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof ApiError) return jsonError(err.status, err.message, err.field);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const field = uniqueFieldFrom(err);
        return jsonError(
          409,
          field ? `Another item already uses this ${field}. Please choose a different one.` : "This item already exists.",
          field,
        );
      }
      case "P2025":
        return jsonError(404, "This item no longer exists. It may have been deleted by someone else — refresh the page.");
      case "P2003":
        return jsonError(409, "This item is still linked to other content, so it can't be changed or removed yet.");
    }
  }

  console.error("[admin api] unhandled error", err);
  return jsonError(500, "Something went wrong on the server. Please try again in a moment.");
}
