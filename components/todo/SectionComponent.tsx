"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Pencil,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import TodoComponent from "./TodoComponent";
import AddTodo from "./AddTodo";
import { useTodoStore } from "@/store/todoStore";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Section {
  id: string;
  title: string;
  todoListId: string;
}

interface SectionComponentProps {
  section: Section;
  todoListId: string;
}

export default function SectionComponent({
  section,
  todoListId,
}: SectionComponentProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(section.title);
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const {
    sectionsByListId,
    setSectionsForList,
    getTodosBySectionId,
    setTodosForSection,
    removeTodoFromSection,
    removeTodoFromList,
  } = useTodoStore();

  // Fetch todos for this section
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // First check if we have todos in the store
        const existingTodos = getTodosBySectionId(section.id);

        if (existingTodos.length === 0) {
          // If no todos in store, fetch from DB
          const res = await fetch(
            `/api/todolists/${todoListId}/sections/${section.id}`
          );

          if (res.ok) {
            const todos = await res.json();
            // Update store with fetched todos
            setTodosForSection(section.id, todos);
          }
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [section.id, todoListId, getTodosBySectionId, setTodosForSection]);

  // Get todos for this section from the store
  const todosInSection = getTodosBySectionId(section.id);

  // --- Section actions ---

  // Edit section title
  const handleUpdateSectionTitle = async () => {
    if (newTitle.trim() && newTitle !== section.title) {
      setIsUpdating(true);
      try {
        const res = await fetch(
          `/api/todolists/${todoListId}/sections/${section.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({ title: newTitle }),
            headers: { "Content-Type": "application/json" },
          }
        );
        if (res.ok) {
          // Update section in cache
          setSectionsForList(
            todoListId,
            (sectionsByListId[todoListId] || []).map((s) =>
              s.id === section.id ? { ...s, title: newTitle } : s
            )
          );
        }
      } catch (error) {
        console.error("Error updating section title:", error);
      } finally {
        setIsUpdating(false);
      }
    }
    setIsEditing(false);
  };

  // Delete section (and all its todos)
  const handleDeleteSection = async () => {
    try {
      // Remove section from cache
      setTimeout(() => {
        setSectionsForList(
          todoListId,
          (sectionsByListId[todoListId] || []).filter(
            (s) => s.id !== section.id
          )
        );
        // Remove todos in this section from cache
        setTodosForSection(section.id, []);
        toast({
          title: "Section deleted successfully",
        });
      }, 1000);

      await fetch(`/api/todolists/${todoListId}/sections`, {
        method: "DELETE",
        body: JSON.stringify({ sectionId: section.id }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  // --- Todo actions ---

  // Delete a todo in this section
  const handleDeleteTodo = async (todoId: string) => {
    // Remove from both list and section caches
    setTimeout(() => {
      removeTodoFromSection(todoId, section.id);
      removeTodoFromList(todoId, todoListId);
      toast({
        title: "Todo deleted successfully",
      });
    }, 1000);

    try {
      await fetch("/api/todolists", {
        method: "DELETE",
        body: JSON.stringify({ todoId }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  // --- UI ---

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateSectionTitle();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setNewTitle(section.title);
    }
  };

  return (
    <div className="space-y-2">
      <div className="group flex items-center justify-between">
        {/* Section heading with collapse control */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center text-sm font-medium hover:text-foreground text-muted-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" />
          )}

          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateSectionTitle();
              }}
              className="flex items-center"
            >
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                // onBlur={handleUpdateSectionTitle}
                onKeyDown={handleKeyDown}
                autoFocus
                className="h-7 text-sm py-0"
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                }}
                className="ml-2 h-7 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                // onClick={handleUpdateSectionTitle}
                disabled={!newTitle.trim() || isUpdating}
                className="h-7 text-xs bg-foreground text-background"
              >
                {isUpdating ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </form>
          ) : (
            <span>{section.title}</span>
          )}
        </button>

        {/* Section actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-sm"
                aria-label={`Edit ${section.title} section`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleDeleteSection}
                className="p-1 text-muted-foreground hover:text-destructive rounded-sm"
                aria-label={`Delete ${section.title} section`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
      {/* Section tasks */}
      {!collapsed && (
        <div className="pl-6 space-y-1">
          {/* Add task form */}
          {isAddingTask ? (
            <AddTodo
              todoListId={todoListId}
              sectionId={section.id}
              flag="section"
              onCancel={() => setIsAddingTask(false)}
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground flex items-center mt-1"
              onClick={() => setIsAddingTask(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add task
            </Button>
          )}

          {isLoading ? (
            <div className="pt-4 flex flex-col gap-y-4 items-start justify-center">
              <Skeleton className="h-4 w-[75%]" />
            </div>
          ) : (
            todosInSection.map((todo) => (
              <TodoComponent
                key={todo.id}
                todo={todo}
                deleteTodo={() => handleDeleteTodo(todo.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
