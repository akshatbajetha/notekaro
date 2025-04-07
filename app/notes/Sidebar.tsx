"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, File, Loader2 } from "lucide-react";
import Link from "next/link";

interface Note {
  id: string;
  title: string;
  content: string;
}

function Sidebar() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  }, []);

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

      setNotes([...notes, data.note]);
      setSelectedNote({
        id: data.note.id,
        title: data.note.title,
        content: data.note.content,
      });
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <div className="w-60 flex flex-col border-r border-gray-800">
      {/* Search */}
      <div className="p-2">
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 rounded-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-100"
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
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className={`flex items-center space-x-2 px-2 py-1 dark:text-gray-100 text-gray-900 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md cursor-pointer ${
                  selectedNote?.id === note.id ? "bg-pink-500" : ""
                }`}
              >
                <File className="w-4 h-4" />
                <span className="text-sm">{note.title}</span>
              </Link>
            ))
          )}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
