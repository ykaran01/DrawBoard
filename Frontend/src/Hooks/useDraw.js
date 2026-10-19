import { useEffect } from "react";
import { setupBrush } from "@/utils/setupBrush";

export const useDrawingMode = ({
  canvasRef,
  current,
  color,
  size,
  opacity,
  background,
  canEdit
}) => {
  

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.isDrawingMode = canEdit && 
      (current === "line" || current === "eraser");

    canvas.selection = canEdit && 
      current === "select";

    canvas.backgroundColor = background;

    canvas.forEachObject((obj) => {
      obj.selectable = canEdit && 
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