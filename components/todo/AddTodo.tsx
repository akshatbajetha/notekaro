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
import { format, isBefore, set, startOfDay } from "date-fns";
import { useTodoStore } from "@/store/todoStore";

interface AddTodoProps {
  todoListId?: string;
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
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const { addTodoToList, addTodoToSection } = useTodoStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingTodo(true);
    if (title.trim()) {
      handleAddTodo({ title, priority, completed: isCompleted, flag });
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
    priority: number;
    completed: boolean;
    flag: "list" | "section";
    date?: Date;
  }) => {
    try {
      let response;
      if (flag === "list") {
        response = await fetch(`/api/todolists/${todoListId}/todos`, {
          method: "POST",
          body: JSON.stringify({ title, completed, priority, date }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (flag === "section") {
        response = await fetch(
          `/api/todolists/${todoListId}/sections/${sectionId}`,
          {
            method: "POST",
            body: JSON.stringify({ title, completed, priority, date }),
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

      const newTodo = {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        priority: todo.priority,
        todoListId: todo.todoListId ?? undefined,
        sectionId: todo.sectionId ?? undefined,
      };

      // Add todo to appropriate store based on flag
      if (flag === "list") {
        addTodoToList(newTodo);
      } else if (flag === "section" && sectionId) {
        addTodoToSection(newTodo);
      }

      setIsAddingTodo(false);
    } catch (error) {
      console.error("Error adding todo: ", error);
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
            disabled={isAddingTodo || !title.trim()}
            className="h-7 text-xs"
          >
            {isAddingTodo ? <Loader2 className="animate-spin" /> : "Add todo"}
          </Button>
        </div>
      </div>
    </form>
  );
}

/*
Create a single handleAddTodo function that takes title, priority, completed, flag and date (date in the future) as parameters and based on the flag = "list" | "section" send req on appropriate API endpoint and create the todo in the database.  
 */
