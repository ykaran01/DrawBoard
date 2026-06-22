import { useEffect } from "react";
import { socket } from "../socket";
import * as fabric from 'fabric';
import { setupBrush } from "@/utils/setupBrush";
export const usecanvs = (canvasRef, canvasfileref, background, current, undoStack, redoStack, color, size, Opacity) => {
    useEffect(() => {
        if (!canvasRef.current) return;
        const width = canvasRef.current.parentElement?.clientWidth
        const higth = canvasRef.current.parentElement?.clientHeight
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: width || 1200,
            height: higth || 700,
            backgroundColor: background,
            isDrawingMode: current === "line" || current === 'eraser'
        });
        canvasfileref.current = canvas;

        if (canvas.isDrawingMode) {
            setupBrush(canvas, current, color, size, Opacity, background);
        }

        canvas.on("object:added", (options) => {
            if (options.target.programmatic) return;
            if (!options.target.id) {
                options.target.id = Date.now().toString();
            }

            undoStack.current.push(options.target);
            redoStack.current = [];
            socket.emit("canvas-data", options.target.toObject(["id"]));
        });

        canvas.on("object:modified", (options) => {
            if (options.target.programmatic) return;
            socket.emit("canvas-data", options.target.toObject(["id"]));
        });

        return () => {
            canvas.dispose();
        };
    }, []);
}