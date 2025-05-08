"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  File,
  Loader2,
  Trash2Icon,
  X,
  Hash,
  CalendarCheck,
  CalendarClock,
  CircleCheckBig,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/store/todoStore";
import { CreateTodoListModal } from "@/components/todo/CreateTodoListModal";

function Sidebar({ width }: { width: number }) {
  const pathName = usePathname();
  const id = pathName.split("/")[2];
  const router = useRouter();

  const { todoLists, setTodoLists, selectedTodoListId, setSelectedTodoListId } =
    useTodoStore();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        setSelectedIndex(-1);
      } else if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const searchResults = todoLists.filter((todoList) =>
    todoList.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommandPaletteKeyDown = (e: React.KeyboardEvent) => {
    const searchResultsLength = searchResults.length;

    if (searchResultsLength === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < searchResultsLength - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        const currList = searchResults[selectedIndex];
        if (currList) {
          setSelectedTodoListId(currList.id);
          router.push(`/todos/${currList.id}`);
          setIsCommandPaletteOpen(false);
          setSearchQuery("");
        }
        break;
    }
  };
  const handleDeleteTodoList = async (todoListId: string) => {
    try {
      setTimeout(() => {
        setTodoLists(
          todoLists.filter((todoList) => todoList.id !== todoListId)
        );
        toast({
          title: "Todo List deleted successfully",
        });
      }, 1000);
      if (selectedTodoListId === todoListId) {
        setSelectedTodoListId(null);
        router.push("/todos");
      }
      await fetch(`/api/todolists/${todoListId}`, {
        method: "DELETE",
        body: JSON.stringify({ todoListId }),
      });
    } catch (error) {
      console.error("Error deleting Todo List:", error);
    }
  };
  const fetchTodoLists = async () => {
    try {
      const response = await fetch("/api/todolists");
      const data = await response.json();
      setTodoLists(data);
    } catch (error) {
      console.error("Error fetching TodoLists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoLists();
  }, []);

  useEffect(() => {
    if (id) {
      setSelectedTodoListId(id);
    } else {
      setSelectedTodoListId(null);
    }
  }, [id, setSelectedTodoListId]);

  return (
    <div
      className="w-60 flex flex-col fixed top-0 left-0 h-screen dark:bg-[#1E1E1E] bg-[#F5F5F5] dark:text-gray-100 text-gray-900 shadow-lg"
      style={{
        width: `${width}px`,
        minWidth: "240px",
        maxWidth: "500px",
      }}
    >
      {/* Search */}
      <div className="p-2">
        <div className="flex items-center justify-between space-x-2 px-3 py-1.5 dark:bg-gray-700 bg-gray-300 rounded-md">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="bg-transparent border-none focus:outline-none w-full flex flex-row items-center justify-between"
          >
            <span className=" dark:text-gray-400 text-gray-600 flex flex-row items-center gap-x-2">
              <Search className="w-4 h-4 dark:text-gray-400 text-gray-600 " />
              Search Todo Lists
            </span>
            <span className="extra-small-text whitespace-nowrap dark:text-gray-400 text-gray-600">
              CTRL + K
            </span>
          </button>
        </div>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 dark:text-gray-100 text-gray-900 flex items-start justify-center pt-[20vh] z-50 backdrop-blur-sm">
            <div className="dark:bg-[#191919] bg-[#F5F5F5] rounded-lg shadow-lg w-full max-w-xl">
              <div className="p-4 border-b relative">
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleCommandPaletteKeyDown}
                    placeholder="Search Todo Lists..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsCommandPaletteOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((todoList, index) => (
                      <div
                        key={todoList.id}
                        className={cn(
                          "px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-[#191919] bg-[#F5F5F5] dark:text-gray-100 text-gray-900 cursor-pointer flex items-center space-x-3",
                          index === selectedIndex
                            ? "bg-gray-200 dark:bg-gray-800"
                            : ""
                        )}
                        onClick={() => {
                          setSelectedTodoListId(todoList.id);
                          router.push(`/todos/${todoList.id}`);
                          setIsCommandPaletteOpen(false);
                        }}
                      >
                        {todoList.title}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center dark:text-gray-100 text-gray-900 ">
                    No results found
                  </div>
                )}
              </div>
              <div className="px-4 py-3 border-t text-xs dark:bg-[#191919] bg-[#F5F5F5] dark:text-gray-100 text-gray-900 rounded-b-lg">
                Press ESC to close
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {/* Notes section */}
        <div className="flex flex-col mt-4 gap-y-2">
          <Link
            href={"/todos/today"}
            className="flex items-center justify-start gap-x-2 p-2 dark:text-gray-100 text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
          >
            <CalendarCheck className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Today</span>
          </Link>
          <Link
            href={"/todos/upcoming"}
            className="flex items-center justify-start gap-x-2 p-2 dark:text-gray-100 text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
          >
            <CalendarClock className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Upcoming</span>
          </Link>
          <Link
            href={"/todos/completed"}
            className="flex items-center justify-start gap-x-2 p-2 dark:text-gray-100 text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
          >
            <CircleCheckBig className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Completed</span>
          </Link>
        </div>
        <div className=" mt-4">
          <div className="flex items-center justify-between px-2 py-1 dark:text-gray-100 text-gray-900">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="flex items-center text-xs font-medium uppercase hover:text-foreground"
              aria-label={
                collapsed ? "Expand Todo Lists" : "Collapse Todo Lists"
              }
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" />
              )}
              <span>Todo Lists</span>
            </button>
            <CreateTodoListModal />
          </div>

          {!collapsed && (
            <div className="mt-2 h-[40vh] overflow-y-auto">
              {isLoading ? (
                <div className="pt-4 flex flex-col gap-y-4 items-start justify-center">
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              ) : todoLists.length !== 0 ? (
                todoLists.map((todoList) => (
                  <div
                    key={todoList.id}
                    className={`flex flex-row mb-1 justify-between hover:bg-gray-200 dark:hover:bg-gray-800 items-center rounded-md pr-2 ${
                      selectedTodoListId === todoList.id
                        ? "bg-gray-200 dark:bg-gray-800"
                        : ""
                    }`}
                  >
                    <Link
                      key={todoList.id}
                      title={todoList.title}
                      href={`/todos/${todoList.id}`}
                      onClick={() => setSelectedTodoListId(todoList.id)}
                      className="flex flex-1 overflow-hidden items-center space-x-2 px-2 py-1 dark:text-gray-100 text-gray-900  cursor-pointer"
                    >
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <Hash className="w-4 h-4" />
                      </div>
                      <span className="text-sm truncate block w-full">
                        {todoList.title}
                      </span>
                    </Link>
                    <Trash2Icon
                      onClick={() => handleDeleteTodoList(todoList.id)}
                      className="w-4 h-4 rounded cursor-pointer flex-shrink-0"
                    />
                  </div>
                ))
              ) : (
                <div className="py-2 px-7 ">
                  <p className="text-sm dark:text-gray-300 text-gray-700">
                    No todo lists found
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
