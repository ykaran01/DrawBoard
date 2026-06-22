import { useEffect } from "react";
import { setupBrush } from "@/utils/setupBrush";

export const useDrawingMode = ({
  canvasRef,
  current,
  color,
  size,
  opacity,
  background,
}) => {

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.isDrawingMode =
      current === "line" || current === "eraser";

    canvas.selection =
      current === "select";

    canvas.backgroundColor = background;

    canvas.forEachObject((obj) => {
      obj.selectable =
        current === "select";
    });

    if (canvas.isDrawingMode) {
      setupBrush(
        canvas,
        current,
        color,
        size,
        opacity,
        background
      );
    }

    canvas.renderAll();

  }, [
    canvasRef,
    current,
    color,
    size,
    opacity,
    background,
  ]);
};