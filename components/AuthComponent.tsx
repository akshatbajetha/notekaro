"use client";

import { useSession } from "next-auth/react";
import { SignInButton } from "./sign-in-button";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
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
          className="flex bg-transparent border-0 aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 items-center justify-center fixed top-7 md:right-[32%] z-50 md:mb-6 md:p-0 md:min-w-12 md:min-h-12 right-0 mb-4 mr-4 p-0 min-w-10 min-h-10"
          aria-label="User Icon"
          title="Profile"
        >
          <ProfileIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start" sideOffset={10}>
        {session ? (
          <>
            <span className="text-sm text-muted-foreground px-2">
              {session.user?.email}
            </span>

            <DropdownMenuSeparator />

            <Button
              className="text-sm w-full flex justify-start"
              variant="ghost"
              onClick={() => signOut()}
            >
              Sign out
            </Button>
          </>
        ) : (
          <SignInButton
            className="text-sm w-full flex justify-start"
            variant="ghost"
          >
            Sign in
          </SignInButton>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default AuthComponent;
