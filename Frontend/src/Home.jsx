import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import { colorSwatches } from "./Helper/constants";
import { SeetingsBar } from "./UI/SeetingsBar";
import ToolsBar from "./UI/ToolsBar";
import CanvasBoard from "./UI/CanvasBoard";
import { useCanvasDrawing } from "./Hooks/useCanvasDrawing";
import { useCanvasSocket } from "./Hooks/useCanvasSocket";
const imageChace = {}
export function Home() {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const startPosition = useRef(null);
  const [size, setSize] = useState(3);
  const [elements, setElements] = useState([]);
  const [current, setcurrent] = useState("line");
  const [color, setcolor] = useState("black");
  const lastcall = useRef(Date.now());
  const [redo, setredo] = useState([]);
  const [pointer, setpointer] = useState({});
  const [textInputPos, setTextInputPos] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [background, setBackround] = useState("white")
  const [Opacity, setOpacity] = useState(1)
  const [pendingimage, setPendingImage] = useState(null)
  const fileInputRef = useRef(null);
  const change = (e) => {
    setSize(Number(e.target.value));
  };
  useCanvasSocket(socket, setElements, setpointer)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      drawAllElements(ctx, canvas, elements);
    }
  }, [elements]);


  const drawAllElements = (ctx, currentCanvas, currentElements) => {
    ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);

    currentElements.forEach((element) => {
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
      }
      else if (element.type === "circle") {
        ctx.beginPath()
        ctx.arc(element.x, element.y, element.radius || 2, 0, Math.PI * 2)
        ctx.stroke()
      }
      else if (element.type == "image") {
        if (imageChace[element.src]) {
          ctx.drawImage(imageChace[element.src], element.startX, element.startY, element.width, element.height)
        } else {
          const img = new Image()
          img.src = element.src
          img.onload = () => {
            imageChace[element.src] = img
            setElements([...currentElements])
          }
        }
      }
    });
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    isDrawing.current = true;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    startPosition.current = { x, y };

    if (current === "text") {
      setTextInputPos({ x, y });
      return;
    }

    let newElement;
    if (current === "image" && pendingimage) {
      const newImageElement = {
        id: Date.now(),
        type: "image",
        startX: x,
        startY: y,
        width: 90,
        height: 90,
        src: pendingimage,
        Opacity: Opacity,
      };

      setredo([]);
      setPendingImage(null);
      setElements((prevElements) => [...prevElements, newImageElement]);


    }
    if (current === "rectangle") {
      newElement = {
        id: Date.now(),
        type: "rectangle",
        startX: x,
        startY: y,
        width: 0,
        height: 0,
        size: size,
        color: color,
        Opacity: Opacity
      };
    } else if (current === "line") {
      newElement = {
        id: Date.now(),
        type: "line",
        points: [{ x, y }],
        size: size,
        color: color,
        Opacity: Opacity
      };
    } else if (current === 'eraser') {
      newElement = {
        id: Date.now(),
        type: "eraser",
        points: [{ x, y }],
        size: size * 2,
        color: "white"

      }
    } else if (current === "circle") {
      newElement = {
        id: Date.now(),
        type: "circle",
        x: x,
        y: y,
        radius: 2,
        size: size,
        color: color,
        Opacity: Opacity
      }
    }

    setredo([]);
    if (newElement != null)
      setElements((prevElements) => [...prevElements, newElement]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    startPosition.current = null;
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    socket.emit("current-address", { id: socket.id, x, y });

    if (!isDrawing.current || !startPosition.current || current === "text") return;

    const ctx = canvas.getContext("2d");

    if (current === "line" || current === 'eraser') {
      setElements((prevElements) => {
        if (prevElements.length === 0) return prevElements;
        const updatedElements = [...prevElements];
        const lastIdx = updatedElements.length - 1;

        updatedElements[lastIdx] = {
          ...updatedElements[lastIdx],
          points: [...updatedElements[lastIdx].points, { x, y }],
        };

        const date = Date.now();
        if (date - lastcall.current > 30) {
          socket.emit("canvas-data", updatedElements[lastIdx]);
          lastcall.current = date;
        }
        return updatedElements;
      });
    } else if (current === "rectangle" || current == "image") {
      const width = x - startPosition.current.x;
      const height = y - startPosition.current.y;

      setElements((prevElements) => {
        if (prevElements.length === 0) return prevElements;
        const updatedElements = [...prevElements];
        const lastIdx = updatedElements.length - 1;
        updatedElements[lastIdx] = {
          ...updatedElements[lastIdx],
          width: width,
          height: height,
        };


        const date = Date.now();
        if (date - lastcall.current > 30) {
          socket.emit("canvas-data", updatedElements[lastIdx]);
          lastcall.current = date;
        }
        return updatedElements;
      });
    }
    if (current === "circle") {
      setElements((prev) => {
        if (prev.length === 0) return prev
        const updatedElement = [...prev]
        const index = updatedElement.length - 1
        updatedElement[index] = {
          ...updatedElement[index],
          radius: Math.sqrt(Math.pow((updatedElement[index].x - x), 2) + Math.pow((updatedElement[index].y - y), 2))
        }
        const date = Date.now();
        if (date - lastcall.current > 30) {
          socket.emit("canvas-data", updatedElement[index]);
          lastcall.current = date;
        }
        return updatedElement;
      })
    }
  };


  const handleTextSubmit = (e) => {
    if (e.key === "Enter" && textValue.trim() !== "" && textInputPos) {
      const newTextElement = {
        id: Date.now(),
        type: "text",
        startX: textInputPos.x,
        startY: textInputPos.y,
        text: textValue,
        size: size,
        color: color,
      };

      const updated = [...elements, newTextElement];
      setElements(updated);
      socket.emit("canvas-data", newTextElement);
      setTextValue("");
      setTextInputPos(null);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    socket.emit("clear-canvas")
  };

  const undoelement = () => {
    if (elements.length <= 0) return;
    const update = [...elements];
    const element = update.pop();
    setElements(update);
    setredo((prev) => [...prev, element]);
    socket.emit("undo-canvas", update)
  };

  const redoelement = () => {
    if (redo.length === 0) return;
    const newwredo = [...redo];
    const element = newwredo.pop();
    const updated = [...elements, element]
    setElements(updated);
    setredo(newwredo);
    socket.emit("redo-canvas", updated)
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPendingImage(event.target.result);
        setcurrent("image");
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="min-h-screen  bg-purple-100 p-6">
      <div className="flex gap-4 h-[90vh]">
        <ToolsBar
          current={current}
          setcurrent={setcurrent}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          pendingimage={pendingimage}
        />
        <CanvasBoard
          canvasRef={canvasRef}
          background={background}
          handleMouseDown={handleMouseDown}
          handleMouseUp={handleMouseUp}
          handleMouseMove={handleMouseMove}
          pointer={pointer}
          socket={socket}
          current={current}
          textInputPos={textInputPos}
          textValue={textValue}
          setTextValue={setTextValue}
          handleTextSubmit={handleTextSubmit}
        />
        <SeetingsBar
          size={size}
          change={change}
          Opacity={Opacity}
          setOpacity={setOpacity}
          color={color}
          setcolor={setcolor}
          colorSwatches={colorSwatches}
          undoelement={undoelement}
          redoelement={redoelement}
          clearCanvas={clearCanvas}
        />
      </div>
    </div>
  );
}

export default Home;