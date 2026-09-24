"use client";

import { useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

const initialIds = (length: number) => Array.from({ length }, (_, i) => `row-${i}`);

/**
 * Stable ids for the rows of a controlled list (value/onChange), so drag and
 * drop can follow an item as it moves. Call add/remove/move alongside the
 * matching onChange.
 */
export function useRowIds(length: number) {
  const [ids, setIds] = useState<string[]>(() => initialIds(length));
  const next = useRef(length);
  // If the list was replaced from outside (e.g. the form was reset to a
  // different number of rows), fall back to fresh ids.
  const current = ids.length === length ? ids : initialIds(length);

  return {
    ids: current,
    add() {
      const id = `row-${next.current++}`;
      setIds([...current, id]);
    },
    remove(index: number) {
      setIds(current.filter((_, i) => i !== index));
    },
    move(from: number, to: number) {
      setIds(arrayMove(current, from, to));
    },
  };
}
