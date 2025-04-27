import { create } from "zustand";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4;
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

  // Sections (flat)
  sections: Section[];
  setSections: (sections: Section[]) => void;
  getSectionsByListId: (todoListId: string) => Section[];
  updateSectionTitle: (sectionId: string, title: string) => void;

  // Todos (flat)
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  getTodosByListId: (todoListId: string) => Todo[];
  addTodo: (todo: Todo) => void;
  removeTodo: (todoId: string) => void;
  updateTodoTitle: (todoId: string, title: string) => void;
  updateTodoStatus: (todoId: string, completed: boolean) => void;
  updateTodoPriority: (todoId: string, priority: 1 | 2 | 3 | 4) => void;

  // Caching by listId
  todosByListId: { [listId: string]: Todo[] };
  sectionsByListId: { [listId: string]: Section[] };
  setTodosForList: (listId: string, todos: Todo[]) => void;
  setSectionsForList: (listId: string, sections: Section[]) => void;

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

  // Sections (flat)
  sections: [],
  setSections: (sections) => set({ sections }),
  getSectionsByListId: (todoListId: string) =>
    get().sections.filter((section) => section.todoListId === todoListId),
  updateSectionTitle: (sectionId, title) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      ),
    })),

  // Todos (flat)
  todos: [],
  setTodos: (todos) => set({ todos }),
  getTodosByListId: (todoListId: string) =>
    get().todos.filter((todo) => todo.todoListId === todoListId),
  addTodo: (todo) =>
    set((state) => ({
      todos: [...state.todos, todo],
    })),
  removeTodo: (todoId) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== todoId),
    })),
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

  // Caching by listId
  todosByListId: {},
  sectionsByListId: {},
  setTodosForList: (listId, todos) =>
    set((state) => ({
      todosByListId: { ...state.todosByListId, [listId]: todos },
    })),
  setSectionsForList: (listId, sections) =>
    set((state) => ({
      sectionsByListId: { ...state.sectionsByListId, [listId]: sections },
    })),

  selectedTodoListId: null,
  setSelectedTodoListId: (id) => set({ selectedTodoListId: id }),
}));
