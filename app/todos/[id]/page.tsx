"use client";

import AddSection from "@/components/todo/AddSection";
import AddTodo from "@/components/todo/AddTodo";
import SectionComponent from "@/components/todo/SectionComponent";
import TodoComponent from "@/components/todo/TodoComponent";
import { Button } from "@/components/ui/button";
import { getSectionsByListId, getTodosByListId } from "@/lib/actions/todo";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

function page({ params }: { params: { listId: string } }) {
  const { listId } = params;
  const [isAddingTodo, setisAddingTodo] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);

  const [sections, setSections] = useState<
    { id: string; title: string }[] | null
  >([]);
  const [todos, setTodos] = useState<
    { id: string; title: string; completed: boolean; priority: number }[] | null
  >([]);

  const getSections = async () => {
    const sections = await getSectionsByListId(listId);
    return sections;
  };

  const getTodos = async () => {
    const todos = await getTodosByListId(listId);
    return todos;
  };

  useEffect(() => {
    const fetchData = async () => {
      const sections = await getSections();
      const todos = await getTodos();

      setSections(sections);
      setTodos(todos);
    };

    fetchData();
  }, [listId]);

  return (
    <div className="px-4 mt-20 py-6 max-w-3xl ">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="w-4 h-4 rounded-full mr-3 bg-red-500" />
          </h1>
        </div>
      </header>

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
              todoListId={listId}
            />
          ))}

        {/* Add task form */}
        {isAddingTodo ? (
          <AddTodo
            todoListId={listId}
            // onAdd={handleAddTask}
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
            todoListId={listId}
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
