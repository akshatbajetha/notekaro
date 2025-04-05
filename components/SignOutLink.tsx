"use client";
import { useToast } from "@/hooks/use-toast";
import { SignOutButton } from "@clerk/nextjs";

function SignoutLink() {
  const { toast } = useToast();
  const handleLogout = () => {
    setTimeout(() => {
      toast({
        title: "Logged out successfully",
      });
    }, 1000);
  };
  return (
    <SignOutButton>
      <button onClick={handleLogout} className="w-full text-left">
        Logout
      </button>
    </SignOutButton>
  );
}
export default SignoutLink;
