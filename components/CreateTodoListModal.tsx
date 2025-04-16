import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { Plus, Save } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useTodoStore } from "@/store/todoStore";
import { useRouter } from "next/navigation";

export function CreateTodoListModal() {
  const { todoLists, setTodoList } = useTodoStore();
  const router = useRouter();

  const handleCreateNote = async (title: string) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      setTodoList([data.todo, ...todoLists]);

      router.push(`/todos/${data.note.id}`);
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
      <Modal>
        <ModalTrigger className="flex justify-center group/modal-btn">
          <Plus className="w-4 h-4 hover:bg-gray-800 rounded cursor-pointer" />
        </ModalTrigger>
        <ModalBody>
          <ModalContent className=" overflow-y-auto">
            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center md:mb-4 mb-2">
              <Save className="mr-1 inline-block h-6 w-6" /> Create new Todo
              List
            </h4>
            <form className="md:m-10 m-4" onSubmit={handleSubmit}>
              <Input
                name="title"
                required={true}
                placeholder="Enter the title of the component"
                className="m-2 md:placeholder:text-base placeholder:text-xs"
              />

              <Button
                type="submit"
                className="md:mt-10 mt-4 md:px-6 md:py-4 py-2  h-max w-max bg-foreground md:text-lg text-xs font-bold text-background hover:bg-background hover:text-foreground"
              >
                Save
              </Button>
            </form>
          </ModalContent>
        </ModalBody>
      </Modal>
    </div>
  );
}
