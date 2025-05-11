"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { SignInModal } from "./sign-in-modal";

interface SignInButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  children?: React.ReactNode;
}

export function SignInButton({
  variant = "default",
  className,
  children = "Sign in",
}: SignInButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </Button>
      <SignInModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
