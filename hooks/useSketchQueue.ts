import { Shape } from "@/types/canvas";
import { sketchQueue } from "@/lib/client/sketch-queue";

export class SketchQueueManager {
  private pendingOperations: Map<string, Shape>;

  constructor() {
    this.pendingOperations = new Map();
  }

  // Queue a shape creation
  queueCreate(shape: Shape) {
    if (!shape.id) return;

    this.pendingOperations.set(shape.id, shape);
    sketchQueue.enqueue({
      type: "create",
      shapeId: shape.id,
      shape,
    });
  }

  // Queue a shape update
  queueUpdate(shapeId: string | null, shape: Shape) {
    if (!shapeId) return;

    this.pendingOperations.set(shapeId, shape);
    sketchQueue.enqueue({
      type: "update",
      shapeId,
      shape,
    });
  }

  // Queue a shape deletion
  queueDelete(shapeId: string | null) {
    if (!shapeId) return;

    this.pendingOperations.delete(shapeId);
    sketchQueue.enqueue({
      type: "delete",
      shapeId,
    });
  }

  // Clear all pending operations
  clearQueue() {
    this.pendingOperations.clear();
    sketchQueue.clear();
  }

  // Get pending operations
  getPendingOperations() {
    return this.pendingOperations;
  }
}

// Create a singleton instance
export const sketchQueueManager = new SketchQueueManager();
