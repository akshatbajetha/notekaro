"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

export default function NoteEditor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  // Renders the editor instance using a React component.
  return <BlockNoteView className="min-h-full min-w-full" editor={editor} />;
}
