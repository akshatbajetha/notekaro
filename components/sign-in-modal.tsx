"use client";

import { SignInGithub } from "@/components/sign-in-github";
import { SignInGoogle } from "@/components/sign-in-google";
import { SignInEmail } from "@/components/sign-in-email";
import { Separator } from "@/components/ui/separator";
import NoteKaroLogo from "@/public/NoteKaro.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md min-h-[400px]">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-center text-2xl font-semibold tracking-tight flex items-center justify-center gap-x-2">
            <Image
              src={NoteKaroLogo}
              className="w-10 h-10"
              alt="NoteKaro Logo"
            />
            NoteKaro
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col items-center justify-center gap-y-6">
            <SignInGoogle />
            <SignInGithub />
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                OR
              </span>
            </div>
          </div>
          <SignInEmail />
        </div>
      </DialogContent>
    </Dialog>
  );
}
