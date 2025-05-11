"use client";

import { useSession } from "next-auth/react";
import { SignInButton } from "./sign-in-button";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import ProfileIcon from "./ProfileIcon";

function AuthComponent() {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="flex bg-transparent border-0 aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 items-center justify-center fixed top-7 right-[33%] z-50 mb-6 p-0 min-w-12 min-h-12"
          aria-label="User Icon"
          title="Profile"
        >
          <ProfileIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start" sideOffset={10}>
        {session ? (
          <>
            <DropdownMenuItem>
              <span className="text-sm text-muted-foreground">
                {session.user?.email}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button variant="ghost" onClick={() => signOut()}>
                Sign out
              </Button>
            </DropdownMenuItem>
          </>
        ) : (
          <SignInButton className="w-full" variant="ghost">
            Sign in
          </SignInButton>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default AuthComponent;
