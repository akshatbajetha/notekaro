"use server";

import { prisma } from "../db";
import { getOrCreateUser } from "../getOrCreateUser";

export async function getAuthUser() {
  const user = await getOrCreateUser();
  return user;
}

export async function getNotes() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    return notes;
  } catch (error) {
    console.log("Error while fetching notes: ", error);
    return;
  }
}

export async function getNoteById(noteId: string) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const note = await prisma.note.findUnique({
      where: {
        userId: user.id,
        id: noteId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        updatedAt: true,
      },
    });
    return note;
  } catch (error) {
    console.log("Error while fetching notes: ", error);
    return;
  }
}

export async function createNote(title: string, content: any) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const noteForUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        notes: {
          connect: {
            id: note.id,
          },
        },
      },
    });

    return { note };
  } catch (error) {
    console.log("Error while creating notes: ", error);
    return;
  }
}

export async function deleteNote(id: string) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const note = await prisma.note.delete({
      where: {
        id,
      },
    });

    return Response.json({ "Note deleted successfully": note });
  } catch (error) {
    console.log("Error while deleting notes: ", error);
    return;
  }
}
