"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export default function TimezoneDetector() {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    // Only run if user is authenticated and session is loaded
    if (status === "loading" || !session) {
      return;
    }

    const updateTimezone = async () => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const response = await fetch("/api/user/timezone", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timezone }),
        });

        if (!response.ok) {
          throw new Error("Failed to update timezone");
        }
      } catch (error) {
        console.error("Error updating timezone:", error);
        toast({
          title: "Failed to update timezone",
          description: "Some features may not work correctly",
          variant: "destructive",
        });
      }
    };

    updateTimezone();
  }, [session, status, toast]);

  return null;
}
