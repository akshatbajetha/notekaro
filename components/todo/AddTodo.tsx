"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Flag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isBefore, startOfDay } from "date-fns";
import { useTodoStore } from "@/store/todoStore";
import type { Todo } from "@/store/todoStore";
import { useToast } from "@/hooks/use-toast";

interface AddTodoProps {
  todoListId: string;
  sectionId?: string;
  flag: "list" | "section";
  onCancel: () => void;
}

export default function AddTodo({
  todoListId,
  sectionId,
  onCancel,
  flag,
}: AddTodoProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(4);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const {
    addTodoToList,
    addTodoToSection,
    todosByListId,
    todosBySectionId,
    setTodosForList,
    setTodosForSection,
  } = useTodoStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      handleAddTodo({ title, priority, completed: isCompleted, flag, date });
      setTitle("");
      setDate(undefined);
      setPriority(4);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleAddTodo = async ({
    title,
    priority,
    completed,
    flag,
    date,
  }: {
    title: string;
    priority: 1 | 2 | 3 | 4;
    completed: boolean;
    flag: "list" | "section";
    date?: Date;
  }) => {
    try {
      // Create a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;

      // Create the optimistic todo object
      const optimisticTodo: Todo = {
        id: tempId,
        title,
        completed,
        priority,
        dueDate: date || null,
        todoListId,
        sectionId: flag === "section" ? sectionId : undefined,
      };

      // Immediately update the UI with the optimistic todo
      if (flag === "list") {
        addTodoToList(optimisticTodo);
        toast({
          title: "Todo created successfully",
        });
      } else if (flag === "section" && sectionId) {
        addTodoToSection(optimisticTodo);
        toast({
          title: "Todo created successfully",
        });
      }

      // Make the API request
      let response;
      if (flag === "list") {
        response = await fetch(`/api/todolists/${todoListId}/todos`, {
          method: "POST",
          body: JSON.stringify({
            title,
            completed,
            priority,
            dueDate: date ? date.toISOString() : null,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (flag === "section" && sectionId) {
        response = await fetch(
          `/api/todolists/${todoListId}/sections/${sectionId}`,
          {
            method: "POST",
            body: JSON.stringify({
              title,
              completed,
              priority,
              dueDate: date ? date.toISOString() : null,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (!response?.ok) {
        throw new Error("No response received while creating todo.");
      }

      const todo = await response.json();

      // Replace the optimistic todo with the real one
      if (flag === "list") {
        // Remove the optimistic todo and add the real one
        const currentTodos = todosByListId[todoListId] || [];
        const updatedTodos = currentTodos
          .filter((t: Todo) => t.id !== tempId)
          .concat({
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
            priority: todo.priority as 1 | 2 | 3 | 4,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
            todoListId: todo.todoListId,
            sectionId: todo.sectionId,
          });
        setTodosForList(todoListId, updatedTodos);
      } else if (flag === "section" && sectionId) {
        // Remove the optimistic todo and add the real one
        const currentTodos = todosBySectionId[sectionId] || [];
        const updatedTodos = currentTodos
          .filter((t: Todo) => t.id !== tempId)
          .concat({
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
            priority: todo.priority as 1 | 2 | 3 | 4,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
            todoListId: todo.todoListId,
            sectionId: todo.sectionId,
          });
        setTodosForSection(sectionId, updatedTodos);
      }
    } catch (error) {
      console.error("Error adding todo: ", error);
      // Remove the optimistic todo on error
      if (flag === "list") {
        const currentTodos = todosByListId[todoListId] || [];
        setTodosForList(
          todoListId,
          currentTodos.filter((t: Todo) => !t.id.startsWith("temp-"))
        );
      } else if (flag === "section" && sectionId) {
        const currentTodos = todosBySectionId[sectionId] || [];
        setTodosForSection(
          sectionId,
          currentTodos.filter((t: Todo) => !t.id.startsWith("temp-"))
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-2 py-1">
      <Input
        placeholder="Todo name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        required={true}
        onKeyDown={handleKeyDown}
        className="text-sm mb-2"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  "text-xs pr-2 h-7",
                  date ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                {date ? format(date, "MMM d") : "Add date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => {
                  const today = startOfDay(new Date());
                  const current = startOfDay(date);
                  return isBefore(current, today);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
              >
                <Flag
                  className={`h-3.5 w-3.5 mr-1 ${
                    priority === 1 ? "text-red-500" : ""
                  } ${priority === 2 ? "text-yellow-500" : ""} ${
                    priority === 3 ? "text-blue-400" : ""
                  } ${priority === 4 ? "text-slate-300" : ""}`}
                />
                P{priority}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div className="grid gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPriority(1)}
                  className="justify-start h-7 text-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  Priority 1 (Urgent)
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPriority(2)}
                  className="justify-start h-7 text-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                  Priority 2 (High)
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPriority(3)}
                  className="justify-start h-7 text-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                  Priority 3 (Medium)
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPriority(4)}
                  className="justify-start h-7 text-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span>
                  Priority 4 (Low)
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2">
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
            Add Todo
          </Button>
        </div>
      </div>
    </form>
  );
}
