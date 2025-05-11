"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function SignInGoogle() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: "Failed to sign in with Google. Please try again.",
          variant: "destructive",
        });
        router.push("/");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.log("Error while signing in: ", error);
      toast({
        title: "Login Failed",
        description: "An error occurred while signing in. Please try again.",
        variant: "destructive",
      });
      router.push("/");
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-[50%]"
      onClick={handleSignIn}
    >
      <FcGoogle className="mr-2 h-4 w-4" /> Sign in with Google
    </Button>
  );
}
