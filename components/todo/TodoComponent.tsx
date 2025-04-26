"use client";

import React, { useState } from "react";
// import { useTodoist } from "@/lib/store";
// import { Task, Priority } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Pencil, Trash2, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useDebouncedCallback } from "use-debounce";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4;
};

const priorityColors = {
  1: "bg-red-500 dark:bg-red-600", // Urgent priority
  2: "bg-yellow-500 dark:bg-yellow-600", // High priority
  3: "bg-blue-400 dark:bg-blue-600", // Medium priority
  4: "bg-slate-300 dark:bg-slate-700", // Low priority
};

export default function TodoComponent({ todo }: { todo: Todo }) {
  // const { toggleTaskCompletion, updateTask, deleteTask } = useTodoist();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(todo.priority);
  // const [date, setDate] = useState<Date | undefined>(task.dueDate);

  const handleToggleCompletion = () => {
    todo.completed = !todo.completed;
    setIsCompleted(todo.completed);
    debounceCompletedUpdate(todo.completed);
  };

  const handleDeleteTodo = async () => {
    try {
      await fetch("/api/todolists", {
        method: "DELETE",
        body: JSON.stringify({ todoId: todo.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  const debounceCompletedUpdate = useDebouncedCallback(
    async (completed: boolean) => {
      try {
        await fetch("/api/todolists", {
          method: "PATCH",
          body: JSON.stringify({ todoId: todo.id, title, priority, completed }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error updating todo completion: ", error);
      }
    },
    1000
  );

  const handleUpdateTodo = () => {
    if (title.trim()) {
      setTitle(title.trim());
      // Code to update Todo in the database
      try {
        fetch("/api/todolists", {
          method: "PATCH",
          body: JSON.stringify({
            todoId: todo.id,
            title,
            completed: isCompleted,
            priority,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error updating todo: ", error);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateTodo();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTitle(todo.title);
      // setDate(task.dueDate);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors",
        todo.completed && "opacity-60"
      )}
    >
      <div className="mt-0.5 flex-shrink-0">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggleCompletion}
          className={cn(
            "transition-all duration-200",
            todo.completed && "bg-primary border-primary"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2" onKeyDown={handleKeyDown}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="text-sm py-1"
            />

            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "text-xs pr-2 h-7"
                      // date ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                    {/* {date ? format(date, "MMM d") : "Add date"} */}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    // selected={date}
                    // onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="ml-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      <Flag
                        className={`h-3.5 w-3.5 mr-1 ${
                          priority === 1 ? "text-red-500" : ""
                        } ${priority === 2 ? "text-yellow-500" : ""} ${
                          priority === 3 ? "text-blue-400" : ""
                        } ${priority === 4 ? "text-slate-300" : ""}
                        }`}
                      />
                      P{priority}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <div className="grid gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPriority(1)}
                        className="justify-start h-7 text-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        Priority 1 (Urgent)
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPriority(2)}
                        className="justify-start h-7 text-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                        Priority 2 (High)
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPriority(3)}
                        className="justify-start h-7 text-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                        Priority 3 (Medium)
                      </Button>
                      <Button
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
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setTitle(todo.title);
              }}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleUpdateTodo}
              disabled={!title.trim()}
              className="h-7 text-xs"
            >
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div
                className={cn(
                  "text-sm",
                  isCompleted && "line-through text-muted-foreground"
                )}
              >
                {title}
              </div>

              <div className="flex items-center mt-0.5 space-x-2">
                {todo.priority > 1 && (
                  <span className="flex items-center text-xs text-muted-foreground">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full mr-1",
                        priorityColors[priority as 1 | 2 | 3 | 4]
                      )}
                    ></span>
                    P{priority}
                  </span>
                )}

                {/* {task.dueDate && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(new Date(task.dueDate), "MMM d")}
                  </span>
                )} */}
              </div>
            </div>

            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleDeleteTodo}
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
