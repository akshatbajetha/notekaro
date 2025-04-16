import { create } from "zustand";

export interface TodoList {
  id: string;
  title: string;
}

interface TodoListState {
  todoLists: TodoList[];
  setTodoList: (todoLists: TodoList[]) => void;
  updateTodoListTitle: (todoListId: string, title: string) => void;
}

export const useTodoStore = create<TodoListState>((set) => ({
  todoLists: [],
  setTodoList: (todoLists) => set({ todoLists }),
  updateTodoListTitle: (todoListId, title) =>
    set((state) => ({
      todoLists: state.todoLists.map((todoList) =>
        todoList.id === todoListId ? { ...todoList, title } : todoList
      ),
    })),
}));
