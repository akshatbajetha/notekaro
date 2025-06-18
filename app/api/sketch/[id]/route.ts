import { NextResponse } from "next/server";
import { updateShape, deleteShape } from "@/lib/actions/sketch";

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
