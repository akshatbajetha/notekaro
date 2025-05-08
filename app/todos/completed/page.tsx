"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Link from "next/link";
import { CircleCheckBig, Hash } from "lucide-react";
import { useTodoStore } from "@/store/todoStore";
import { Separator } from "@/components/ui/separator";

export default function CompletedTodosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { completedTodos, setCompletedTodos } = useTodoStore();

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const response = await fetch("/api/todolists/completed");
        if (!response.ok) throw new Error("Failed to fetch completed todos");
        const data = await response.json();
        setCompletedTodos(data);
      } catch (error) {
        console.error("Error fetching completed todos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedTodos();
  }, [completedTodos.length, setCompletedTodos]);

  if (isLoading) {
    return (
      <div className="px-4 mt-20 py-6 max-w-3xl">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-6 w-[60%]" />
              <Skeleton className="h-4 w-[30%]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mt-20 py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Completed Tasks</h1>
      <Separator className="my-4" />
      <div className="space-y-2">
        {completedTodos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
          >
            <div className="flex-1">
              <p className="text-sm text-muted-foreground flex items-center">
                <CircleCheckBig className="w-4 h-4 mr-2 text-green-500" />
                You completed a task: {todo.title}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                {format(new Date(todo.updatedAt), "MMM d, yyyy")}
              </span>
              <Link
                href={`/todos/${todo.todoList.id}`}
                className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors flex items-center"
              >
                <Hash className="w-3 h-3 mr-[2px]" />
                <span>{todo.todoList.title}</span>
              </Link>
            </div>
          </div>
        ))}
        {completedTodos.length === 0 && (
          <p className="text-center text-muted-foreground">
            No completed tasks yet
          </p>
        )}
      </div>
    </div>
  );
}
