import { NextResponse } from "next/server";
import { getSketch, updateSketch } from "@/lib/actions/sketch";

export async function GET() {
  try {
    const canvas = await getSketch();
    return NextResponse.json(canvas);
  } catch (error) {
    console.error("Error in GET /api/sketch:", error);
    return NextResponse.json(
      { error: "Failed to fetch sketch" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { elements, scale, panOffsetX, panOffsetY } = body;

    // Validate the request body
    if (
      !elements &&
      scale === undefined &&
      panOffsetX === undefined &&
      panOffsetY === undefined
    ) {
      return NextResponse.json(
        { error: "No valid update data provided" },
        { status: 400 }
      );
    }

    const updatedCanvas = await updateSketch({
      elements,
      scale,
      panOffsetX,
      panOffsetY,
    });

    return NextResponse.json(updatedCanvas);
  } catch (error) {
    console.error("Error in PATCH /api/sketch:", error);
    return NextResponse.json(
      { error: "Failed to update sketch" },
      { status: 500 }
    );
  }
}
