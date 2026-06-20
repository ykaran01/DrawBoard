import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { socket } from '../../socket.js';
import ToolsBar from './ToolsBar.jsx';
import { Settings } from './Settings.jsx';
import { Menu } from 'lucide-react';
export const Another = () => {
  const canvasRef = useRef(null);
  const canvasfileref = useRef(null);
  const fileInputRef = useRef(null);

  const [size, setSize] = useState(3);
  const [current, setcurrent] = useState("line");
  const [color, setcolor] = useState("black");
  const [Opacity, setOpacity] = useState(1);
  const [background, setbackground] = useState("white");
  const [open, onOpenChange] = useState(false)
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const isDrawingShape = useRef(false);
  const startPointer = useRef({ x: 0, y: 0 });
  const activeShape = useRef(null);
  const arrowref = useRef(null);

  const setupBrush = (canvas, mode, currentStrokeColor, brushWidth, alpha) => {
    if (!canvas) return;
    const brush = new fabric.PencilBrush(canvas);
    brush.width = mode === "eraser" ? brushWidth * 4 : brushWidth;
    brush.color = mode === "eraser" ? background : currentStrokeColor;
    brush.opacity = mode === "eraser" ? 1 : alpha;
    canvas.freeDrawingBrush = brush;
  };


  useEffect(() => {

    socket.on("canvas_recieve", (data) => {
      const canvas = canvasfileref.current;
      if (!canvas || !data) return;
      const existingObj = canvas.getObjects().find((item) => item.id === data.id);

      if (existingObj) {
        existingObj.set(data);
        canvas.renderAll();
      } else {
        fabric.util.enlivenObjects([data]).then((objects) => {
          objects.forEach((obj) => {
            obj.programmatic = true;
            canvas.add(obj);
          });
          canvas.renderAll();
        });
      }
    });
    socket.on("undo", (id) => {
      const canvas = canvasfileref.current;
      if (!canvas || !id) {
        return
      }
      const obj = canvas.getObjects().find((item) => item.id === id)
      canvas.remove(obj)
      canvas.renderAll()
    })
    socket.on("clear", () => {
      const canvas = canvasfileref.current
      if (!canvas) return
      canvas.clear()
    })

    return () => {
      socket.off("canvas_recieve");
      socket.off("undo")
      socket.off("clear")
    };
  }, []);


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
      setupBrush(canvas, current, color, size, Opacity);
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


  useEffect(() => {
    const canvas = canvasfileref.current;
    if (!canvas) return;

    canvas.isDrawingMode = current === "line" || current === "eraser";
    canvas.selection = current === "select";
    canvas.backgroundColor = background
    canvas.forEachObject((obj) => {
      obj.selectable = current === "select";
    });

    if (canvas.isDrawingMode) {
      setupBrush(canvas, current, color, size, Opacity);
    }
  }, [current, color, size, Opacity, background]);

  useEffect(() => {
    const canvas = canvasfileref.current;
    if (!canvas) return;

    const handleMouseDown = (options) => {
      if (current !== "rectangle" && current !== "circle" && current !== "triangle" && current !== "segment" && current !== "arrow") return;

      isDrawingShape.current = true;
      const pointerPos = canvas.getScenePoint(options.e);
      startPointer.current = pointerPos;

      const baseProperties = {
        left: pointerPos.x,
        top: pointerPos.y,
        width: 10,
        height: 10,
        fill: 'transparent',
        stroke: color,
        strokeWidth: size,
        selectable: false,
        id: Date.now().toString()
      };

      if (current === "rectangle") {
        activeShape.current = new fabric.Rect(baseProperties);
      } else if (current === "circle") {
        activeShape.current = new fabric.Circle({
          ...baseProperties,
          radius: 0,
        });
      } else if (current === 'triangle') {
        activeShape.current = new fabric.Triangle(baseProperties);
      }
      else if (current === 'segment') {
        activeShape.current = new fabric.Line([pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y], {
          stroke: color,
          strokeWidth: size,
          selectable: false,
          id: Date.now().toString()
        })
      } else if (current === "arrow") {
         
        const triangle = new fabric.Triangle({
          width: size*8,
          height: size*8,
          originX: "center",
          originY: "center",
          angle: 90,
          fill: color,
          selectable: false,
          hasBorders: false,
          hasControls: false,

        })
        const line = new fabric.Line([pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y], {
          stroke: color,
          strokeWidth: size,
          strokeUniform: true,
          selectable: false
        })
        arrowref.current = { line:line, triangle:triangle }
        
        canvas.add(line)
        canvas.add(triangle)
      
      }

      if (activeShape.current) {
        canvas.add(activeShape.current);
        socket.emit("canvas-data", activeShape.current.toObject(['id']));
      }

    };

    const handleMouseMove = (options) => {
      const pointerPos = canvas.getScenePoint(options.e);
      const startX = startPointer.current.x;
      const startY = startPointer.current.y;
      if (isDrawingShape.current  && activeShape.current ){ 

      socket.emit("current-address", { id: socket.id, x: pointerPos.x, y: pointerPos.y });

      if (current === "rectangle" || current === "triangle") {
        const left = Math.min(startX, pointerPos.x);
        const top = Math.min(startY, pointerPos.y);
        const width = Math.abs(startX - pointerPos.x);
        const height = Math.abs(startY - pointerPos.y);

        activeShape.current.set({ left, top, width, height });
      } else if (current === "circle") {
        const dx = pointerPos.x - startX;
        const dy = pointerPos.y - startY;
        const radius = Math.sqrt(dx * dx + dy * dy) / 2;
        const left = startX + (dx < 0 ? dx : 0);
        const top = startY + (dy < 0 ? dy : 0);

        activeShape.current.set({ left, top, radius });
      } else if (current === "segment") {
        activeShape.current.set({
          x1: startX,
          y1: startY,
          x2: pointerPos.x,
          y2: pointerPos.y
        });
      } 
      canvas.renderAll();
      socket.emit("canvas-data", activeShape.current?.toObject(['id']));

    }
      if (arrowref.current) {
        
        const { line, triangle } = arrowref.current
        line.set({
          x1: startX,
          y1: startY,
          x2: pointerPos.x,
          y2: pointerPos.y
        });
        triangle.set({ top: pointerPos.y, left: pointerPos.x })
        const angle = Math.atan2(pointerPos.y - startY, pointerPos.x - startX) * (180 / Math.PI)
        triangle.set({ angle: angle + 90 })
        canvas.renderAll()

      }
    };

    const handleMouseUp = () => {
      if (!isDrawingShape.current) return;
      isDrawingShape.current = false;
      if (activeShape.current) {
        activeShape.current.set({ selectable: true });
        canvas.setActiveObject(activeShape.current);
      }
      if (arrowref.current) {
        const { line, triangle } = arrowref.current
        canvas.remove(line);
        canvas.remove(triangle);

        const arrowgroup = new fabric.Group([line, triangle], {
          hasControls: true,
          hasBorders: true,
          id: Date.now().toString()
        })
        canvas.add(arrowgroup)
        canvas.renderAll()
        socket.emit("canvas-data", arrowgroup.toObject(['id']));
        arrowref.current = null;
      }

      setcurrent("select");
      activeShape.current = null;
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [current, color, size]);

  const addText = () => {
    const canvas = canvasfileref.current;
    if (!canvas) return;
    const text = new fabric.IText("Double click to edit", {
      id: Date.now().toString(),
      left: 300,
      top: 200,
      fontSize: size *10,
      fill: color,
      selectable: true
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    setcurrent("select");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (f) => {
      const data = f.target.result;
      const img = await fabric.Image.fromURL(data);
      img.set({
        id: Date.now().toString(),
        left: 200,
        top: 150,
        selectable: true
      });

      if (img.width > 400) {
        img.scaleToWidth(400);
      }

      canvasfileref.current.add(img);
      canvasfileref.current.renderAll();
      setcurrent("select");
    };
    reader.readAsDataURL(file);
  };

  const handleUndo = () => {
    const canvas = canvasfileref.current;
    if (!canvas || undoStack.current.length === 0) return;
    const lastObj = undoStack.current.pop();
    redoStack.current.push(lastObj);
    lastObj.programmatic = true;
    canvas.remove(lastObj);
    canvas.renderAll();

    socket.emit("undo-canvas", lastObj.toObject(['id']).id)
  };

  const handleRedo = () => {
    const canvas = canvasfileref.current;
    if (!canvas || redoStack.current.length === 0) return;
    const rawObj = redoStack.current.pop();
    undoStack.current.push(rawObj);
    rawObj.programmatic = true;
    canvas.add(rawObj);
    canvas.renderAll();
    socket.emit("canvas-data", rawObj.toObject(['id']))
  };
  const clearCanavs = () => {
    const canvas = canvasfileref.current
    if (!canvas) return
    canvas.clear()
    socket.emit("clear-canvas", [])
  }

  return (
    <div className="min-h-screen  relative bg-purple-100 p-6">
      <div className="flex gap-4 h-[90vh]">
        <ToolsBar
          current={current}
          setcurrent={setcurrent}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          addText={addText}
          handleUndo={handleUndo}
          handleRedo={handleRedo}

        />
        <div className='w-full h-full shadow shadow-black '>
          <canvas ref={canvasRef} ></canvas>
        </div>
        <Settings
          size={size}
          Opacity={Opacity}
          setOpacity={setOpacity}
          color={color}
          setcolor={setcolor}
          clearCanvas={clearCanavs}
          setSize={setSize}
          open={open}
          onOpenChange={onOpenChange}
          background={background}
          setbackground={setbackground}

        />
      </div>
      <div onClick={() => {
        onOpenChange(true)
      }} className='absolute top-9 right-10 cursor-pointer  border border-purple-400 rounded-full bg-white w-10 h-10 flex justify-center items-center' >
        <Menu size={24} color='#dcb7e1' />
      </div>
    </div>
  );
};

export default Another;