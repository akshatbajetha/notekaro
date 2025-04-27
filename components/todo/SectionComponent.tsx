"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Plus, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import TodoComponent from "./TodoComponent";
import AddTodo from "./AddTodo";
import { useTodoStore } from "@/store/todoStore";

interface Section {
  id: string;
  title: string;
  todoListId: string;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4;
  todoListId?: string;
  sectionId?: string;
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

  const {
    sectionsByListId,
    setSectionsForList,
    todosByListId,
    setTodosForList,
    removeTodo,
  } = useTodoStore();

  // Get todos for this section from the cache
  const todosInSection =
    (todosByListId[todoListId] || []).filter(
      (todo) => todo.sectionId === section.id
    ) || [];

  // --- Section actions ---

  // Edit section title
  const handleUpdateSectionTitle = async () => {
    if (newTitle.trim() && newTitle !== section.title) {
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
      }
    }
    setIsEditing(false);
  };

  // Delete section (and all its todos)
  const handleDeleteSection = async () => {
    try {
      // Remove section from cache
      setSectionsForList(
        todoListId,
        (sectionsByListId[todoListId] || []).filter((s) => s.id !== section.id)
      );
      // Remove todos in this section from cache
      setTodosForList(
        todoListId,
        (todosByListId[todoListId] || []).filter(
          (todo) => todo.sectionId !== section.id
        )
      );
      await fetch(`/api/todolists/${todoListId}/sections/${section.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  // --- Todo actions ---

  // Delete a todo in this section
  const handleDeleteTodo = async (todoId: string) => {
    removeTodo(todoId);
    setTodosForList(
      todoListId,
      (todosByListId[todoListId] || []).filter((todo) => todo.id !== todoId)
    );
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
                onBlur={handleUpdateSectionTitle}
                onKeyDown={handleKeyDown}
                autoFocus
                className="h-7 text-sm py-0"
              />
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
          {todosInSection.map((todo) => (
            <TodoComponent
              key={todo.id}
              todo={todo}
              deleteTodo={() => handleDeleteTodo(todo.id)}
            />
          ))}

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
        </div>
      )}
    </div>
  );
}
