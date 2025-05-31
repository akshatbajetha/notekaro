import { getSketch, updateSketch } from "@/lib/actions/sketch";

export async function GET() {
  try {
    const elements = await getSketch();
    return Response.json({ elements });
  } catch (error) {
    console.error("Error in GET /api/sketch:", error);
    return Response.json({ error: "Failed to fetch sketch" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { elements } = body;

    // Validate the request body
    if (!elements) {
      return Response.json({ error: "Elements are required" }, { status: 400 });
    }

    const updatedElements = await updateSketch({
      elements,
    });

    return Response.json({ elements: updatedElements });
  } catch (error) {
    console.error("Error in PATCH /api/sketch:", error);
    return Response.json({ error: "Failed to update sketch" }, { status: 500 });
  }
}
