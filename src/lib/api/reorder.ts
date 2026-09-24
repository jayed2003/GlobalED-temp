import { z } from "zod";

/**
 * Body of every "save new order" request from a list's Reorder dialog: the
 * ids in their new order. The route writes sortOrder = position.
 */
export const reorderSchema = z.strictObject({
  ids: z.array(z.string().min(1).max(64)).min(1, "Nothing to reorder").max(500),
});
