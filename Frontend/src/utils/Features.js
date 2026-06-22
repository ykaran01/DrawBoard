import * as fabric  from "fabric";


export const addText = ({ canvas, size, color, setCurrentMode }) => {
  if (!canvas) return;
  
  const text = new fabric.IText("Double click to edit", {
    id: Date.now().toString(),
    left: 300,
    top: 200,
    fontSize: size * 10,
    fill: color,
    selectable: true,
  });
  
  canvas.add(text);
  canvas.setActiveObject(text);
  setCurrentMode("select");
};

export const handleImageUpload = (e, { canvas, setCurrentMode }) => {
  const file = e.target.files?.[0];
  if (!file || !canvas) return;

  const reader = new FileReader();
  reader.onload = async (f) => {
    const data = f.target?.result;
    if (!data) return;

    const img = await fabric.Image.fromURL(data);
    img.set({
      id: Date.now().toString(),
      left: 200,
      top: 150,
      selectable: true,
    });

    if (img.width > 400) {
      img.scaleToWidth(400);
    }

    canvas.add(img);
    canvas.renderAll();
    setCurrentMode("select");
  };
  reader.readAsDataURL(file);
};

export const handleUndo = ({ canvas, undoStack, redoStack, socket }) => {
  if (!canvas || !undoStack?.current || undoStack.current.length === 0) return;

  const lastObj = undoStack.current.pop();
  redoStack.current.push(lastObj);
  lastObj.programmatic = true;
  canvas.remove(lastObj);
  canvas.renderAll();

  socket.emit("undo-canvas", lastObj.toObject(["id"]).id);
};

export const handleRedo = ({ canvas, undoStack, redoStack, socket }) => {
  if (!canvas || !redoStack?.current || redoStack.current.length === 0) return;

  const rawObj = redoStack.current.pop();
  undoStack.current.push(rawObj);
  rawObj.programmatic = true;
  canvas.add(rawObj);
  canvas.renderAll();

  socket.emit("canvas-data", rawObj.toObject(["id"]));
};


export const clearCanvas = ({ canvas, socket }) => {
  if (!canvas) return;
  canvas.clear();
  socket.emit("clear-canvas", []);
};