import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { socket } from '../../socket.js';
import ToolsBar from './ToolsBar.jsx';
import { Settings } from './Settings.jsx';
import { Menu, IterationCcw } from 'lucide-react';
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
import { authoriseUser } from './services/servies.js';
import { toast } from 'sonner'
import Version from './Version.jsx';

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
  const [toggle, setoggle] = useState(false)
  const [role, setrole] = useState("")
  const [versionOpen, setVersionOpen] = useState(false)


  const appliedToCanvas = useRef(null)
  const unmounted = useRef(false)

  const ispanning = useRef(false)
  const naviagte = useNavigate()

  useSocketCanvas(canvasfileref, setuserpointer)
  useEffect(() => {
    const userauthorised = async () => {
      try {
        await authoriseUser(roomid, user?._id)

      } catch (err) {
        toast.error(err.message)
        naviagte('/dash')
      }
    }
    userauthorised()
  }, [user?._id, roomid])

  useEffect(() => {
    if (!user || !roomid) return;
    socket.emit("join-room", {
      roomId: roomid,
      user,
    });
    socket.on("present_user", (data) => {
      const userole = data.find((u) => u.id == user._id)?.role
      setrole(userole || null)
    })
    socket.on("user_join",(data)=>{
      toast.info(`${data.name} joined`)
    })

    return () => {
      socket.emit("room_leave")
    }
  }, [roomid, user?._id]);

  const canEdit = role === 'Admin' || role === 'editor'



  const canEditRef = useRef(false)
  canEditRef.current = canEdit

  const attachTextSync = (text) => {
    if (!text || text.__syncAttached) return
    text.__syncAttached = true


    text.on('editing:entered', () => {
      if (!canEditRef.current) text.exitEditing()
    })

    text.on('editing:exited', async () => {
      if (!canEditRef.current) return
      const canvas = canvasfileref.current
      if (!canvas) return


      if (!text.text || !text.text.trim()) {
        text.programmatic = true
        canvas.remove(text)
        canvas.requestRenderAll()
        socket.emit("undo-canvas", text.id)
        await saveBoard(canvas, roomid)
        return
      }

      socket.emit("canvas-data", text.toObject(["id"]))
      await saveBoard(canvas, roomid)
    })
  }

  const addText = () => {
    if (!canEdit) return;

    const canvas = canvasfileref.current;
    if (!canvas) return;

    const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0]
    const zoom = canvas.getZoom ? canvas.getZoom() : 1
    const centerX = (canvas.getWidth() / 2 - vpt[4]) / zoom
    const centerY = (canvas.getHeight() / 2 - vpt[5]) / zoom

    const text = new fabric.IText("Text", {
      id: Date.now().toString(),
      left: centerX,
      top: centerY,
      originX: 'center',
      originY: 'center',
      fontSize: Math.max(12, Number(size) * 6),
      fontFamily: 'Arial',
      fill: color,
      opacity: Opacity,
      selectable: true,
      editable: true,
    });

    attachTextSync(text)

    canvas.add(text);
    canvas.setActiveObject(text);


    text.enterEditing()
    text.selectAll()
    canvas.requestRenderAll();



    setcurrent("select");
  };

  const handleImageUpload = (e) => {
    if (!canEdit) return;
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
    if (!canEdit) return;
    const canvas = canvasfileref.current;
    if (!canvas || undoStack.current.length === 0) return;
    const lastObj = undoStack.current.pop();
    const targetId = lastObj.id || (lastObj.toObject && lastObj.toObject(['id']).id);



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
    if (!canEdit) return;
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

    if (!canEdit) return;
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

        setitle(name || 'Untitled')


        const list = Array.isArray(elements) ? elements : []

        appliedToCanvas.current = null

        setElements(list)

        undoStack.current = [...list]

      } catch (err) {
        naviagte('/dash')
        toast.error(err.message)
      }
    };

    fetchBoard();
  }, [roomid]);


  useEffect(() => {

    const handleup = (options) => {
      if (!canEdit) return;
      const tag = options.target.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || options.target.isContentEditable) return;

      options.preventDefault()
      if (options.code === "Space") {
        options.preventDefault();
        ispanning.current = true;
        return;
      }
      if (!["Delete", "KeyZ", "KeyY"].includes(e.code)) return;
      options.preventDefault()
      if (options.code === "Space") ispanning.current = true;
      if (options.code == "Delete") clearCanavs()
      else if (options.code == "KeyZ") handleUndo()
      else if (options.code == "KeyY") handleRedo()



    }
    const handledown = (options) => {
      options.preventDefault()
      if (options.code !== "Space") return
      ispanning.current = false
    }

    window.addEventListener("keydown", handleup)
    window.addEventListener("keyup", handledown)

    return () => {
      window.removeEventListener("keyup", handleup)
      window.removeEventListener("keydown", handledown)

    }
  }, [])

  usecanvs(canvasRef, canvasfileref, background, current, undoStack, redoStack, color, size, Opacity, roomid, canEdit)

  useDrawingMode({ canvasRef: canvasfileref, current, color, size, opacity: Opacity, background, chatopen, canEdit });

  useCanvasDrawing({ canvasRef: canvasfileref, currentMode: current, setCurrentMode: setcurrent, color, size, socket, username: user?.username, ispanning, toggle, avatar: user?.avatar, canEdit });


  useEffect(() => {
    unmounted.current = false
    return () => { unmounted.current = true }
  }, [])

  useEffect(() => {
    const canvas = canvasfileref.current
    if (!canvas || !elements) return
    if (appliedToCanvas.current === canvas) return
    appliedToCanvas.current = canvas

    fabric.util.enlivenObjects(elements).then((objects) => {

      if (unmounted.current || canvasfileref.current !== canvas) return

      objects.forEach((obj) => {
        obj.programmatic = true;
        canvas.add(obj);
        if (obj instanceof fabric.IText) attachTextSync(obj);
      });

      canvas.requestRenderAll();
    })
  },[])

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
    <Version open={versionOpen} onOpenChange={setVersionOpen} roomId={roomid} canvasfileref={canvasfileref} undoStack={undoStack}
        setElements={setElements} redoStack={redoStack} canEdit={canEdit} setVersionOpen={setVersionOpen}/>
      <Messages chatopen={chatopen} setchatopen={setchatopen} roomid={roomid} />
      <Navabar
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        clearCanvas={clearCanavs}
        canvasfileref={canvasfileref}
        title={title}
        setitle={setitle}
        setoggle={setoggle}
        toggle={toggle}
        roomId={roomid}
       

      />

      <div className="min-h-[85vh] relative bg-purple-100 p-2 sm:p-4">

        <div className="flex flex-col md:flex-row gap-2 sm:gap-4 h-auto md:h-[90vh]">


          <div className="w-full md:w-auto order-1 z-50 overflow-x-auto md:overflow-visible no-scrollbar">
            {(role === 'Admin' || role == 'editor') && <ToolsBar
              current={current}
              setcurrent={setcurrent}
              fileInputRef={fileInputRef}
              handleImageUpload={handleImageUpload}
              addText={addText}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
            />}
          </div>

          <div
            style={{ pointerEvents: chatopen ? 'none' : 'auto' }}
            className="relative order-2 w-full flex-1 h-[60vh] md:h-[85vh] bg-white shadow shadow-purple-400 rounded-2xl overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              className="absolute"
            />
            {
              Object.keys(userspointer).map((key) => {
                const pointer = userspointer[key];

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
                    <img src={pointer?.avatar} className="w-4 h-4 bg-blue-500 rounded-full border-2 object-cover border-white shadow-lg" />

                    {pointer?.name && (
                      <span className="ml-4 px-2 py-0.5 text-xs bg-gray-800 text-white rounded shadow">
                        {pointer?.name}
                      </span>
                    )}
                  </div>
                );
              })
            }
          </div>

          <div className="order-3 md:order-none">
            {(role === 'Admin' || role == 'editor') && <Settings
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
            />}
          </div>
        </div>
        {role === "Admin" && (
          <div
            onClick={() => setVersionOpen(true)}
            className="absolute top-4 sm:top-9 right-24 sm:right-40
    cursor-pointer border border-purple-400 rounded-full
    bg-white w-9 h-9 sm:w-10 sm:h-10
    flex justify-center items-center"
          >
            <IterationCcw
              size={20}
              className="sm:w-6 sm:h-6"
              color="#dcb7e1"
            />
          </div>
        )}

        <div
          onClick={() => setchatopen(true)}
          className="absolute top-4 sm:top-9 right-12 sm:right-24
  cursor-pointer border border-purple-400 rounded-full
  bg-white w-9 h-9 sm:w-10 sm:h-10
  flex justify-center items-center"
        >
          <MessageCircle
            size={20}
            className="sm:w-6 sm:h-6"
            color="#dcb7e1"
          />
        </div>

        {(role === "Admin" || role === "editor") && (
          <div
            onClick={() => onOpenChange(true)}
            className="absolute top-4 sm:top-9 right-0 sm:right-8
    cursor-pointer border border-purple-400 rounded-full
    bg-white w-9 h-9 sm:w-10 sm:h-10
    flex justify-center items-center"
          >
            <Menu
              size={20}
              className="sm:w-6 sm:h-6"
              color="#dcb7e1"
            />
          </div>
        )}


      </div>
    </>
  );
};

export default Another;