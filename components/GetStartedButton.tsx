import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotebookPen, Pencil, ListTodo } from "lucide-react";
function GetStartedButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant="default"
          className="shadow-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-gray-100 h-12 text-base"
          aria-label="Get Started"
        >
          Try NoteKaro
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="pb-2">
        <DropdownMenuItem
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
          asChild
        >
          <a href="/notes">
            <NotebookPen
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            Notes
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
          asChild
        >
          <a href="/sketch">
            <Pencil
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            Sketches
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
          asChild
        >
          <a href="/todos">
            <ListTodo
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            Todo List
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default GetStartedButton;
