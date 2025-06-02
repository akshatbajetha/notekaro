import { NextRequest, NextResponse } from "next/server";
import {
  getSketch,
  createElement,
  updateElement,
  deleteElement,
  updateSketch,
} from "@/lib/actions/sketch";

// GET /api/sketch - Get all elements
export async function GET() {
  try {
    const elements = await getSketch();
    return NextResponse.json({ elements });
  } catch (error) {
    console.error("Error in GET /api/sketch:", error);
    return NextResponse.json(
      { error: "Failed to fetch sketch" },
      { status: 500 }
    );
  }
}

// POST /api/sketch - Create a new element
export async function POST(request: NextRequest) {
  try {
    const element = await request.json();
    const result = await createElement(element);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in POST /api/sketch:", error);
    return NextResponse.json(
      { error: "Failed to create element" },
      { status: 500 }
    );
  }
}

// PATCH /api/sketch - Update multiple elements or a single element
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();

    // If we're updating a single element
    if (data.id) {
      const result = await updateElement(data);
      return NextResponse.json(result);
    }

    // If we're updating multiple elements
    if (data.elements) {
      const results = await updateSketch(data);
      return NextResponse.json({ elements: results });
    }

    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in PATCH /api/sketch:", error);
    return NextResponse.json(
      { error: "Failed to update sketch" },
      { status: 500 }
    );
  }
}

// DELETE /api/sketch - Delete an element
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Element ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteElement(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in DELETE /api/sketch:", error);
    return NextResponse.json(
      { error: "Failed to delete element" },
      { status: 500 }
    );
  }
}
