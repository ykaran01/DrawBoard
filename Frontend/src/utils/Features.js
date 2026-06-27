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

