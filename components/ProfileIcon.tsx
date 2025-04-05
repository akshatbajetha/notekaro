import { currentUser } from "@clerk/nextjs/server";
import { User } from "lucide-react";
import Image from "next/image";
async function UserIcon() {
  const user = await currentUser();
  const profileImage = user?.imageUrl;
  if (profileImage)
    return (
      <Image
        src={profileImage}
        alt="user"
        className="rounded-full object-cover min-w-[75%] min-h-[75%]"
        width={32}
        height={32}
      />
    );
  return (
    <User className="min-w-[65%] min-h-[65%] bg-primary rounded-full text-background/70 p-0" />
  );
}
export default UserIcon;
