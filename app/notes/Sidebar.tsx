"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, File, Loader2, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title?: string;
  content?: string;
}

function Sidebar() {
  const pathName = usePathname();
  const id = pathName.split("/")[2];

  const [selectedNote, setSelectedNote] = useState<Note | null>(
    id ? { id } : null
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleDeleteNote = async (noteId: string) => {
    try {
      await fetch(`/api/notes`, {
        method: "DELETE",
        body: JSON.stringify({ noteId }),
      });
      setTimeout(() => {
        setNotes(notes.filter((note) => note.id !== noteId));
        toast({
          title: "Note deleted successfully",
        });
      }, 500);
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        redirect("/notes");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };
  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [notes]);

  const handleCreateNote = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Untitled", content: "" }),
      });

      const data = await response.json();

      setNotes([data.note, ...notes]);
      setSelectedNote({
        id: data.note.id,
        title: data.note.title,
        content: data.note.content,
      });
      redirect(`/notes/${data.note.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <div className="w-60 flex flex-col border-r border-gray-800">
      {/* Search */}
      <div className="p-2">
        <div className="flex items-center space-x-2 px-3 py-1.5 dark:bg-gray-700 bg-gray-300 rounded-md">
          <Search className="w-4 h-4 dark:text-gray-400 text-gray-600 " />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none focus:outline-none text-sm w-full dark:text-gray-400 text-gray-600"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {/* Notes section */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between px-2 py-1 dark:text-gray-100 text-gray-900">
            <span className="text-xs font-medium uppercase">Notes</span>

            <Plus
              onClick={handleCreateNote}
              className="w-4 h-4 hover:bg-gray-800 rounded cursor-pointer"
            />
          </div>
          {isLoading ? (
            <div className="pt-4 flex flex-col gap-y-4 items-start justify-center">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`flex flex-row mb-1 justify-between hover:bg-gray-200 dark:hover:bg-gray-800 items-center rounded-md pr-2 ${
                  selectedNote?.id === note.id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                }`}
              >
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  onClick={() => setSelectedNote(note)}
                  className="flex items-center space-x-2 px-2 py-1 dark:text-gray-100 text-gray-900  cursor-pointer w-full"
                >
                  <File className="w-4 h-4" />
                  <span className="text-sm">{note.title}</span>
                </Link>
                <Trash2Icon
                  onClick={() => handleDeleteNote(note.id)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
            ))
          )}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
