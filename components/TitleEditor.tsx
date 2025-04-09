"use client";

import { updateNoteById } from "@/lib/actions/notes";
import { useEffect, useState } from "react";

import { useDebouncedCallback } from "use-debounce";
import { useNotesStore } from "@/store/noteStore";

export default function TitleEditor({
  initialTitle,
  noteId,
}: {
  initialTitle: string;
  noteId: string;
}) {
  const [title, setTitle] = useState(initialTitle);

  const { updateNoteTitle } = useNotesStore();

  const debouncedTitleSave = useDebouncedCallback(async (title: string) => {
    updateNoteTitle(noteId, title);
  }, 100);

  const debouncedSave = useDebouncedCallback(async (title: string) => {
    await updateNoteById({ noteId, title });
  }, 1000);

  useEffect(() => {
    setTitle(initialTitle);
  }, []);

  return (
    <div>
      <input
        className="text-3xl font-bold outline-none bg-transparent w-full h-max py-4"
        value={title}
        onChange={(e) => {
          const newTitle = e.target.value;
          setTitle(newTitle);
          debouncedSave(newTitle);
          debouncedTitleSave(newTitle);
        }}
        placeholder="Untitled"
      />
    </div>
  );
}
