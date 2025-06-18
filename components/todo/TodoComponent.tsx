"use client";

import React, { useRef, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Pencil, Trash2, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isBefore, startOfDay } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useTodoStore } from "@/store/todoStore";
import { useToast } from "@/hooks/use-toast";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4;
  dueDate: Date | null;
  todoListId: string;
  sectionId?: string;
};

const priorityColors = {
  1: "bg-red-500 dark:bg-red-600", // Urgent priority
  2: "bg-yellow-500 dark:bg-yellow-600", // High priority
  3: "bg-blue-400 dark:bg-blue-600", // Medium priority
  4: "bg-slate-300 dark:bg-slate-700", // Low priority
};

export default function TodoComponent({
  todo,
  deleteTodo,
  onUpdate,
}: {
  todo: Todo;
  deleteTodo: (id: string) => void;
  onUpdate?: () => void;
}) {
  // const { toggleTaskCompletion, updateTask, deleteTask } = useTodoist();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(todo.priority);
  const [date, setDate] = useState<Date | null | undefined>(todo.dueDate);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast, dismiss } = useToast();
  const toastTimeoutRef = useRef<NodeJS.Timeout>();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Update local state when todo changes
  useEffect(() => {
    setTitle(todo.title);
    setIsCompleted(todo.completed);
    setPriority(todo.priority);
    setDate(todo.dueDate);
  }, [todo]);

  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio("/todo-completed.mp3");
    // Preload the audio
    audioRef.current.load();
  }, []);

  const {
    updateTodoInList,
    updateTodoInSection,
    addCompletedTodo,
    removeCompletedTodo,
    addTodoToList,
    addTodoToSection,
    removeTodoFromList,
    removeTodoFromSection,
  } = useTodoStore();

  // Replace useDebouncedCallback with a manual implementation
  const updateCompletionStatus = async (completed: boolean) => {
    try {
      await fetch("/api/todolists", {
        method: "PATCH",
        body: JSON.stringify({
          todoId: todo.id,
          title,
          priority,
          completed,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating todo completion: ", error);
      // Revert the optimistic update on error
      if (todo.todoListId) {
        updateTodoInList(todo.id, todo.todoListId, {
          completed: !completed,
        });
      }
      if (todo.sectionId) {
        updateTodoInSection(todo.id, todo.sectionId, {
          completed: !completed,
        });
      }
      // Revert completed todos store
      if (completed) {
        removeCompletedTodo(todo.id);
      } else {
        const completedTodo = {
          ...todo,
          completed: true,
          updatedAt: new Date(),
          todoList: {
            id: todo.todoListId || "",
            title: "Todo List",
          },
        };
        addCompletedTodo(completedTodo);
      }
      setIsCompleted(!completed);
    }
  };

  const debounceCompletedUpdate = (completed: boolean) => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      updateCompletionStatus(completed);
    }, 2000);
  };

  const handleToggleCompletion = () => {
    const newCompleted = !todo.completed;
    todo.completed = newCompleted;
    setIsCompleted(newCompleted);

    // Play sound when checking the todo
    if (newCompleted && audioRef.current) {
      // Reset the audio to the beginning
      audioRef.current.currentTime = 0;
      // Play the sound
      audioRef.current.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }

    // Show toast with undo button
    const { id } = toast({
      title: "Task Completed! 🎉",
      description: "1 task completed",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Undo the completion
            todo.completed = false;
            setIsCompleted(false);

            // Restore todo to its original location
            if (todo.sectionId) {
              addTodoToSection(todo);
            } else if (todo.todoListId) {
              addTodoToList(todo);
            }

            // Remove from completed todos
            removeCompletedTodo(todo.id);

            // Cancel the debounced update
            if (debounceTimeoutRef.current) {
              clearTimeout(debounceTimeoutRef.current);
            }

            // Dismiss the toast
            dismiss(id);
          }}
        >
          Undo
        </Button>
      ),
    });

    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    // Set timeout to dismiss toast after 3 seconds
    toastTimeoutRef.current = setTimeout(() => {
      dismiss(id);
    }, 2000);

    // Update in store immediately
    if (newCompleted) {
      // Remove from original location
      if (todo.sectionId) {
        removeTodoFromSection(todo.id, todo.sectionId);
      } else if (todo.todoListId) {
        removeTodoFromList(todo.id, todo.todoListId);
      }

      // Add to completed todos
      const completedTodo = {
        ...todo,
        completed: true,
        updatedAt: new Date(),
        todoList: {
          id: todo.todoListId,
          title: "Todo List", // You might want to get this from the store
        },
      };
      addCompletedTodo(completedTodo);
    } else {
      // Restore to original location
      if (todo.sectionId) {
        addTodoToSection(todo);
      } else if (todo.todoListId) {
        addTodoToList(todo);
      }
      // Remove from completed todos
      removeCompletedTodo(todo.id);
    }

    debounceCompletedUpdate(newCompleted);
  };

  const handleUpdateTodo = async () => {
    if (!title.trim()) return;

    const updatedTodo = {
      ...todo,
      title: title.trim(),
      priority,
      dueDate: date,
    };

    // Optimistically update the UI
    setIsEditing(false);
    setTitle(title.trim());

    try {
      // Update in store immediately for better UX
      if (todo.sectionId) {
        updateTodoInSection(todo.id, todo.sectionId, updatedTodo);
      } else if (todo.todoListId) {
        updateTodoInList(todo.id, todo.todoListId, updatedTodo);
      }

      // Make API call
      const response = await fetch("/api/todolists", {
        method: "PATCH",
        body: JSON.stringify({
          todoId: todo.id,
          title: title.trim(),
          completed: isCompleted,
          priority,
          dueDate: date instanceof Date ? date.toISOString() : null,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      // Show success toast after API call succeeds
      toast({
        title: "Todo updated successfully",
      });

      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating todo: ", error);

      // Revert the store update on error
      if (todo.sectionId) {
        updateTodoInSection(todo.id, todo.sectionId, todo);
      } else if (todo.todoListId) {
        updateTodoInList(todo.id, todo.todoListId, todo);
      }

      // Revert the UI state
      setTitle(todo.title);
      setPriority(todo.priority);
      setDate(todo.dueDate);
      setIsEditing(true);

      // Show error toast
      toast({
        title: "Failed to update todo",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateTodo();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTitle(todo.title);
      setDate(todo.dueDate);
    }
  };

  return (
    <div
      className={cn(
        "flex-1 group flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors w-full",
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
                    selected={date ?? undefined}
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
              className="h-7 text-xs bg-foreground text-background"
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

              <div className="flex items-center mt-0.5 space-x-4">
                {todo.dueDate && (
                  <span className="text-xs text-foreground/75 flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(new Date(todo.dueDate), "MMM d")}
                  </span>
                )}

                <span className="flex items-center text-xs text-foreground/75">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full mr-1",
                      priorityColors[priority as 1 | 2 | 3 | 4]
                    )}
                  ></span>
                  P{priority}
                </span>
              </div>
            </div>

            <div className="flex md:opacity-0 md:group-hover:opacity-100 md:transition-opacity opacity-100">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5 " />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => deleteTodo(todo.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
