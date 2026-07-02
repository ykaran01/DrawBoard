import React, { useState, useEffect } from 'react';
import { socket } from '@/socket';
import {
  Undo2,
  Redo2,
  Trash2,
  Users,
  SquareArrowRightEnter
} from 'lucide-react';
import {
  Avatar,

  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { downloaddata, convertjson, convetSvg } from '@/Hooks/exportData';
import {
  Image,
  FileImage,
  FileJson,
  PaintBucket
} from "lucide-react";
import UserList from './UserList';
export const Navbar = ({ handleUndo, handleRedo, clearCanvas, canvasfileref, title, toggle, setoggle }) => {
  const naviagte = useNavigate()
  const [open, setOpen] = useState(false);
  const [users, setusers] = useState([])


  useEffect(() => {
    socket.on("present_user", (data) => {
      setusers(data)
    })
  })

  const handleleave = () => {
    naviagte('/dash')
    socket.emit("room_leave")
  }


  return (
    <nav className="w-full h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between  shadow-sm relative ">

      <UserList open={open} setOpen={setOpen} users={users} />

      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-sm text-white">
          W
        </div>


        <div

          className="flex items-center gap-2  group px-1 py-0.5 rounded hover:bg-slate-50 transition"
        >
          <span className=" font-semibold text-slate-800">{title}</span>

        </div>


      </div>
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-1 flex items-center gap-0.5 shadow-inner">
        <button
          onClick={handleUndo}
          className="p-2 text-slate-600 hover:bg-white  cursor-pointer hover:text-purple-600 rounded-lg transition active:scale-95"
          title="Undo"
        >
          <Undo2  className='hover:scale-105' size={15} />
        </button>
        <button
          onClick={handleRedo}
          className="p-2 text-slate-600 hover:bg-white cursor-pointer  hover:text-purple-600 rounded-lg transition active:scale-95"
          title="Redo"
        >
          <Redo2  className='hover:scale-105' size={15} />
        </button>




        <button
          onClick={clearCanvas}
          className="p-2 text-slate-400  cursor-pointer hover:bg-white hover:text-rose-600  rounded-lg transition active:scale-95"
          title="Clear Canvas"
        >
          <Trash2  className='hover:scale-105' size={15} />
        </button>
        <button
          onClick={() => setoggle((prev) => !prev)}
          className={`p-2 rounded-lg transition   cursor-pointer active:scale-95 ${toggle
              ? "bg-purple-600 text-white"
              : "bg-transparent text-gray-500 hover:bg-gray-100"
            }`}
          title={toggle ? "Filled Shapes" : "Outline Shapes"}
        >
          <PaintBucket  className='hover:scale-105' size={16} />
        </button>
      </div>


      <div className="flex items-center gap-4">

        <div className="flex items-center -space-x-1.5">
          <AvatarGroup>
            {users.slice(0, Math.min(2, users.length)).map((items) => {
              return (

                <Avatar>
                  <AvatarImage src={items.avatar} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

              )
            })}
            {users.length > 2 && <AvatarGroupCount>+{users.length - 2}</AvatarGroupCount>}
          </AvatarGroup>
        </div>





        <div className="flex items-center gap-4">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => downloaddata(canvasfileref.current)} >
                  <Image className="mr-2 h-4 w-4" />
                  PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => convetSvg(canvasfileref.current)} >
                  <FileImage className="mr-2 h-4 w-4" />
                  SVG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => convertjson(canvasfileref.current)} >
                  <FileJson className="mr-2 h-4 w-4" />
                  JSON
                </DropdownMenuItem>

              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={handleleave}
            className="flex items-center gap-1.5 bg-red-400 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl ">
            <SquareArrowRightEnter size={13} />
            <span>Leave Room</span>
          </button>

        </div>
        <div className="flex items-center gap-2">

          <button onClick={() => setOpen(true)} className="  shadow-purple-600  shadow cursor-pointer text-slate-600 text-xs  py-2 px-2 rounded-full border font-semibold"> <Users /></button>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;