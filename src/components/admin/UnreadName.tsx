/** Inbox list name cell: a "New" pill until an admin has opened the item. */
export default function UnreadName({ name, unread }: { name: string; unread: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      {name}
      {unread && (
        <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          New
        </span>
      )}
    </span>
  );
}
