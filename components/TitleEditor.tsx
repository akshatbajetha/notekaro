"use client";

import { useEffect, useState } from "react";

export default function TitleEditor({
  initialTitle,
  noteId,
}: {
  initialTitle: string;
  noteId: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (title !== initialTitle) {
        setIsSaving(true);
        fetch(`/api/notes/${noteId}`, {
          method: "PATCH",
          body: JSON.stringify({ title }),
          headers: { "Content-Type": "application/json" },
        }).then(() => setIsSaving(false));
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, initialTitle, noteId]);

  return (
    <div>
      <input
        className="text-3xl font-bold outline-none bg-transparent w-full h-max py-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* {isSaving && <span className="text-sm text-muted">Saving...</span>} */}
    </div>
  );
}
