"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import { Loader2 } from "lucide-react";

interface AddSectionProps {
  todoListId: string;
  onCancel: () => void;
}

export default function AddSection({ todoListId, onCancel }: AddSectionProps) {
  const [title, setTitle] = useState("");
  const setSectionsForList = useTodoStore((state) => state.setSectionsForList);
  const sectionsByListId = useTodoStore((state) => state.sectionsByListId);
  const [isAddingSection, setIsAddingSection] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingSection(true);
    if (title.trim()) {
      handleAddSection({ title, todoListId });
      setTitle("");
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

      const newSection = await response.json();
      // Update the store with the new section
      setSectionsForList(todoListId, [
        ...(sectionsByListId[todoListId] || []),
        newSection,
      ]);
    } catch (error) {
      console.error("Error adding section:", error);
    } finally {
      setIsAddingSection(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-2 py-2 space-y-2">
      <Input
        placeholder="Section name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        required={true}
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
          disabled={isAddingSection || !title.trim()}
          className="h-7 text-xs"
        >
          {isAddingSection ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Add section"
          )}
        </Button>
      </div>
    </form>
  );
}
