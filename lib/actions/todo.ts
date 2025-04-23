"use server";

import { prisma } from "../db";
import { getOrCreateUser } from "../getOrCreateUser";

export async function getAuthUser() {
  const user = await getOrCreateUser();
  return user;
}

export async function getTodoLists() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todoLists = await prisma.todoList.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return todoLists;
  } catch (error) {
    console.log("Error while fetching todo lists: ", error);
    return;
  }
}
export async function getSectionsByListId(listId: string) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const sections = await prisma.section.findMany({
      where: {
        todoListId: listId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return sections;
  } catch (error) {
    console.log("Error while fetching todo lists: ", error);
    return null;
  }
}

export async function getTodosBySectionId(sectionId: string) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todos = await prisma.todo.findMany({
      where: {
        sectionId: sectionId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return todos;
  } catch (error) {
    console.log("Error while fetching todo lists: ", error);
    return null;
  }
}

export async function getTodosByListId(listId: string) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todos = await prisma.todo.findMany({
      where: {
        todoListId: listId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return todos;
  } catch (error) {
    console.log("Error while fetching todo lists: ", error);
    return null;
  }
}

export async function createTodoList(title: string) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todoList = await prisma.todoList.create({
      data: {
        title,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return todoList;
  } catch (error) {
    console.log("Error while creating todo list: ", error);
    return;
  }
}

export async function createTodoInList(
  listId: string,
  title: string,
  completed: boolean,
  priority: number
) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        completed,
        priority,
        todoList: {
          connect: {
            id: listId,
          },
        },
      },
    });

    return todo;
  } catch (error) {
    console.log("Error while creating todo in list: ", error);
    return;
  }
}

export async function createSectionInList({
  listId,
  title,
}: {
  listId: string;
  title: string;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const section = await prisma.section.create({
      data: {
        title,
        todoList: {
          connect: {
            id: listId,
          },
        },
      },
    });
    return section;
  } catch (error) {
    console.log("Error while creating section in list: ", error);
    return;
  }
}

export async function createTodoInSection(
  sectionId: string,
  title: string,
  completed: boolean,
  priority: number
) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        completed,
        priority,
        section: {
          connect: {
            id: sectionId,
          },
        },
      },
    });
    return todo;
  } catch (error) {
    console.log("Error while creating todo in section: ", error);
    return;
  }
}

export async function deleteTodoList(listId: string) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todoList = await prisma.todoList.delete({
      where: {
        id: listId,
      },
    });

    return todoList;
  } catch (error) {
    console.log("Error while deleting todo list: ", error);
    return;
  }
}

export async function deleteSection(sectionId: string) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const section = await prisma.section.delete({
      where: {
        id: sectionId,
      },
    });

    return section;
  } catch (error) {
    console.log("Error while deleting section in list: ", error);
    return;
  }
}

export async function deleteTodo(todoId: string) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todo = await prisma.todo.delete({
      where: {
        id: todoId,
      },
    });

    return todo;
  } catch (error) {
    console.log("Error while deleting todo in section: ", error);
    return;
  }
}
