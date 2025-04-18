"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, File, Loader2, Trash2Icon, X, Hash } from "lucide-react";
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

  const [selectedListId, setSelectedListId] = useState<string | null>(
    id ? id : null
  );
  const { todoLists, setTodoList } = useTodoStore();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
          setSelectedListId(currList.id);
          router.push(`/todos/${currList.id}`);
          setIsCommandPaletteOpen(false);
          setSearchQuery("");
        }
        break;
    }
  };
  const handleDeleteTodoList = async (todoListId: string) => {
    try {
      await fetch(`/api/todos`, {
        method: "DELETE",
        body: JSON.stringify({ todoListId }),
      });
      setTimeout(() => {
        setTodoList(todoLists.filter((todoList) => todoList.id !== todoListId));
        toast({
          title: "Todo List deleted successfully",
        });
      }, 500);
      if (selectedListId === todoListId) {
        setSelectedListId(null);
        router.push("/todos");
      }
    } catch (error) {
      console.error("Error deleting Todo List:", error);
    }
  };
  const fetchTodoLists = async () => {
    try {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodoList(data);
    } catch (error) {
      console.error("Error fetching TodoLists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoLists();
  }, []);

  return (
    <div
      className="w-60 flex flex-col"
      style={{
        width: `${width}px`,
        minWidth: "240px",
        maxWidth: "600px",
      }}
    >
      {/* Search */}
      <div className="p-2">
        <div className="flex items-center justify-between space-x-2 px-3 py-1.5 dark:bg-gray-700 bg-gray-300 rounded-md">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="bg-transparent border-none focus:outline-none w-full flex flex-row items-center justify-between"
          >
            <span className=" dark:text-gray-400 text-gray-600 flex flex-row text-sm items-center gap-x-2">
              <Search className="w-4 h-4 dark:text-gray-400 text-gray-600 " />
              Search TodoLists
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
                          setSelectedListId(todoList.id);
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
        <div className="px-3 py-2">
          <div className="flex items-center justify-between pb-2 dark:text-gray-100 text-gray-900">
            <span className="text-xs font-medium uppercase">Todo Lists</span>
            <CreateTodoListModal />
          </div>
          {isLoading ? (
            <div className="pt-4 flex flex-col gap-y-4 items-start justify-center">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : todoLists.length !== 0 ? (
            todoLists.map((todoList) => (
              <div
                key={todoList.id}
                className={`flex flex-row mb-1 justify-between hover:bg-gray-200 dark:hover:bg-gray-800 items-center rounded-md pr-2 ${
                  selectedListId === todoList.id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                }`}
              >
                <Link
                  key={todoList.id}
                  href={`/todos/${todoList.id}`}
                  onClick={() => setSelectedListId(todoList.id)}
                  className="flex items-center space-x-2 px-2 py-1 dark:text-gray-100 text-gray-900  cursor-pointer w-full"
                >
                  <Hash className="w-4 h-4" />
                  <span className="text-sm">{todoList.title}</span>
                </Link>
                <Trash2Icon
                  onClick={() => handleDeleteTodoList(todoList.id)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
            ))
          ) : (
            <div className="pt-4 flex flex-col gap-y-4 items-start justify-center">
              <p className="text-sm dark:text-gray-300 text-gray-700">
                No todo lists found
              </p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
