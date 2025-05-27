import { Drawable } from "roughjs/bin/core";

export type Action =
  | "none"
  | "panning"
  | "moving"
  | "writing"
  | "drawing"
  | "erasing";

export type Tool =
  | "line"
  | "rect"
  | "circle"
  | "diamond"
  | "pencil"
  | "text"
  | "selection"
  | "grab"
  | "eraser"
  | "arrow";

export interface DrawingOptions {
  strokeWidth: number;
  stroke: string;
}

export interface BaseElement {
  id: number;
  options: DrawingOptions;
}

export interface PencilElement extends BaseElement {
  type: "pencil";
  points: [number, number][];
}

export interface TextElement extends BaseElement {
  type: "text";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  text: string;
}

export interface ShapeElement extends BaseElement {
  type: "line" | "rect" | "circle" | "diamond" | "arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  roughElement?: Drawable;
}

export type DrawingElement = PencilElement | TextElement | ShapeElement;

export interface Point {
  x: number;
  y: number;
}

export type HistoryState = DrawingElement[];

export type SetStateAction<T> = T | ((prevState: T) => T);

export interface CanvasRef {
  current: HTMLCanvasElement | null;
}

export interface TextAreaRef {
  current: HTMLTextAreaElement | null;
}

export type SelectedElement =
  | (PencilElement & { xOffSets?: number[]; yOffSets?: number[] })
  | (TextElement & { offsetX?: number; offsetY?: number })
  | (ShapeElement & { offsetX?: number; offsetY?: number });

export interface MouseEvent {
  clientX: number;
  clientY: number;
  button: number;
}

export interface WheelEvent {
  clientX: number;
  clientY: number;
  deltaX: number;
  deltaY: number;
}

export interface KeyboardEvent {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
}

export type Scale = number;

export interface CanvasSize {
  width: number;
  height: number;
}

export interface ComputedPosition {
  left: number;
  top: number;
}
