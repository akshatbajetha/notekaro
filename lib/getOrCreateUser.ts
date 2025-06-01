import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

// Cache the user lookup to avoid repeated database queries
export const getOrCreateUser = cache(async () => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    // Use findFirst instead of upsert for better performance when user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    // Only create if user doesn't exist
    return await prisma.user.create({
      data: {
        email: session.user.email,
        name: session.user.name || session.user.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    throw new Error("Failed to get or create user");
  }
});
