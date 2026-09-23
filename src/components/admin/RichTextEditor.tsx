"use client";

import { useRef, useState } from "react";
import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Link2Off,
  ImagePlus,
  TextCursorInput,
  Minus,
  Undo2,
  Redo2,
  Loader2,
} from "lucide-react";
import { adminRequest } from "@/lib/admin-fetch";
import { contentToHtml } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

/**
 * Rich text editor for blog posts (Tiptap). Produces HTML limited to the
 * formatting the toolbar offers; the server sanitizes it again on save
 * (src/lib/sanitize-html.ts), so pasted content can't smuggle anything else in.
 */
export default function RichTextEditor({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  placeholder = "Write your post…",
}: {
  id: string;
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    // Next.js renders on the server first; let the editor mount in the browser.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: {
          openOnClick: false,
          autolink: true,
          protocols: ["http", "https", "mailto"],
          HTMLAttributes: { rel: "noopener noreferrer nofollow" },
        },
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
    ],
    // Posts written before the editor existed are plain text.
    content: contentToHtml(value),
    editorProps: {
      attributes: {
        id,
        class: "prose prose-neutral max-w-none min-h-72 px-4 py-3 focus:outline-none",
        "aria-label": "Post content",
        "aria-multiline": "true",
        role: "textbox",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
    onBlur: () => onBlur?.(),
  });

  const insertImage = async (file: File) => {
    if (!editor) return;
    setUploading(true);
    setImageError(null);
    const formData = new FormData();
    formData.append("file", file);
    const result = await adminRequest<{ url: string }>("/api/admin/upload", { formData });
    setUploading(false);
    if (!result.ok) return setImageError(result.message);
    const alt = window.prompt("Describe the image for screen readers (alt text):", "") ?? "";
    editor.chain().focus().setImage({ src: result.data.url, alt: alt.trim() }).run();
  };

  const setLink = () => {
    if (!editor) return;
    const previous = (editor.getAttributes("link").href as string | undefined) ?? "https://";
    const url = window.prompt("Link address (https://…, mailto:… or /page):", previous);
    if (url === null) return;
    const trimmed = url.trim();
    if (!trimmed || trimmed === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    if (!/^(https?:\/\/|mailto:|\/(?!\/))/i.test(trimmed)) {
      window.alert("Links must start with https://, http://, mailto: or / (a page on this site).");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-white focus-within:ring-2 focus-within:ring-primary-100",
        invalid ? "border-red-400" : "border-neutral-300 focus-within:border-primary-500",
      )}
    >
      {editor && (
        <Toolbar
          editor={editor}
          uploading={uploading}
          onLink={setLink}
          onImage={() => fileInput.current?.click()}
        />
      )}
      <EditorContent editor={editor} />
      {!editor && <div className="min-h-72 px-4 py-3 text-sm text-neutral-400">Loading editor…</div>}
      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void insertImage(file);
          e.target.value = "";
        }}
      />
      {imageError && <p className="border-t border-neutral-200 px-4 py-2 text-xs font-medium text-red-600">{imageError}</p>}
    </div>
  );
}

function Toolbar({
  editor,
  uploading,
  onLink,
  onImage,
}: {
  editor: Editor;
  uploading: boolean;
  onLink: () => void;
  onImage: () => void;
}) {
  // Re-render the toolbar when the selection's formatting changes.
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      image: e.isActive("image"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();
  const buttons: { label: string; icon: typeof Bold; active?: boolean; disabled?: boolean; run: () => void }[][] = [
    [
      { label: "Heading", icon: Heading2, active: state.h2, run: () => chain().toggleHeading({ level: 2 }).run() },
      { label: "Subheading", icon: Heading3, active: state.h3, run: () => chain().toggleHeading({ level: 3 }).run() },
    ],
    [
      { label: "Bold", icon: Bold, active: state.bold, run: () => chain().toggleBold().run() },
      { label: "Italic", icon: Italic, active: state.italic, run: () => chain().toggleItalic().run() },
      { label: "Underline", icon: UnderlineIcon, active: state.underline, run: () => chain().toggleUnderline().run() },
      { label: "Strikethrough", icon: Strikethrough, active: state.strike, run: () => chain().toggleStrike().run() },
    ],
    [
      { label: "Bulleted list", icon: List, active: state.bullet, run: () => chain().toggleBulletList().run() },
      { label: "Numbered list", icon: ListOrdered, active: state.ordered, run: () => chain().toggleOrderedList().run() },
      { label: "Quote", icon: Quote, active: state.quote, run: () => chain().toggleBlockquote().run() },
      { label: "Divider", icon: Minus, run: () => chain().setHorizontalRule().run() },
    ],
    [
      { label: state.link ? "Edit link" : "Add link", icon: Link2, active: state.link, run: onLink },
      {
        label: "Remove link",
        icon: Link2Off,
        disabled: !state.link,
        run: () => chain().extendMarkRange("link").unsetLink().run(),
      },
      { label: "Insert image", icon: uploading ? Loader2 : ImagePlus, disabled: uploading, run: onImage },
      {
        label: "Image alt text",
        icon: TextCursorInput,
        disabled: !state.image,
        run: () => {
          const current = (editor.getAttributes("image").alt as string | undefined) ?? "";
          const next = window.prompt("Describe the selected image for screen readers (alt text):", current);
          if (next !== null) chain().updateAttributes("image", { alt: next.trim() }).run();
        },
      },
    ],
    [
      { label: "Undo", icon: Undo2, disabled: !state.canUndo, run: () => chain().undo().run() },
      { label: "Redo", icon: Redo2, disabled: !state.canRedo, run: () => chain().redo().run() },
    ],
  ];

  return (
    <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 p-1.5">
      {buttons.map((group, gi) => (
        <div key={gi} className="flex items-center gap-0.5 border-r border-neutral-200 pr-1 last:border-r-0">
          {group.map((b) => (
            <button
              key={b.label}
              type="button"
              title={b.label}
              aria-label={b.label}
              aria-pressed={b.active ?? undefined}
              disabled={b.disabled}
              // Keep focus (and the text selection) in the editor on mouse
              // clicks, so typing continues straight after pressing a button.
              onMouseDown={(e) => e.preventDefault()}
              onClick={b.run}
              className={cn(
                "rounded-md p-1.5 text-neutral-600 transition-colors hover:bg-white hover:text-primary-900 disabled:cursor-not-allowed disabled:opacity-40",
                b.active && "bg-primary-100 text-primary-900 hover:bg-primary-100",
              )}
            >
              <b.icon size={17} aria-hidden className={b.icon === Loader2 ? "animate-spin" : undefined} />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
