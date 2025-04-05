import { useAuth } from "@clerk/nextjs";
import { prisma } from "./db";
import { clerkClient } from "@clerk/nextjs/server";

export async function getOrCreateUser() {
  const { userId } = useAuth();

  if (!userId) {
    throw new Error("User not found");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const newUser = await prisma.user.create({
    data: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
}
