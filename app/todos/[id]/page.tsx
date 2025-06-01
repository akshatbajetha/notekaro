"use client";

import AddSection from "@/components/todo/AddSection";
import AddTodo from "@/components/todo/AddTodo";
import SectionComponent from "@/components/todo/SectionComponent";
import TodoComponent from "@/components/todo/TodoComponent";
import TodoListTitleEditor from "@/components/todo/TodoListTitleEditor";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodoStore } from "@/store/todoStore";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [isAddingTodo, setisAddingTodo] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [todoListTitle, setTodoListTitle] = useState<string>("");
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [isLoadingTitle, setIsLoadingTitle] = useState(true);

  const {
    getTodoListById,
    removeTodoFromList,
    removeTodoFromSection,
    todosByListId,
    setTodosForList,
    sectionsByListId,
    setSectionsForList,
  } = useTodoStore();

  const todosInCurrentList = todosByListId[id] || [];
  const sectionsInCurrentList = sectionsByListId[id] || [];

  // Fetch and cache todos and sections only if not already cached
  useEffect(() => {
    let ignore = false;
    if (!todosByListId[id]) {
      setIsLoadingTodos(true);
      fetch(`/api/todolists/${id}/todos`)
        .then((res) => res.json())
        .then((todos) => {
          if (!ignore) {
            setTodosForList(id, todos);
            setIsLoadingTodos(false);
          }
        });
    } else {
      setIsLoadingTodos(false);
    }
    if (!sectionsByListId[id]) {
      setIsLoadingSections(true);
      fetch(`/api/todolists/${id}/sections`)
        .then((res) => res.json())
        .then((sections) => {
          if (!ignore) {
            setSectionsForList(id, sections);
            setIsLoadingSections(false);
          }
        });
    } else {
      setIsLoadingSections(false);
    }
    return () => {
      ignore = true;
    };
  }, [
    id,
    todosByListId,
    sectionsByListId,
    setTodosForList,
    setSectionsForList,
  ]);

  // Fetch the todo list title
  useEffect(() => {
    const todoList = getTodoListById(id);
    if (todoList) {
      setTodoListTitle(todoList.title);
      setIsLoadingTitle(false);
    } else {
      const fetchTodoList = async () => {
        try {
          const response = await fetch(`/api/todolists/${id}`);
          if (!response.ok) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access this todo list",
              variant: "destructive",
            });
            router.push("/todos");
            return;
          }
          const todoList = await response.json();
          if (!todoList) {
            toast({
              title: "Not Found",
              description: "This todo list doesn't exist",
              variant: "destructive",
            });
            router.push("/todos");
            return;
          }
          setTodoListTitle(todoList.title);
        } catch (error) {
          console.error("Error fetching todo list: ", error);
          toast({
            title: "Error",
            description: "Failed to load the todo list",
            variant: "destructive",
          });
          router.push("/todos");
        } finally {
          setIsLoadingTitle(false);
        }
      };
      fetchTodoList();
    }
  }, [id, getTodoListById]);

  // When deleting, update the cache for the current list
  const handleDeleteTodo = async ({ id: todoId }: { id: string }) => {
    // Find the todo to get its sectionId
    const todoToDelete = todosInCurrentList.find((todo) => todo.id === todoId);

    // Remove from list cache
    removeTodoFromList(todoId, id);

    // If the todo belongs to a section, remove it from section cache
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
    } catch (error) {
      console.error("Error deleting todo: ", error);
      // Optionally: restore the todo in cache if error
    }
  };

  return (
    <div className="px-4 mt-20 py-6 max-w-3xl md:ml-24 ml-4">
      <header className="mt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center text-black dark:text-white">
            {isLoadingTitle ? (
              <Skeleton className="w-32 text-gray-700 dark:text-gray-300" />
            ) : (
              <TodoListTitleEditor
                initialTitle={todoListTitle}
                todoListId={id}
              />
            )}
          </h1>
        </div>
      </header>

      <Separator className="mb-4" />

      <div className="space-y-6">
        {/* Tasks directly in project (no section) */}
        {/* Add task form */}
        {isAddingTodo ? (
          <AddTodo
            todoListId={id}
            flag="list"
            onCancel={() => setisAddingTodo(false)}
          />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground flex items-center mt-2"
            onClick={() => setisAddingTodo(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add todo
          </Button>
        )}

        {/* Add section button */}
        {isAddingSection ? (
          <AddSection
            todoListId={id}
            onCancel={() => setIsAddingSection(false)}
          />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground flex items-center mt-4"
            onClick={() => setIsAddingSection(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add section
          </Button>
        )}

        {isLoadingTodos ? (
          <div className="pt-4 flex flex-col gap-y-4 items-start justify-center">
            <Skeleton className="h-4 w-[75%]" />
          </div>
        ) : (
          todosInCurrentList &&
          todosInCurrentList.length > 0 && (
            <div className="space-y-1">
              {todosInCurrentList.map((todo) => (
                <TodoComponent
                  key={todo.id}
                  todo={todo}
                  deleteTodo={() => handleDeleteTodo({ id: todo.id })}
                />
              ))}
            </div>
          )
        )}

        {/* Sections with their tasks */}
        {isLoadingSections ? (
          <div className="pt-4 flex flex-col gap-y-4 items-start justify-center">
            <Skeleton className="h-4 w-[75%]" />
          </div>
        ) : (
          sectionsInCurrentList &&
          sectionsInCurrentList.map((section) => (
            <SectionComponent
              key={section.id}
              section={section}
              todoListId={id}
            />
          ))
        )}
      </div>
    </div>
  );
}
export default Page;
