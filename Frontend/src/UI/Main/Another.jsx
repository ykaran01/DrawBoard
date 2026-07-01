import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { socket } from '../../socket.js';
import ToolsBar from './ToolsBar.jsx';
import { Settings } from './Settings.jsx';
import { Menu } from 'lucide-react';
import Messages from './Messages.jsx';
import { MessageCircle } from 'lucide-react';
import { useSocketCanvas } from '@/Hooks/whiteboardSocket.js';
import { usecanvs } from '@/Hooks/useCanvas.js';
import { useDrawingMode } from '@/Hooks/useDraw.js';
import { useCanvasDrawing } from '@/Hooks/Shapes.js';
import { useContext } from 'react';
import { UserContext } from '@/Userprovider.jsx';
import Navabar from './Navabar.jsx';
import { useParams } from 'react-router-dom';
import { getBoard } from './services/servies.js';
import { saveBoard } from './services/servies.js';
import { useNavigate } from 'react-router-dom';
export const Another = () => {

  const canvasRef = useRef(null);
  const canvasfileref = useRef(null);

  const { fileInputRef, user } = useContext(UserContext)

  const [size, setSize] = useState(3);
  const [current, setcurrent] = useState("line");
  const [color, setcolor] = useState("black");
  const [Opacity, setOpacity] = useState(1);
  const [background, setbackground] = useState("white");
  const [open, onOpenChange] = useState(false)
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const [chatopen, setchatopen] = useState(false)
  const [elements, setElements] = useState(null)
  const { roomid } = useParams()
  const [loading, setloading] = useState(false)
  const [userspointer, setuserpointer] = useState({})
  const [title, setitle] = useState('')

  const naviagte = useNavigate()

  useSocketCanvas(canvasfileref, setuserpointer)
useEffect(() => {
    if (!user || !roomid) return;
    socket.emit("join-room", {
        roomId: roomid,
        user,
    });
    return ()=>{
      socket.emit("room_leave")
    }
}, [roomid, user?._id]);


  const addText = () => {
    const canvas = canvasfileref.current;
    if (!canvas) return;
    const text = new fabric.IText("Double click to edit", {
      id: Date.now().toString(),
      left: 300,
      top: 200,
      fontSize: size * 10,
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

  const handleUndo = async () => {
    const canvas = canvasfileref.current;
    if (!canvas || undoStack.current.length === 0) return;
    const lastObj = undoStack.current.pop();
    const targetId = lastObj.id || (lastObj.toObject && lastObj.toObject(['id']).id);

    if (!targetId) {
      console.error("Cannot undo: object is missing an ID", lastObj);
      return;
    }

    const liveCanvasObject = canvas.getObjects().find(obj => obj.id === targetId);

    if (liveCanvasObject) {
      redoStack.current.push(liveCanvasObject);
      liveCanvasObject.programmatic = true;
      canvas.remove(liveCanvasObject);
      canvas.renderAll();
    } else {
      redoStack.current.push(lastObj);
    }
    socket.emit("undo-canvas", targetId);
    await saveBoard(canvas, roomid)
  };

  const handleRedo = async () => {
    const canvas = canvasfileref.current;
    if (!canvas || redoStack.current.length === 0) return;
    const rawObj = redoStack.current.pop();
    undoStack.current.push(rawObj);
    rawObj.programmatic = true;
    canvas.add(rawObj);
    canvas.renderAll();
    socket.emit("canvas-data", rawObj.toObject(['id']))
    await saveBoard(canvasfileref.current, roomid)
  };
  const clearCanavs = async () => {
    const canvas = canvasfileref.current
    if (!canvas) return
    canvas.clear()
    socket.emit("clear-canvas", [])
    await saveBoard(canvasfileref.current, roomid)
  }

  useEffect(() => {
    const fetchBoard = async () => {
      try {

        const { elements, name } = await getBoard(roomid);
        if (elements == null && name == null) {
          naviagte('/dash')
        }
        setitle(name || 'Untitled')

        setElements(elements || {})

        undoStack.current = elements

      } catch (err) {

        alert(err.message)
      }
    };

    fetchBoard();
  }, [roomid]);

  useEffect(() => {
    if (!canvasfileref.current || !elements) return;
    setloading(true)
    fabric.util.enlivenObjects(elements).then((objects) => {

      objects.forEach((obj) => {

        obj.programmatic = true;
        canvasfileref.current.add(obj);
      });

      canvasfileref.current.renderAll();

    });
    setloading(false)

  }, [elements]);








 
  usecanvs(canvasRef, canvasfileref, background, current, undoStack, redoStack, color, size, Opacity, roomid)

  useDrawingMode({ canvasRef: canvasfileref, current, color, size, opacity: Opacity, background, chatopen
 });

  useCanvasDrawing({ canvasRef: canvasfileref, currentMode: current, setCurrentMode: setcurrent, color, size, socket, username: user?.username });
  if (loading) {
    return (
      <>
        <div className=' w-screen h-screen bg-white/60 '>
          <div className='w-full h-full flex flex-col justify-center items-center gap-6'>

            <div className='w-16 h-16 border-4 border-slate-200 border-b-blue-600 rounded-full animate-spin'></div>
            <p className='text-xl font-semibold text-slate-700 tracking-wide animate-pulse'>
              Loading...
            </p>
          </div>
        </div>
      </>
    );

  }

  return (
    <>
      <Messages chatopen={chatopen} setchatopen={setchatopen} roomid={roomid} />
      <Navabar
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        clearCanvas={clearCanavs}
        canvasfileref={canvasfileref}
        title={title}
        setitle={setitle}
      />
      <div className="min-h-[85vh]  relative bg-purple-100 p-4">

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

          <div
            style={{ pointerEvents: chatopen ? 'none' : 'auto' }}
            className="relative w-full h-[85vh] bg-white shadow shadow-black overflow-hidden">
            <canvas
              ref={canvasRef}
              className="absolute inset-0"
            />
            {
              Object.keys(userspointer).map((key) => {
                const pointer = userspointer[key];
                console.log(userspointer)
                if (key === socket.id) {
                  return null
                }
                return (
                  <div
                    key={key}
                    style={{
                      top: `${pointer.y}px`,
                      left: `${pointer.x}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute pointer-events-none"
                  >

                    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg" />


                    {pointer.name && (
                      <span className="ml-4 px-2 py-0.5 text-xs bg-gray-800 text-white rounded shadow">
                        {pointer.name}
                      </span>
                    )}
                  </div>
                );
              })
            }


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
          setchatopen(true)
        }} className='absolute top-9 right-25 cursor-pointer  border border-purple-400 rounded-full bg-white w-10 h-10 flex justify-center items-center' >
          <MessageCircle size={24} color='#dcb7e1' />
        </div>
        <div onClick={() => {
          onOpenChange(true)
        }} className='absolute top-9 right-10  cursor-pointer  border border-purple-400 rounded-full bg-white w-10 h-10 flex justify-center items-center' >
          <Menu size={24} color='#dcb7e1' />

        </div>

      </div>

    </>
  );
};

export default Another;