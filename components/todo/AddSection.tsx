"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddSectionProps {
  todoListId: string;
  onCancel: () => void;
}

export default function AddSection({ todoListId, onCancel }: AddSectionProps) {
  const [title, setTitle] = useState("");
  const setSectionsForList = useTodoStore((state) => state.setSectionsForList);
  const sectionsByListId = useTodoStore((state) => state.sectionsByListId);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      // Create a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;

      // Create the optimistic section object
      const optimisticSection = {
        id: tempId,
        title,
        todoListId,
        todos: [],
      };

      // Immediately update the UI with the optimistic section
      setSectionsForList(todoListId, [
        ...(sectionsByListId[todoListId] || []),
        optimisticSection,
      ]);
      toast({
        title: "Section created successfully",
      });

      // Make the API request
      const response = await fetch(`/api/todolists/${todoListId}/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const newSection = await response.json();

      // Replace the optimistic section with the real one
      const currentSections = sectionsByListId[todoListId] || [];
      const updatedSections = currentSections
        .filter((s) => s.id !== tempId)
        .concat({
          ...newSection,
          todos: [],
        });
      setSectionsForList(todoListId, updatedSections);
    } catch (error) {
      console.error("Error adding section:", error);
      // Remove the optimistic section on error
      const currentSections = sectionsByListId[todoListId] || [];
      setSectionsForList(
        todoListId,
        currentSections.filter((s) => !s.id.startsWith("temp-"))
      );
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
          disabled={!title.trim()}
          className="h-7 text-xs"
        >
          Add Section
        </Button>
      </div>
    </form>
  );
}
