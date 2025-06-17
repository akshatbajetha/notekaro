"use server";

import { Shape } from "@/types/canvas";

type QueuedOperation = {
  type: "create" | "update" | "delete";
  shapeId: string | null;
  shape?: Shape;
};

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

  public queueCreate(shape: Shape) {
    this.enqueue({
      type: "create",
      shapeId: shape.id,
      shape,
    });
  }

  public queueUpdate(shapeId: string | null, shape: Shape) {
    this.enqueue({
      type: "update",
      shapeId,
      shape,
    });
  }

  public queueDelete(shapeId: string | null) {
    this.enqueue({
      type: "delete",
      shapeId,
    });
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
          await fetch(`/api/sketch/${op.shapeId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(op.shape),
          });
        }
      }

      // Finally process creates
      const creates = operations.filter((op) => op.type === "create");
      for (const op of creates) {
        if (op.shape) {
          await fetch("/api/sketch", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(op.shape),
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
