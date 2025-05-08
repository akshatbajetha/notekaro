import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const editorRef = useRef<BlockNoteEditor | null>(null);
  const isInitialMount = useRef(true);

  const { theme } = useTheme();

  const note = useNotesStore((state) =>
    state.notes.find((n) => n.id === noteId)
  );
  const updateNoteContent = useNotesStore((state) => state.updateNoteContent);

  const debouncedSave = useDebouncedCallback(async (blocks: Block[]) => {
    const contentString = JSON.stringify(blocks);
    if (note?.content !== contentString) {
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
    }
  }, 1000);

  useEffect(() => {
    const content = note?.content ?? noteContent;
    if (isInitialMount.current) {
      setInitialContent(
        content
          ? (JSON.parse(content) as PartialBlock[])
          : [
              {
                type: "paragraph",
                content: "",
              },
            ]
      );
      isInitialMount.current = false;
    }
  }, [noteId, note?.content, noteContent]);

  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    if (!editorRef.current) {
      editorRef.current = BlockNoteEditor.create({
        initialContent,
      });
    }
    return editorRef.current;
  }, [initialContent]);

  if (editor === undefined) {
    return "Loading content...";
  }

  return (
    <div className="w-[90%] h-full">
      <style jsx global>{`
        .bn-container {
          border: none !important;
          margin-left: 40px !important;
          box-shadow: none !important;
          background-color: transparent !important;
        }
        .bn-editor {
          padding: 0 !important;
          background-color: transparent !important;
        }
        .bn-content {
          padding: 0 !important;
          background-color: transparent !important;
        }
        .bn-slash-menu {
          background-color: var(--mantine-color-body) !important;
          border: 1px solid var(--mantine-color-gray-3) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        .bn-slash-menu-item {
          padding: 8px 12px !important;
        }
        .bn-slash-menu-item:hover {
          background-color: var(--mantine-color-gray-1) !important;
        }
      `}</style>
      <BlockNoteView
        editor={editor}
        theme={theme === "dark" ? "dark" : "light"}
        className="w-full h-full"
        onChange={() => {
          debouncedSave(editor.document);
        }}
      />
    </div>
  );
}
