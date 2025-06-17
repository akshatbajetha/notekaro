"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

export function SignInEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resendAction = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const email = formData.get("email") as string;
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to send login link. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email",
          description:
            "We sent you a login link. Be sure to check your spam folder.",
        });
      }
    } catch (error) {
      console.log("Error while signing in: ", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={resendAction} className="space-y-6">
      <div>
        <Input
          type="email"
          id="email-resend"
          name="email"
          placeholder="name@example.com"
          required
          className="w-full"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-foreground text-background"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Sign up with email"}
      </Button>
    </form>
  );
}
