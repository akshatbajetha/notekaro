import { prisma } from "./db";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrCreateUser() {
  const currUser = await currentUser();

  if (!currUser) {
    throw new Error("User not found");
  }

  // First try to find user by ID
  const existingUser = await prisma.user.findUnique({
    where: {
      id: currUser.id,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  // If not found by ID, try to find by email
  const userEmail = currUser.emailAddresses[0].emailAddress;
  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (existingUserByEmail) {
    // Update the existing user's ID to match Clerk's ID
    const updatedUser = await prisma.user.update({
      where: {
        email: userEmail,
      },
      data: {
        id: currUser.id,
      },
    });
    return updatedUser;
  }

  // If no user exists, create a new one
  const newUser = await prisma.user.create({
    data: {
      id: currUser.id,
      email: userEmail,
    },
  });

  return newUser;
}
