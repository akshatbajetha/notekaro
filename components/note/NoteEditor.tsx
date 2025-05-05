import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useNotesStore } from "@/store/noteStore";

export default function NoteEditor({
  noteId,
  noteContent,
}: {
  noteId: string;
  noteContent: string;
}) {
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");

  const { theme } = useTheme();

  const note = useNotesStore((state) =>
    state.notes.find((n) => n.id === noteId)
  );
  const updateNoteContent = useNotesStore((state) => state.updateNoteContent);

  const debouncedSave = useDebouncedCallback(async (blocks: Block[]) => {
    const contentString = JSON.stringify(blocks);
    updateNoteContent(noteId, contentString);
    await fetch(`/api/notes/${noteId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: undefined,
        content: contentString,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, 1000);

  useEffect(() => {
    const content = note?.content ?? noteContent;
    setInitialContent(
      content ? (JSON.parse(content) as PartialBlock[]) : undefined
    );
  }, [noteId, note?.content, noteContent]);

  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  if (editor === undefined) {
    return "Loading content...";
  }

  return (
    <BlockNoteView
      editor={editor}
      data-theming-css-variables-demo
      data-color-scheme={theme === "dark" ? "dark" : "light"}
      onChange={() => {
        debouncedSave(editor.document);
      }}
      className="w-full"
    />
  );
}
