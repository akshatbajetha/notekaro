"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, File, Trash2Icon, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useNotesStore } from "@/store/noteStore";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MobileNav } from "@/components/mobile-nav";

interface Note {
  id: string;
  title?: string;
  content?: string;
}

interface SidebarProps {
  width: number;
  isMobile: boolean;
  onClose: () => void;
}

function Sidebar({ width, isMobile, onClose }: SidebarProps) {
  const pathName = usePathname();
  const id = pathName.split("/")[2];
  const router = useRouter();

  const [selectedNote, setSelectedNote] = useState<Note | null>(
    id ? { id } : null
  );
  const { notes, setNotes } = useNotesStore();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
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

  const searchResults = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
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
        const currNote = searchResults[selectedIndex];
        if (currNote) {
          setSelectedNote(currNote);
          router.push(`/notes/${currNote.id}`);
          setIsCommandPaletteOpen(false);
          setSearchQuery("");
        }
        break;
    }
  };
  const handleDeleteNote = async (noteId: string) => {
    try {
      setTimeout(() => {
        setNotes(notes.filter((note) => note.id !== noteId));
        toast({
          title: "Note deleted successfully",
        });
      }, 1000);
      await fetch(`/api/notes`, {
        method: "DELETE",
        body: JSON.stringify({ noteId }),
      });

      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        router.push("/notes");
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
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

      setNotes([data.note, ...notes]);
      setSelectedNote({
        id: data.note.id,
        title: data.note.title,
        content: data.note.content,
      });
      router.push(`/notes/${data.note.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col fixed top-0 left-0 h-screen dark:bg-[#1E1E1E] bg-[#F5F5F5] dark:text-gray-100 text-gray-900 shadow-lg ",
        isMobile && "w-full max-w-[300px] z-50"
      )}
      style={{
        width: isMobile ? "100%" : `${width}px`,
        maxWidth: isMobile ? "300px" : "500px",
        opacity: width === 0 ? 0 : 1,
        visibility: width === 0 ? "hidden" : "visible",
        transform: isMobile
          ? `translateX(${width === 0 ? "-100%" : "0"})`
          : "none",
      }}
    >
      {/* Search */}
      <div className="p-2">
        {isMobile && (
          <div className="flex justify-between items-center rounded-md">
            <MobileNav />
            <button onClick={onClose} className="p-2 z-50 rounded-md">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex items-center justify-between space-x-2 py-1.5 rounded-md">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="rounded-md bg-transparent hover:bg-foreground/20 dark:hover:bg-foreground/10 focus:outline-none w-full p-2 flex flex-row items-center justify-between"
          >
            <span className="text-sm dark:text-gray-400 text-gray-600 flex flex-row items-center gap-x-2">
              <Search className="w-4 h-4 dark:text-gray-400 text-gray-600 " />
              Search
            </span>
            <span className="extra-small-text whitespace-nowrap dark:text-gray-400 text-gray-600">
              CTRL + K
            </span>
          </button>
        </div>
        <Dialog
          open={isCommandPaletteOpen}
          onOpenChange={setIsCommandPaletteOpen}
        >
          <DialogContent className="p-0 bg-transparent shadow-none border-none max-w-xl w-full">
            <div className="dark:bg-[#191919] bg-[#F5F5F5] rounded-lg shadow-lg w-full">
              <div className="p-4 border-b relative">
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleCommandPaletteKeyDown}
                    placeholder="Search Notes..."
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
                    {searchResults.map((note, index) => (
                      <div
                        key={note.id}
                        className={cn(
                          "px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-[#191919] bg-[#F5F5F5] dark:text-gray-100 text-gray-900 cursor-pointer flex items-center space-x-3",
                          index === selectedIndex
                            ? "bg-gray-200 dark:bg-gray-800"
                            : ""
                        )}
                        onClick={() => {
                          setSelectedNote(note);
                          router.push(`/notes/${note.id}`);
                          setIsCommandPaletteOpen(false);
                        }}
                      >
                        {note.title}
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
          </DialogContent>
        </Dialog>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col">
        {/* Notes section */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between px-2 py-1 dark:text-gray-100 text-gray-900">
            <span className="text-xs font-medium uppercase">Notes</span>

            <Plus
              onClick={handleCreateNote}
              className="w-4 h-4 hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer"
            />
          </div>
          <div className="mt-2 h-[calc(100vh-120px)] overflow-y-auto">
            {isLoading ? (
              <div className="pt-4 flex flex-col gap-y-4 items-start justify-center">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : notes.length !== 0 ? (
              notes.map((note) => (
                <div
                  key={note.id}
                  className={`flex flex-row mb-1 justify-between hover:bg-foreground/20 dark:hover:bg-foreground/10 items-center rounded-md pr-2 ${
                    selectedNote?.id === note.id
                      ? "bg-foreground/20 dark:bg-foreground/10"
                      : ""
                  }`}
                >
                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    onClick={() => setSelectedNote(note)}
                    className="flex items-center space-x-2 px-2 py-1 dark:text-gray-100 text-gray-900 cursor-pointer flex-1 min-w-0"
                  >
                    <File className="w-4 h-4 flex-shrink-0" />
                    <span title={note.title} className="text-sm truncate">
                      {note.title}
                    </span>
                  </Link>
                  <Trash2Icon
                    onClick={() => handleDeleteNote(note.id)}
                    className="w-4 h-4 rounded cursor-pointer flex-shrink-0 ml-2"
                  />
                </div>
              ))
            ) : (
              <div className="pt-4 flex flex-col gap-y-4 items-start justify-center">
                <p className="text-sm dark:text-gray-300 text-gray-700">
                  No notes found
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
