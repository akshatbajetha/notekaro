"use client";

import AddSection from "@/components/todo/AddSection";
import AddTodo from "@/components/todo/AddTodo";
import SectionComponent from "@/components/todo/SectionComponent";
import TodoComponent from "@/components/todo/TodoComponent";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getSectionsByListId, getTodosByListId } from "@/lib/actions/todo";
import { useTodoStore } from "@/store/todoStore";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

function page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [isAddingTodo, setisAddingTodo] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [todoListTitle, setTodoListTitle] = useState<string | null>(null);

  const getTodoListById = useTodoStore((state) => state.getTodoListById);

  const [sections, setSections] = useState<
    { id: string; title: string }[] | null
  >([]);
  const [todos, setTodos] = useState<
    { id: string; title: string; completed: boolean; priority: number }[] | null
  >([]);

  const getSections = async () => {
    try {
      const response = await fetch(`/api/todos/${id}sections`);
      const sections = await response.json();
      return sections;
    } catch (error) {
      console.error("Error fetching sections: ", error);
      return null;
    }
  };

  const getTodosWithoutSections = async () => {
    try {
      const response = await fetch(`/api/todos/${id}`);
      const todos = await response.json();
      return todos;
    } catch (error) {
      console.error("Error fetching todos: ", error);
      return null;
    }
  };

  const handleAddTodo = async (title: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "POST",
        body: JSON.stringify({ title, completed: false, priority: 4 }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos ? [...prevTodos, newTodo] : [newTodo]
      );
    } catch (error) {
      console.error("Error adding todo: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const sections = await getSections();
      const todos = await getTodosWithoutSections();
      setSections(sections);
      setTodos(todos);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const todoList = getTodoListById(id);
    if (todoList) {
      setTodoListTitle(todoList.title);
    }
  }, [id, getTodoListById]);

  return (
    <div className="px-4 mt-20 py-6 max-w-3xl ">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center text-black dark:text-white">
            <span className="w-4 h-4 rounded-full mr-3 bg-red-500" />
            {todoListTitle ? todoListTitle : <Skeleton className="w-32" />}
          </h1>
        </div>
      </header>

      <Separator className="mb-4" />

      <div className="space-y-6">
        {/* Tasks directly in project (no section) */}
        {todos && todos.length > 0 && (
          <div className="space-y-1">
            {todos.map((todo) => (
              <TodoComponent key={todo.id} todo={todo} />
            ))}
          </div>
        )}

        {/* Sections with their tasks */}
        {sections &&
          sections.map((section) => (
            <SectionComponent
              key={section.id}
              section={section}
              todoListId={id}
            />
          ))}

        {/* Add task form */}
        {isAddingTodo ? (
          <AddTodo
            todoListId={id}
            onAdd={handleAddTodo}
            onCancel={() => setisAddingTodo(false)}
          />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground flex items-center mt-2"
            onClick={() => setisAddingTodo(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add task
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
      </div>
    </div>
  );
}
export default page;

/* TODO: Collapsible sections, basically a section header which contains todos, every section has an add task button, and an add task button at the top, Draggable tasks to reorder or change sections, delete and edit button in front of every todo Option menu in front of section to edit name and delete
      
Every add task can have Date, priority level, and by defaulted completed is false
*/

/* 
TODO: First start with basic things, 
A top add task button,
On click, open a input section and A few dummy buttons Date and Priority below it,
On the bottom right cancel and Add task button
*/
