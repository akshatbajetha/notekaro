"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import TodoComponent from "@/components/todo/TodoComponent";
import { useTodoStore } from "@/store/todoStore";
import { format, isToday, isTomorrow, addDays } from "date-fns";
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

function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingTodos, setUpcomingTodos] = useState<Todo[]>([]);
  const { removeTodoFromList, removeTodoFromSection } = useTodoStore();

  const fetchUpcomingTodos = async () => {
    try {
      const response = await fetch("/api/todolists/upcoming");
      if (!response.ok) throw new Error("Failed to fetch upcoming todos");
      const data = await response.json();
      // Convert string dates to Date objects
      const todosWithDates = data.map((todo: Todo) => ({
        ...todo,
        dueDate: new Date(todo.dueDate),
      }));
      setUpcomingTodos(todosWithDates);
    } catch (error) {
      console.error("Error fetching upcoming todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingTodos();
  }, []);

  const handleDeleteTodo = async ({ id: todoId }: { id: string }) => {
    const todoToDelete = upcomingTodos.find((todo) => todo.id === todoId);

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
      setUpcomingTodos(upcomingTodos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  // Group todos by date
  const groupedTodos = upcomingTodos.reduce(
    (groups, todo) => {
      const date = todo.dueDate.toISOString().split("T")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(todo);
      return groups;
    },
    {} as Record<string, Todo[]>
  );

  // Sort dates
  const sortedDates = Object.keys(groupedTodos).sort();

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
    <div className="px-4 mt-20 py-6 max-w-3xl md:ml-24 ml-4">
      <h1 className="text-2xl font-bold">Upcoming Tasks</h1>
      <Separator className="my-4" />
      <div className="space-y-6">
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => {
            const todos = groupedTodos[date];
            const dateObj = addDays(new Date(date), 1); // Adjust only the display date
            let dateTitle = format(dateObj, "MMMM d, yyyy");

            if (isToday(dateObj)) {
              dateTitle = "Today";
            } else if (isTomorrow(dateObj)) {
              dateTitle = "Tomorrow";
            }

            return (
              <div key={date} className="space-y-2">
                <h2 className="text-lg font-semibold text-muted-foreground">
                  {dateTitle}
                </h2>
                <div className="space-y-1">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex md:flex-row flex-col md:items-center md:justify-between items-start w-full my-4"
                    >
                      <TodoComponent
                        todo={todo}
                        deleteTodo={() => handleDeleteTodo({ id: todo.id })}
                        onUpdate={() => fetchUpcomingTodos()}
                      />
                      <Link
                        href={`/todos/${todo.todoList.id}`}
                        className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors items-center flex md:my-4 my-2"
                      >
                        <Hash className="w-3 h-3 mr-[2px]" />
                        <span>{todo.todoList.title}</span>
                      </Link>
                      <Separator className="w-full my-2 md:hidden block bg-foreground/20" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-muted-foreground">No upcoming tasks</p>
        )}
      </div>
    </div>
  );
}

export default Page;
