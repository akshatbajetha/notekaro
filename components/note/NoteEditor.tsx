import { updateNoteById } from "@/lib/actions/notes";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

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

  const debouncedSave = useDebouncedCallback(async (blocks: Block[]) => {
    await updateNoteById({ noteId, content: JSON.stringify(blocks) });
  }, 1000);

  async function loadContent() {
    const content = noteContent;
    return content ? (JSON.parse(content) as PartialBlock[]) : undefined;
  }

  // Loads the previously stored editor contents.
  useEffect(() => {
    loadContent().then((content) => {
      setInitialContent(content);
    });
  }, []);

  // Creates a new editor instance.
  // We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
  // can delay the creation of the editor until the initial content is loaded.
  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  if (editor === undefined) {
    return "Loading content...";
  }

  // Renders the editor instance.
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
