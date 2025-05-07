import { create } from "zustand";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4;
  dueDate: Date | null;
  todoListId: string;
  sectionId?: string;
  updatedAt?: Date;
}

export interface CompletedTodo extends Todo {
  updatedAt: Date;
  todoList: {
    id: string;
    title: string;
  };
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

  // Todos
  todosByListId: { [listId: string]: Todo[] };
  todosBySectionId: { [sectionId: string]: Todo[] };
  completedTodos: CompletedTodo[];
  setCompletedTodos: (todos: CompletedTodo[]) => void;
  addCompletedTodo: (todo: CompletedTodo) => void;
  removeCompletedTodo: (todoId: string) => void;
  updateCompletedTodo: (
    todoId: string,
    updates: Partial<CompletedTodo>
  ) => void;

  // Todo List operations
  getTodosByListId: (todoListId: string) => Todo[];
  setTodosForList: (listId: string, todos: Todo[]) => void;
  addTodoToList: (todo: Todo) => void;
  removeTodoFromList: (todoId: string, listId: string) => void;
  updateTodoInList: (
    todoId: string,
    listId: string,
    updates: Partial<Todo>
  ) => void;

  // Todo Section operations
  getTodosBySectionId: (sectionId: string) => Todo[];
  setTodosForSection: (sectionId: string, todos: Todo[]) => void;
  addTodoToSection: (todo: Todo) => void;
  removeTodoFromSection: (todoId: string, sectionId: string) => void;
  updateTodoInSection: (
    todoId: string,
    sectionId: string,
    updates: Partial<Todo>
  ) => void;

  // Caching by listId
  sectionsByListId: { [listId: string]: Section[] };
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

  // Todos
  todosByListId: {},
  todosBySectionId: {},
  completedTodos: [],
  setCompletedTodos: (todos) => set({ completedTodos: todos }),
  addCompletedTodo: (todo) =>
    set((state) => ({
      completedTodos: [...state.completedTodos, todo],
    })),
  removeCompletedTodo: (todoId) =>
    set((state) => ({
      completedTodos: state.completedTodos.filter((todo) => todo.id !== todoId),
    })),
  updateCompletedTodo: (todoId, updates) =>
    set((state) => ({
      completedTodos: state.completedTodos.map((todo) =>
        todo.id === todoId ? { ...todo, ...updates } : todo
      ),
    })),

  // Todo List operations
  getTodosByListId: (todoListId: string) =>
    get().todosByListId[todoListId] || [],
  setTodosForList: (listId, todos) =>
    set((state) => ({
      todosByListId: { ...state.todosByListId, [listId]: todos },
    })),
  addTodoToList: (todo) =>
    set((state) => ({
      todosByListId: {
        ...state.todosByListId,
        [todo.todoListId!]: [
          ...(state.todosByListId[todo.todoListId!] || []),
          todo,
        ],
      },
    })),
  removeTodoFromList: (todoId, listId) =>
    set((state) => ({
      todosByListId: {
        ...state.todosByListId,
        [listId]: (state.todosByListId[listId] || []).filter(
          (todo) => todo.id !== todoId
        ),
      },
    })),
  updateTodoInList: (todoId, listId, updates) =>
    set((state) => ({
      todosByListId: {
        ...state.todosByListId,
        [listId]: (state.todosByListId[listId] || []).map((todo) =>
          todo.id === todoId ? { ...todo, ...updates } : todo
        ),
      },
    })),

  // Todo Section operations
  getTodosBySectionId: (sectionId: string) =>
    get().todosBySectionId[sectionId] || [],
  setTodosForSection: (sectionId, todos) =>
    set((state) => ({
      todosBySectionId: { ...state.todosBySectionId, [sectionId]: todos },
    })),
  addTodoToSection: (todo) =>
    set((state) => ({
      todosBySectionId: {
        ...state.todosBySectionId,
        [todo.sectionId!]: [
          ...(state.todosBySectionId[todo.sectionId!] || []),
          todo,
        ],
      },
    })),
  removeTodoFromSection: (todoId, sectionId) =>
    set((state) => ({
      todosBySectionId: {
        ...state.todosBySectionId,
        [sectionId]: (state.todosBySectionId[sectionId] || []).filter(
          (todo) => todo.id !== todoId
        ),
      },
    })),
  updateTodoInSection: (todoId, sectionId, updates) =>
    set((state) => ({
      todosBySectionId: {
        ...state.todosBySectionId,
        [sectionId]: (state.todosBySectionId[sectionId] || []).map((todo) =>
          todo.id === todoId ? { ...todo, ...updates } : todo
        ),
      },
    })),

  // Caching by listId
  sectionsByListId: {},
  setSectionsForList: (listId, sections) =>
    set((state) => ({
      sectionsByListId: { ...state.sectionsByListId, [listId]: sections },
    })),

  selectedTodoListId: null,
  setSelectedTodoListId: (id) => set({ selectedTodoListId: id }),
}));
