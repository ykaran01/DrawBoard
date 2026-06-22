import * as fabric from 'fabric'
export   const setupBrush = (canvas, mode, currentStrokeColor, brushWidth, alpha,background) => {
    if (!canvas) return;
    const brush = new fabric.PencilBrush(canvas);
    brush.width = mode === "eraser" ? brushWidth * 4 : brushWidth;
    brush.color = mode === "eraser" ? background : currentStrokeColor;
    brush.opacity = mode === "eraser" ? 1 : alpha;
    canvas.freeDrawingBrush = brush;
  };