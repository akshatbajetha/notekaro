"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddSectionProps {
  todoListId: string;
  onCancel: () => void;
}

export default function AddSection({ todoListId, onCancel }: AddSectionProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      handleAddSection({ title, todoListId });
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleAddSection = async ({
    title,
    todoListId,
  }: {
    title: string;
    todoListId: string;
  }) => {
    try {
      const response = await fetch(`/api/todolists/${todoListId}/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-2 py-2 space-y-2">
      <Input
        placeholder="Section name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        onKeyDown={handleKeyDown}
        className="text-sm"
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-7 text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={!title.trim()}
          className="h-7 text-xs"
        >
          Add section
        </Button>
      </div>
    </form>
  );
}
