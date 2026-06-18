import { MoveUpRight, Square, Circle, Eraser, MousePointer, Minus, Triangle, Pen, SquareMousePointer } from "lucide-react";

export const colorSwatches = [
  '#ef4444', // Red
  '#f97316',
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#18181b', // Zinc/Black
  '#06b6d4'  // Cyan
];

export const Values = [
  { id: "line", name: "Pen", icon: Pen },
  { id: "arrow", name: "Arrow", icon:  MoveUpRight },
  { id: "rectangle", name: "Rectangle", icon: Square },
  { id: "circle", name: "Circle", icon: Circle },
  { id: "triangle", name: "Triangle", icon: Triangle },
  { id: "eraser", name: "Eraser", icon: Eraser },
  { id: "select", name: "Select", icon: SquareMousePointer },
  { id: "segment", name: "Line", icon: Minus }

];