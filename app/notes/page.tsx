"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  File,
  Star,
  MessageSquare,
  Image,
  MoreHorizontal,
  Share2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  title: string;
  content: string;
}

function page() {
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

  const handleNoteChange = (noteId: string, newContent: string) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, content: newContent } : note
      )
    );

    // Update the selected note as well to ensure UI consistency
    setSelectedNote((prev) =>
      prev?.id === noteId ? { ...prev, content: newContent } : prev
    );
  };

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
    <div className="flex h-screen dark:bg-[#191919] bg-[#F5F5F5] dark:text-gray-100 text-gray-900">
      {/* Sidebar */}
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
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`flex items-center space-x-2 px-2 py-1 dark:text-gray-100 text-gray-900 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md cursor-pointer ${
                    selectedNote?.id === note.id ? "bg-gray-800" : ""
                  }`}
                >
                  <File className="w-4 h-4" />
                  <span className="text-sm">{note.title}</span>
                </div>
              ))
            )}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Note header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-medium">{selectedNote.title}</h1>
                <Star className="w-4 h-4 dark:text-gray-100 text-gray-900 cursor-pointer hover:text-yellow-500" />
              </div>
              <div className="flex items-center space-x-4 dark:text-gray-100 text-gray-900">
                <MessageSquare className="w-5 h-5 cursor-pointer hover:text-gray-300" />
                <Share2 className="w-5 h-5 cursor-pointer hover:text-gray-300" />
                <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-gray-300" />
              </div>
            </div>

            {/* Note content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-3xl mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 dark:text-gray-100 text-gray-900">
                    <Image className="w-4 h-4" />
                    <span className="text-sm">Add cover</span>
                  </div>
                  <textarea className="text-2xl font-medium w-full h-max bg-transparent border-none focus:outline-none  dark:text-gray-100 text-gray-900 resize-none">
                    {selectedNote.title}
                  </textarea>
                  <textarea
                    className="w-full h-max bg-transparent border-none focus:outline-none text-lg dark:text-gray-100 text-gray-900 resize-none"
                    value={selectedNote.content}
                    onChange={(e) =>
                      handleNoteChange(selectedNote.id, e.target.value)
                    }
                    placeholder="Type '/' for commands"
                    spellCheck="false"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          // Landing page
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-medium">
                Welcome to Your Workspace
              </h2>
              <p className="text-gray-400">
                Select a note from the sidebar or create a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
