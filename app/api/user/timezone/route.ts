import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/actions/todo";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { timezone } = await req.json();
    if (!timezone) {
      return NextResponse.json(
        { error: "Timezone is required" },
        { status: 400 }
      );
    }

    // Validate timezone format
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
    } catch (error) {
      console.error("Invalid timezone:", error);
      return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { timezone },
    });

    return NextResponse.json({ timezone: updatedUser.timezone });
  } catch (error) {
    console.error("Error updating timezone:", error);
    return NextResponse.json(
      { error: "Failed to update timezone" },
      { status: 500 }
    );
  }
}
