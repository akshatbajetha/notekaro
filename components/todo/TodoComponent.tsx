"use client";

import React, { useState } from "react";
// import { useTodoist } from "@/lib/store";
// import { Task, Priority } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Pencil, Trash2, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
};

interface TodoProps {
  todo: Todo;
}

const priorityColors = {
  1: "bg-red-500 dark:bg-red-600", // Urgent priority
  2: "bg-yellow-500 dark:bg-yellow-600", // High priority
  3: "bg-blue-400 dark:bg-blue-600", // Medium priority
  4: "bg-slate-300 dark:bg-slate-700", // Low priority
};

export default function TodoComponent({ todo }: TodoProps) {
  // const { toggleTaskCompletion, updateTask, deleteTask } = useTodoist();
  const [isEditing, setIsEditing] = useState(false);
  // const [content, setContent] = useState(task.content);
  // const [date, setDate] = useState<Date | undefined>(task.dueDate);

  // const handleToggleCompletion = () => {
  //   toggleTaskCompletion(task.id);
  // };

  // const handleDeleteTask = () => {
  //   deleteTask(task.id);
  // };

  // const handleUpdateTask = () => {
  //   if (content.trim()) {
  //     updateTask(task.id, {
  //       content: content.trim(),
  //       dueDate: date,
  //     });
  //   }
  //   setIsEditing(false);
  // };

  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter") {
  //     handleUpdateTask();
  //   } else if (e.key === "Escape") {
  //     setIsEditing(false);
  //     setContent(task.content);
  //     setDate(task.dueDate);
  //   }
  // };

  // const handlePriorityChange = (priority: Priority) => {
  //   updateTask(task.id, { priority });
  // };

  return (
    <div
      className={cn(
        "group flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors",
        todo.completed && "opacity-60"
      )}
    >
      <div className="mt-0.5 flex-shrink-0">
        <Checkbox
          checked={todo.completed}
          // onCheckedChange={handleToggleCompletion}
          className={cn(
            "transition-all duration-200",
            todo.completed && "bg-primary border-primary"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              // value={content}
              // onChange={(e) => setContent(e.target.value)}
              // onBlur={handleUpdateTask}
              // onKeyDown={handleKeyDown}
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
                      <Flag className="h-3.5 w-3.5 mr-1" />P{todo.priority}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <div className="grid gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => handlePriorityChange(4)}
                        className="justify-start h-7 text-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        Priority 1 (Urgent)
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => handlePriorityChange(3)}
                        className="justify-start h-7 text-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                        Priority 2 (High)
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => handlePriorityChange(2)}
                        className="justify-start h-7 text-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                        Priority 3 (Medium)
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => handlePriorityChange(1)}
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
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div
                className={cn(
                  "text-sm",
                  todo.completed && "line-through text-muted-foreground"
                )}
              >
                {todo.title}
              </div>

              <div className="flex items-center mt-0.5 space-x-2">
                {todo.priority > 1 && (
                  <span className="flex items-center text-xs text-muted-foreground">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full mr-1",
                        priorityColors[todo.priority as 1 | 2 | 3 | 4]
                      )}
                    ></span>
                    P{todo.priority}
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
                // onClick={handleDeleteTask}
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
