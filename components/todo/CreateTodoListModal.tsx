import { Loader2, Plus, Save } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTodoStore } from "@/store/todoStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateTodoListModal() {
  const { todoLists, setTodoLists } = useTodoStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreateNote = async (title: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/todolists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();
      const newId = data.id;
      const newTitle = data.title;

      setTodoLists([{ id: newId, title: newTitle }, ...todoLists]);
      setOpen(false);
      router.push(`/todos/${newId}`);

      setIsLoading(false);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const title = formData.get("title") as string;

    handleCreateNote(title);
  };
  return (
    <div className="flex items-center justify-center" title="Create TodoList">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="flex justify-center group/modal-btn dark:bg-[#1E1E1E] bg-[#F5F5F5]">
          <Plus className="w-4 h-4 hover:bg-gray-800 rounded cursor-pointer" />
        </DialogTrigger>
        <DialogContent className=" overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center md:mb-4 mb-2">
                <Save className="mr-1 inline-block h-6 w-6" /> Create a new Todo
                List
              </h4>
            </DialogTitle>
          </DialogHeader>

          <form className="md:m-10 m-4" onSubmit={handleSubmit}>
            <Input
              name="title"
              required={true}
              placeholder="Enter the title of your new Todo List"
              className="m-2 md:placeholder:text-base placeholder:text-xs"
            />
            <DialogFooter>
              <Button
                type="submit"
                className="md:mt-10 mt-4 ml-2 h-max w-max bg-foreground md:text-lg text-xs font-bold"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin my-2 mx-4" />
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
