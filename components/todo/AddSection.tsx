"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddSectionProps {
  todoListId: string;
  onCancel: () => void;
}

export default function AddSection({ todoListId, onCancel }: AddSectionProps) {
  //   const [name, setName] = useState("");

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (name.trim()) {
  //       addSection(name.trim(), projectId);
  //       onCancel();
  //     }
  //   };

  //   const handleKeyDown = (e: React.KeyboardEvent) => {
  //     if (e.key === "Escape") {
  //       onCancel();
  //     }
  //   };

  return (
    <form className="px-2 py-2 space-y-2">
      <Input
        placeholder="Section name"
        // value={name}
        // onChange={(e) => setName(e.target.value)}
        autoFocus
        // onKeyDown={handleKeyDown}
        className="text-sm"
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-7 text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          size="sm"
          //   disabled={!name.trim()}
          className="h-7 text-xs"
        >
          Add section
        </Button>
      </div>
    </form>
  );
}
