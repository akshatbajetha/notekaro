"use server";

import { prisma } from "../db";
import { getOrCreateUser } from "../getOrCreateUser";
import { Resend } from "resend";
import { TodoReminderTemplate } from "@/components/email/TodoReminderTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

interface TodoWithList {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  dueDate: Date | null;
  userId: string;
  todoListId: string;
  sectionId?: string | null;
  todoList: {
    id: string;
    title: string;
  };
}

export async function getAuthUser() {
  const user = await getOrCreateUser();
  if (!user) return null;

  // Get the full user data including timezone
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      timezone: true,
    },
  });

  return fullUser;
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

export async function getTodoListById({ listId }: { listId: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todoList = await prisma.todoList.findUnique({
      where: {
        id: listId,
        userId: user.id,
      },
    });
    return todoList;
  } catch (error) {
    console.log("Error while fetching todo list: ", error);
    return null;
  }
}

export async function getSectionsByListId({ listId }: { listId: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const sections = await prisma.section.findMany({
      where: {
        todoListId: listId,
        userId: user.id,
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

export async function getTodosBySectionId({
  sectionId,
}: {
  sectionId: string;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todos = await prisma.todo.findMany({
      where: {
        sectionId: sectionId,
        completed: false,
        userId: user.id,
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

export async function getTodosByListId({ listId }: { listId: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todos = await prisma.todo.findMany({
      where: {
        todoListId: listId,
        sectionId: null,
        completed: false,
        userId: user.id,
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

export async function getCompletedTodos() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const completedTodos = await prisma.todo.findMany({
      where: {
        completed: true,
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        completed: true,
        updatedAt: true,
        todoList: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return completedTodos;
  } catch (error) {
    console.error("Error fetching completed todos: ", error);
    throw error;
  }
}

export async function createTodoList({ title }: { title: string }) {
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

export async function createTodoInList({
  listId,
  title,
  completed,
  priority,
  dueDate,
}: {
  listId: string;
  title: string;
  completed: boolean;
  priority: number;
  dueDate?: Date;
}) {
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
        dueDate,
        user: {
          connect: {
            id: user.id,
          },
        },
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
        user: {
          connect: {
            id: user.id,
          },
        },
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

export async function createTodoInSection({
  sectionId,
  title,
  completed,
  priority,
  dueDate,
  todoListId,
}: {
  sectionId: string;
  title: string;
  completed: boolean;
  priority: number;
  dueDate?: Date;
  todoListId: string;
}) {
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
        dueDate,
        user: {
          connect: {
            id: user.id,
          },
        },
        section: {
          connect: {
            id: sectionId,
          },
        },
        todoList: {
          connect: {
            id: todoListId,
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

export async function deleteTodoList({ listId }: { listId: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // First delete all todos in the list
    await prisma.todo.deleteMany({
      where: {
        todoListId: listId,
      },
    });

    // Then delete all sections in the list
    await prisma.section.deleteMany({
      where: {
        todoListId: listId,
      },
    });

    // Finally delete the list itself
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

export async function deleteSection({ sectionId }: { sectionId: string }) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // First delete all todos in the section
    await prisma.todo.deleteMany({
      where: {
        sectionId: sectionId,
      },
    });

    // Then delete the section itself
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

export async function deleteTodo({ todoId }: { todoId: string }) {
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

export async function updateTodoList({
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
    const todoList = await prisma.todoList.update({
      where: {
        id: listId,
        userId: user.id,
      },
      data: {
        title,
      },
    });

    return todoList;
  } catch (error) {
    console.log("Error while updating todo list: ", error);
    return;
  }
}

export async function updateSection({
  sectionId,
  title,
}: {
  sectionId: string;
  title: string;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const section = await prisma.section.update({
      where: {
        id: sectionId,
        userId: user.id,
      },
      data: {
        title,
      },
    });

    return section;
  } catch (error) {
    console.log("Error while updating section in list: ", error);
    return;
  }
}

export async function updateTodo({
  id,
  title,
  completed,
  priority,
  dueDate,
}: {
  id: string;
  title: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4;
  dueDate?: Date | null;
}) {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const todo = await prisma.todo.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        title,
        completed,
        priority,
        dueDate,
      },
    });

    return todo;
  } catch (error) {
    console.error("Error while updating todo: ", error);
    throw new Error("Failed to update todo");
  }
}

export async function getTodosDueToday() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // Get the user's timezone
    const userTimezone = user.timezone || "UTC";

    // Get current time in user's timezone
    const now = new Date();
    const userNow = new Date(
      now.toLocaleString("en-US", { timeZone: userTimezone })
    );

    // Set to start of today in user's timezone
    const startOfToday = new Date(userNow);
    startOfToday.setHours(0, 0, 0, 0);

    // Set to end of today in user's timezone
    const endOfToday = new Date(userNow);
    endOfToday.setHours(23, 59, 59, 999);

    // Convert to UTC for database query
    const startOfTodayUTC = new Date(
      startOfToday.toLocaleString("en-US", { timeZone: userTimezone })
    );
    const endOfTodayUTC = new Date(
      endOfToday.toLocaleString("en-US", { timeZone: userTimezone })
    );

    const todos = (await prisma.todo.findMany({
      where: {
        dueDate: {
          gte: startOfTodayUTC,
          lte: endOfTodayUTC,
        },
        completed: false,
        userId: user.id,
      },
      include: {
        todoList: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        priority: "asc",
      },
    })) as TodoWithList[];

    // Convert dates back to user's timezone for display
    const todosWithLocalDates = todos.map((todo) => ({
      ...todo,
      dueDate: todo.dueDate
        ? new Date(
            todo.dueDate.toLocaleString("en-US", { timeZone: userTimezone })
          )
        : null,
    }));

    return todosWithLocalDates;
  } catch (error) {
    console.log("Error while fetching today's todos: ", error);
    return [];
  }
}

export async function getUpcomingTodos() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // Get the user's timezone
    const userTimezone = user.timezone || "UTC";

    // Get current time in user's timezone
    const now = new Date();
    const userNow = new Date(
      now.toLocaleString("en-US", { timeZone: userTimezone })
    );

    // Set to start of today in user's timezone
    const startOfToday = new Date(userNow);
    startOfToday.setHours(0, 0, 0, 0);

    // Convert to UTC for database query
    const startOfTodayUTC = new Date(
      startOfToday.toLocaleString("en-US", { timeZone: userTimezone })
    );

    const todos = (await prisma.todo.findMany({
      where: {
        dueDate: {
          gt: startOfTodayUTC,
        },
        completed: false,
        userId: user.id,
      },
      include: {
        todoList: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    })) as TodoWithList[];

    // Convert dates back to user's timezone for display
    const todosWithLocalDates = todos.map((todo) => ({
      ...todo,
      dueDate: todo.dueDate
        ? new Date(
            todo.dueDate.toLocaleString("en-US", { timeZone: userTimezone })
          )
        : null,
    }));

    return todosWithLocalDates;
  } catch (error) {
    console.log("Error while fetching upcoming todos: ", error);
    return [];
  }
}

export async function sendTodoReminders() {
  try {
    // Get all users
    const users = await prisma.user.findMany();

    for (const user of users) {
      // Get the user's timezone
      const userTimezone = user.timezone || "UTC";

      // Get current time in user's timezone
      const now = new Date();
      const userNow = new Date(
        now.toLocaleString("en-US", { timeZone: userTimezone })
      );

      // Check if it's 6 PM in user's timezone
      if (userNow.getHours() !== 18) {
        continue; // Skip if it's not 6 PM
      }

      // Calculate tomorrow in user's timezone
      const tomorrow = new Date(userNow);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // Convert tomorrow to UTC for database query
      const tomorrowUTC = new Date(
        tomorrow.toLocaleString("en-US", { timeZone: userTimezone })
      );
      const nextDayUTC = new Date(tomorrowUTC);
      nextDayUTC.setDate(nextDayUTC.getDate() + 1);

      // Find todos due tomorrow in user's timezone
      const todos = await prisma.todo.findMany({
        where: {
          userId: user.id,
          dueDate: {
            gte: tomorrowUTC,
            lt: nextDayUTC,
          },
          completed: false,
        },
        include: {
          todoList: true,
          section: true,
        },
      });

      if (todos.length > 0) {
        // Send email
        await resend.emails.send({
          from: "Notekaro <reminders@notekaro.com>",
          to: user.email,
          subject: "Your Upcoming Todos for Tomorrow",
          react: TodoReminderTemplate({
            todos,
            userName: user.email.split("@")[0],
          }),
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending todo reminders:", error);
    throw new Error("Failed to send todo reminders");
  }
}
