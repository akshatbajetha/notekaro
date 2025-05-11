"use client";

import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import Image from "next/image";

export default function ProfileIcon() {
  const { data: session } = useSession();

  if (!session) return <User className="h-4 w-4" />;

  return (
    <div className="flex items-center gap-2">
      {session.user?.image ? (
        <Image
          src={session.user.image}
          alt={session.user.name || "User avatar"}
          width={34}
          height={34}
          className="rounded-full"
        />
      ) : (
        <User className="h-4 w-4 text-blue-400 dark:text-blue-500" />
      )}
    </div>
  );
}
