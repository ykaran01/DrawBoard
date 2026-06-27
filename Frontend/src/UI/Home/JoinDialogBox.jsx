import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Merge } from 'lucide-react';
import { PencilRuler } from 'lucide-react';
import { createRoom, joinRoom } from "./services/services";
import { useNavigate } from "react-router-dom";
export const JoinDialogBox = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate()
  const [mode, setMode] = useState("select"); 
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("Untitled");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    setMode("select");
    setRoomId("");
    setRoomName("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "join" && (!roomId.trim() || !password.trim())) return;
    if (mode === "create" && (!roomName.trim() || !password.trim())) return;

    setIsLoading(true);
    try {
      if (mode === "join") {
        const data = await  joinRoom(roomId,password)
        if(data){
          navigate(`../room/${roomId}`)
        }
        
      } else {
        const data = await createRoom(roomId,password,roomName)
        if(data){
          navigate(`../room/${roomId}`)
        }
      }
      setIsOpen(false);
      setMode("select"); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) handleBack(); 
    }}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        
        
        {mode === "select" && (
          <div className="flex flex-col gap-6 py-4">
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="text-2xl font-bold">Choose an Action</DialogTitle>
              <DialogDescription>
                Would you like to join an existing board or create a brand new one?
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <button
                type="button"
                onClick={() => setMode("join")}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-zinc-200 hover:border-purple-600 hover:bg-purple-50/50 transition text-center gap-2 group"
              >
                <span className="text-2xl group-hover:scale-110 transition"><Merge/></span>
                <span className="font-semibold text-zinc-800">Join Board</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("create")}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-zinc-200 hover:border-purple-600 hover:bg-purple-50/50 transition text-center gap-2 group"
              >
                <span className="text-2xl group-hover:scale-110 transition"><PencilRuler/></span>
                <span className="font-semibold text-zinc-800">Create Board</span>
              </button>
            </div>
          </div>
        )}

        
        {mode !== "select" && (
          <>
            <button
              type="button"
              onClick={handleBack}
              className="absolute left-6 top-6 text-sm font-medium text-zinc-500 hover:text-purple-600 flex items-center gap-1"
            >
              ← Back
            </button>

            <DialogHeader className="text-center space-y-2 mt-4">
              <DialogTitle className="text-2xl font-bold">
                {mode === "join" ? "Join Board" : "Create Board"}
              </DialogTitle>
              <DialogDescription>
                {mode === "join"
                  ? "Enter the Room ID and password to join the board."
                  : "Set up a room name and password to create a new board."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5">
              
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-zinc-700">Room ID</label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter Room ID"
                    className="h-11 rounded-xl border border-zinc-300 px-4 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              
                { mode=='create' && <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-zinc-700">Room Name</label>
                  <input
                    type="text"
                    value={roomName}
                    
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter Room Name"
                    className="h-11 rounded-xl border border-zinc-300 px-4 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  />
                </div>}
              

              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm text-zinc-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "join" ? "Enter Password" : "Set Room Password"}
                  className="h-11 rounded-xl border border-zinc-300 px-4 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-11 rounded-xl bg-purple-600 text-white font-semibold transition hover:bg-purple-700 disabled:opacity-50"
              >
                {isLoading
                  ? mode === "join" ? "Joining..." : "Creating..."
                  : mode === "join" ? "Join Board" : "Create Board"}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};