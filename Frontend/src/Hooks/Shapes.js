import { useEffect, useRef } from "react";
import * as fabric from "fabric";

export const useCanvasDrawing = ({
  canvasRef,
  currentMode,
  setCurrentMode,
  color,
  size,
  socket,
}) => {
  const isDrawingShape = useRef(false);
  const startPointer = useRef({ x: 0, y: 0 });
  const activeShape = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (options) => {

      const validModes = ["rectangle", "circle", "triangle", "segment", "arrow"];
      if (!validModes.includes(currentMode)) return;

      isDrawingShape.current = true;
      const pointerPos = canvas.getScenePoint(options.e);
      startPointer.current = pointerPos;

      const baseProperties = {
        left: pointerPos.x,
        top: pointerPos.y,
        width: 10,
        height: 10,
        fill: "transparent",
        stroke: color,
        strokeWidth: size,
        selectable: false,
        id: Date.now().toString(),
      };

      if (currentMode === "rectangle") {
        activeShape.current = new fabric.Rect(baseProperties);
      } else if (currentMode === "circle") {
        activeShape.current = new fabric.Circle({
          ...baseProperties,
          radius: 0,
        });
      } else if (currentMode === "triangle") {
        activeShape.current = new fabric.Triangle(baseProperties);
      } else if (currentMode === "segment") {
        activeShape.current = new fabric.Line(
          [pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y],
          {
            stroke: color,
            strokeWidth: size,
            selectable: false,
            id: Date.now().toString(),
          }
        );
      } else if (currentMode === "arrow") {
        const triangle = new fabric.Triangle({
          width: size * 8,
          height: size * 8,
          originX: "center",
          originY: "center",
          angle: 90,
          fill: color,
          selectable: false,
          hasBorders: false,
          hasControls: false,
        });

        const line = new fabric.Line(
          [pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y],
          {
            stroke: color,
            strokeWidth: size,
            strokeUniform: true,
            selectable: false,
          }
        );

        arrowRef.current = { line, triangle };
        canvas.add(line);
        canvas.add(triangle);
      }

      if (activeShape.current) {
        canvas.add(activeShape.current);
        socket.emit("canvas-data", activeShape.current.toObject(["id"]));
      }
    };

    const handleMouseMove = (options) => {
      if (!isDrawingShape.current) return;
      
      const pointerPos = canvas.getScenePoint(options.e);
      const startX = startPointer.current.x;
      const startY = startPointer.current.y;

      socket.emit("current-address", {
        id: socket.id,
        x: pointerPos.x,
        y: pointerPos.y,
      });

      if (activeShape.current) {
        if (currentMode === "rectangle" || currentMode === "triangle") {
          const left = Math.min(startX, pointerPos.x);
          const top = Math.min(startY, pointerPos.y);
          const width = Math.abs(startX - pointerPos.x);
          const height = Math.abs(startY - pointerPos.y);

          activeShape.current.set({ left, top, width, height });
        } else if (currentMode === "circle") {
          const dx = pointerPos.x - startX;
          const dy = pointerPos.y - startY;
          const radius = Math.sqrt(dx * dx + dy * dy) / 2;
          const left = startX + (dx < 0 ? dx : 0);
          const top = startY + (dy < 0 ? dy : 0);

          activeShape.current.set({ left, top, radius });
        } else if (currentMode === "segment") {
          activeShape.current.set({
            x1: startX,
            y1: startY,
            x2: pointerPos.x,
            y2: pointerPos.y,
          });
        }
        canvas.renderAll();
        socket.emit("canvas-data", activeShape.current?.toObject(["id"]));
      }

      if (arrowRef.current) {
        const { line, triangle } = arrowRef.current;
        line.set({
          x1: startX,
          y1: startY,
          x2: pointerPos.x,
          y2: pointerPos.y,
        });
        triangle.set({ top: pointerPos.y, left: pointerPos.x });
        const angle =
          Math.atan2(pointerPos.y - startY, pointerPos.x - startX) *
          (180 / Math.PI);
        triangle.set({ angle: angle + 90 });
        canvas.renderAll();
      }
    };

    const handleMouseUp = () => {
      if (!isDrawingShape.current) return;

      isDrawingShape.current = false;
      if (activeShape.current) {
        activeShape.current.set({ selectable: true });
        canvas.setActiveObject(activeShape.current);
      }

      if (arrowRef.current) {
        const { line, triangle } = arrowRef.current;
        canvas.remove(line);
        canvas.remove(triangle);
        const arrowGroup = new fabric.Group([line, triangle], {
          hasControls: true,
          hasBorders: true,
          id: Date.now().toString(),
        });
        canvas.add(arrowGroup);
        canvas.renderAll();
        socket.emit("canvas-data", arrowGroup.toObject(["id"]));
        arrowRef.current = null;
      }
      setCurrentMode("select")
      activeShape.current = null;
    };

    const Zoomproblem = (options) => {
      if (options.e) {
        options.e.preventDefault();
        options.e.stopPropagation();
      }
      const deltay = options.e.deltaY

      let zoom = canvas.getZoom()
      let zoomfactor = 0.999
      if (options.e.ctrlKey) {

        zoomfactor = 0.95;
      }
      zoom *= zoomfactor ** deltay
      if (zoom < 0.06) zoom = 0.06
      if (zoom > 20) zoom = 20

      canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom)
      options.e.preventDefault();
      options.e.stopPropagation();
    }

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("mouse:wheel", Zoomproblem)



    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
      canvas.off("mouse:wheel", Zoomproblem)
    };
  }, [currentMode, color, size, canvasRef, setCurrentMode, socket]);
};
