import { useTodoStore } from "@/store/todoStore";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

function TodoListTitleEditor({
  initialTitle,
  todoListId,
}: {
  initialTitle: string;
  todoListId: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { updateTodoListTitle } = useTodoStore();

  const debouncedTitleSave = useDebouncedCallback(async (title: string) => {
    updateTodoListTitle(todoListId, title);
  }, 100);

  const debouncedSave = useDebouncedCallback(async (title: string) => {
    await fetch(`/api/todolists/${todoListId}`, {
      method: "PATCH",
      body: JSON.stringify({ title: title }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, 1000);

  useEffect(() => {
    setTitle(initialTitle);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "50px"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
    }
  }, [title]);

  return (
    <div>
      <textarea
        className="text-3xl font-bold outline-none bg-transparent w-[75vw] resize-none overflow-hidden"
        ref={textareaRef}
        value={title}
        onChange={(e) => {
          const newTitle = e.target.value;
          setTitle(newTitle);
          debouncedSave(newTitle);
          debouncedTitleSave(newTitle);
        }}
      />
    </div>
  );
}
export default TodoListTitleEditor;
