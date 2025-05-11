import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getOrCreateUser() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.upsert({
    where: {
      email: session.user.email,
    },
    update: {},
    create: {
      email: session.user.email,
      name: session.user.name || session.user.email,
    },
  });

  return user;
}
