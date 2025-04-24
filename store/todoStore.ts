import { create } from "zustand";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  todoListId?: string;
  sectionId?: string;
}

export interface TodoList {
  id: string;
  title: string;
  todos?: Todo[];
}

export interface Section {
  id: string;
  title: string;
  todos?: Todo[];
  todoListId: string;
}

interface TodoStoreState {
  // TodoLists
  todoLists: TodoList[];
  setTodoLists: (todoLists: TodoList[]) => void;
  updateTodoListTitle: (todoListId: string, title: string) => void;
  getTodoListById: (todoListId: string) => TodoList | undefined;

  // Sections
  sections: Section[];
  setSections: (sections: Section[]) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;

  // Todos
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  updateTodoTitle: (todoId: string, title: string) => void;
  updateTodoStatus: (todoId: string, completed: boolean) => void;
  updateTodoPriority: (todoId: string, priority: number) => void;

  selectedTodoListId: string | null;
  setSelectedTodoListId: (id: string | null) => void;
}

export const useTodoStore = create<TodoStoreState>((set, get) => ({
  // TodoLists
  todoLists: [],
  setTodoLists: (todoLists) => set({ todoLists }),
  updateTodoListTitle: (todoListId, title) =>
    set((state) => ({
      todoLists: state.todoLists.map((list) =>
        list.id === todoListId ? { ...list, title } : list
      ),
    })),
  getTodoListById: (todoListId) =>
    get().todoLists.find((todoList) => todoList.id === todoListId),

  // Sections
  sections: [],
  setSections: (sections) => set({ sections }),
  updateSectionTitle: (sectionId, title) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      ),
    })),

  // Todos
  todos: [],
  setTodos: (todos) => set({ todos }),
  updateTodoTitle: (todoId, title) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === todoId ? { ...todo, title } : todo
      ),
    })),
  updateTodoStatus: (todoId, completed) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed } : todo
      ),
    })),
  updateTodoPriority: (todoId, priority) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === todoId ? { ...todo, priority } : todo
      ),
    })),

  selectedTodoListId: null,
  setSelectedTodoListId: (id) => set({ selectedTodoListId: id }),
}));
