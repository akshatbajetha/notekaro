"use client";

import React, { useEffect, useState } from "react";

import AddTask from "./AddTodo";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Plus, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import TodoComponent from "./TodoComponent";
import AddTodo from "./AddTodo";

interface Section {
  id: string;
  title: string;
  // todoListId: string;
  // collapsed: boolean;
}

interface SectionProps {
  section: Section;
  todoListId: string;
}

export default function SectionComponent({
  section,
  todoListId,
}: SectionProps) {
  // const {
  //   tasks,
  //   toggleSectionCollapse,
  //   deleteSection,
  //   addTask,
  //   updateSection,
  // } = useTodoist();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(section.title);
  const [collapsed, setCollapsed] = useState(false); // Replace with actual collapsed state
  const [todos, setTodos] = useState<
    | {
        id: string;
        title: string;
        completed: boolean;
        priority: 1 | 2 | 3 | 4;
      }[]
    | null
  >([]);

  const getTodosForSection = async () => {
    try {
      const response = await fetch(
        `/api/todolists/${todoListId}/sections/${section.id}`
      );
      const todos = await response.json();
      return todos;
    } catch (error) {
      console.error("Error fetching section todos: ", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const todos = await getTodosForSection();
      setTodos(todos);
    };

    fetchData();
  });

  // const sectionTasks = tasks
  //   .filter((task) => task.sectionId === section.id)
  //   .sort((a, b) => a.order - b.order);

  // const handleToggleCollapse = () => {
  //   toggleSectionCollapse(section.id);
  // };

  // const handleDeleteSection = () => {
  //   deleteSection(section.id);
  // };

  const handleAddTodo = (title: string) => {
    try {
      fetch(`/api/todolists/${todoListId}/sections/${section.id}`, {
        method: "POST",
        body: JSON.stringify({ title }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error adding todo: ", error);
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleUpdateSectionTitle = () => {
    if (newTitle.trim() && newTitle !== section.title) {
      // Code to update section name in the database
    }
    setIsEditing(false);
  };

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
          onClick={() => setCollapsed(!collapsed)}
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
                // onClick={handleDeleteSection}
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
          {todos &&
            todos.map((todo) => <TodoComponent key={todo.id} todo={todo} />)}

          {/* Add task form */}
          {isAddingTask ? (
            <AddTodo
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
