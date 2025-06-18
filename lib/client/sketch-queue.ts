import { Shape } from "@/types/canvas";

type QueuedOperation = {
  type: "create" | "update" | "delete";
  shapeId: string | null;
  shape?: Shape;
};

// Convert shape type to match Prisma enum
function convertShapeType(type: string): string {
  switch (type) {
    case "rectangle":
      return "RECTANGLE";
    case "ellipse":
      return "ELLIPSE";
    case "diamond":
      return "DIAMOND";
    case "line":
      return "LINE";
    case "arrow":
      return "ARROW";
    case "free-draw":
      return "FREE_DRAW";
    case "text":
      return "TEXT";
    case "selection":
      return "SELECTION";
    default:
      return type.toUpperCase();
  }
}

// Convert Prisma enum to frontend type
export function convertPrismaType(type: string): string {
  switch (type) {
    case "RECTANGLE":
      return "rectangle";
    case "ELLIPSE":
      return "ellipse";
    case "DIAMOND":
      return "diamond";
    case "LINE":
      return "line";
    case "ARROW":
      return "arrow";
    case "FREE_DRAW":
      return "free-draw";
    case "TEXT":
      return "text";
    case "SELECTION":
      return "selection";
    default:
      return type.toLowerCase();
  }
}

class SketchQueue {
  private queue: QueuedOperation[] = [];
  private processingTimeout: NodeJS.Timeout | null = null;
  private readonly DEBOUNCE_DELAY = 1000; // 1 second

  constructor() {}

  public enqueue(operation: QueuedOperation) {
    if (!operation.shapeId) return; // Skip operations without an ID

    // Remove any existing operations for this shape
    this.queue = this.queue.filter((op) => op.shapeId !== operation.shapeId);

    // Add the new operation
    this.queue.push(operation);

    // Schedule processing
    this.scheduleProcessing();
  }

  private scheduleProcessing() {
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
    }

    this.processingTimeout = setTimeout(() => {
      this.processQueue();
    }, this.DEBOUNCE_DELAY);
  }

  private async processQueue() {
    if (this.queue.length === 0) return;

    const operations = [...this.queue];
    this.queue = [];

    try {
      // Process deletes first
      const deletes = operations.filter((op) => op.type === "delete");
      for (const op of deletes) {
        if (op.shapeId) {
          await fetch(`/api/sketch/${op.shapeId}`, {
            method: "DELETE",
          });
        }
      }

      // Then process updates
      const updates = operations.filter((op) => op.type === "update");
      for (const op of updates) {
        if (op.shapeId && op.shape) {
          const shapeData = {
            ...op.shape,
            type: convertShapeType(op.shape.type),
          };
          await fetch(`/api/sketch/${op.shapeId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(shapeData),
          });
        }
      }

      // Finally process creates
      const creates = operations.filter((op) => op.type === "create");
      for (const op of creates) {
        if (op.shape) {
          const shapeData = {
            ...op.shape,
            type: convertShapeType(op.shape.type),
          };
          await fetch("/api/sketch", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(shapeData),
          });
        }
      }
    } catch (error) {
      console.error("Error processing queue:", error);
      // Put failed operations back in the queue
      this.queue = [...operations, ...this.queue];
    }
  }

  public clear() {
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
    }
    this.queue = [];
  }
}

export const sketchQueue = new SketchQueue();
