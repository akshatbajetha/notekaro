import { NextResponse } from "next/server";
import { createShape, getShapes } from "@/lib/actions/sketch";

// GET /api/sketch - Get all shapes for the current user
export async function GET() {
  try {
    const shapes = await getShapes();
    return NextResponse.json(shapes);
  } catch (error) {
    console.error("Error fetching shapes:", error);
    return NextResponse.json(
      { error: "Failed to fetch shapes" },
      { status: 500 }
    );
  }
}

// POST /api/sketch - Create a new shape
export async function POST(request: Request) {
  try {
    const shapeData = await request.json();
    const shape = await createShape(shapeData);
    return NextResponse.json(shape);
  } catch (error) {
    console.error("Error creating shape:", error);
    return NextResponse.json(
      { error: "Failed to create shape" },
      { status: 500 }
    );
  }
}
