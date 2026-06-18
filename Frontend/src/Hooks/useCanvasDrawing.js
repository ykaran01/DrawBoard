import { useEffect } from "react";


const imageCache = {}; 

export const useCanvasDrawing = (canvasRef, elements, setElements) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      if (!element) return;
      
      if (element.type !== "image") {
        ctx.lineWidth = element.size || 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = element.color || "black";
      }
      ctx.globalAlpha = element.Opacity || 1;

      if (element.type === "rectangle") {
        ctx.beginPath();
        ctx.strokeRect(element.startX, element.startY, element.width, element.height);
      } else if (element.type === "line" || element.type === "eraser") {
        if (!element.points || element.points.length === 0) return;
        ctx.beginPath();
        ctx.moveTo(element.points[0].x, element.points[0].y);
        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(element.points[i].x, element.points[i].y);
        }
        ctx.stroke();
      } else if (element.type === "text") {
        ctx.font = `${element.size * 4 || 16}px sans-serif`;
        ctx.fillStyle = element.color || "black";
        ctx.fillText(element.text, element.startX, element.startY);
      } else if (element.type === "circle") {
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radius || 2, 0, Math.PI * 2);
        ctx.stroke();
      } else if (element.type === "image") {
        if (imageCache[element.src]) {
          ctx.drawImage(imageCache[element.src], element.startX, element.startY, element.width, element.height);
        } else {
          const img = new Image();
          img.src = element.src;
          img.onload = () => {
            imageCache[element.src] = img;
            setElements([...elements]); 
          };
        }
      }
    });
  }, [elements, canvasRef, setElements]);
};