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
        createdAt: "desc",
      },
    });
    return todoLists;
  } catch (error) {
    console.log("Error while fetching todo lists: ", error);
    return;
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
        listId: listId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return todos;
  } catch (error) {
    console.log("Error while fetching todo lists: ", error);
    return;
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
