import { prisma } from "./db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

export async function getOrCreateUser() {
  const currUser = await currentUser();

  if (!currUser) {
    throw new Error("User not found");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: currUser.id,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  const client = await clerkClient();
  const user = await client.users.getUser(currUser.id);

  const newUser = await prisma.user.create({
    data: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
}
