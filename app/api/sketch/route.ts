import { NextResponse } from "next/server";
import {
  createShape,
  updateShape,
  deleteShape,
  getShapes,
} from "@/lib/actions/sketch";

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

// PATCH /api/sketch/:id - Update a shape
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shapeData = await request.json();
    const shape = await updateShape(params.id, shapeData);
    return NextResponse.json(shape);
  } catch (error) {
    console.error("Error updating shape:", error);
    return NextResponse.json(
      { error: "Failed to update shape" },
      { status: 500 }
    );
  }
}

// DELETE /api/sketch/:id - Delete a shape
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shape = await deleteShape(params.id);
    return NextResponse.json(shape);
  } catch (error) {
    console.error("Error deleting shape:", error);
    return NextResponse.json(
      { error: "Failed to delete shape" },
      { status: 500 }
    );
  }
}
