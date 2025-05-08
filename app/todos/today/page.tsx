"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import TodoComponent from "@/components/todo/TodoComponent";
import { useTodoStore } from "@/store/todoStore";
import { startOfDay, endOfDay, addDays } from "date-fns";
import Link from "next/link";
import { Hash } from "lucide-react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4;
  dueDate: Date;
  todoListId: string;
  sectionId?: string;
  todoList: {
    id: string;
    title: string;
  };
}

function page() {
  const [isLoading, setIsLoading] = useState(true);
  const [todayTodos, setTodayTodos] = useState<Todo[]>([]);
  const { removeTodoFromList, removeTodoFromSection, addCompletedTodo } =
    useTodoStore();

  useEffect(() => {
    const fetchTodayTodos = async () => {
      try {
        const response = await fetch("/api/todolists/today");
        if (!response.ok) throw new Error("Failed to fetch today's todos");
        const data = await response.json();
        // Convert string dates to Date objects
        const todosWithDates = data.map((todo: any) => ({
          ...todo,
          dueDate: new Date(todo.dueDate),
        }));
        setTodayTodos(todosWithDates);
      } catch (error) {
        console.error("Error fetching today's todos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayTodos();
  }, []);

  const handleDeleteTodo = async ({ id: todoId }: { id: string }) => {
    const todoToDelete = todayTodos.find((todo) => todo.id === todoId);

    if (todoToDelete?.todoListId) {
      removeTodoFromList(todoId, todoToDelete.todoListId);
    }
    if (todoToDelete?.sectionId) {
      removeTodoFromSection(todoId, todoToDelete.sectionId);
    }

    try {
      await fetch("/api/todolists", {
        method: "DELETE",
        body: JSON.stringify({ todoId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Remove from local state
      setTodayTodos(todayTodos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

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
      <h1 className="text-2xl font-bold">Today's Tasks</h1>
      <Separator className="my-4" />
      <div className="space-y-2">
        {todayTodos.length > 0 ? (
          todayTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-start w-full"
            >
              <TodoComponent
                todo={todo}
                deleteTodo={() => handleDeleteTodo({ id: todo.id })}
              />
              <Link
                href={`/todos/${todo.todoList.id}`}
                className="bottom-2 right-2 text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors flex items-center"
              >
                <Hash className="w-3 h-3 mr-[2px]" />
                <span>{todo.todoList.title}</span>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No tasks due today
          </p>
        )}
      </div>
    </div>
  );
}

export default page;
