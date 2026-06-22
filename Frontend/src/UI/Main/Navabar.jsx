import React, { useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  Trash2, 
  Download, 
  Share2, 
  Check, 
  Edit2 
} from 'lucide-react';
import { downloaddata } from '@/Hooks/exportData';
export const Navbar = ({ handleUndo, handleRedo, clearCanvas ,canvasfileref}) => {
  const [boardName, setBoardName] = useState("Untitled Architecture Flow");
  const [isEditingName, setIsEditingName] = useState(false);


  const activeUsers = [
    { initials: "JD", color: "bg-blue-500" },
    { initials: "+3", color: "bg-pink-500" },
  ];

  return (
    <nav className="w-full h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between select-none shadow-sm relative z-20">
      

      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-sm text-white">
          W
        </div>

        {isEditingName ? (
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1">
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              autoFocus
              className="bg-transparent border-none text-sm font-semibold text-slate-800 focus:outline-none w-44"
            />
          </div>
        ) : (
          <div 
            onClick={() => setIsEditingName(true)}
            className="flex items-center gap-2 cursor-pointer group px-1 py-0.5 rounded hover:bg-slate-50 transition"
          >
            <span className="text-sm font-semibold text-slate-800">{boardName}</span>
            <Edit2 size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition" />
          </div>
        )}
        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200/60 text-emerald-600 text-xs px-2 py-0.5 rounded-full font-medium">
          <Check size={12} strokeWidth={3} />
          <span>Saved</span>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-1 flex items-center gap-0.5 shadow-inner">
        <button 
          onClick={handleUndo}
          className="p-2 text-slate-600 hover:bg-white hover:text-purple-600 rounded-lg transition active:scale-95"
          title="Undo"
        >
          <Undo2 size={15} />
        </button>
        <button 
          onClick={handleRedo}
          className="p-2 text-slate-600 hover:bg-white hover:text-purple-600 rounded-lg transition active:scale-95"
          title="Redo"
        >
          <Redo2 size={15} />
        </button>
        
    
        <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>

        <button 
          onClick={clearCanvas}
          className="p-2 text-slate-400 hover:bg-white hover:text-rose-600 rounded-lg transition active:scale-95"
          title="Clear Canvas"
        >
          <Trash2 size={15} />
        </button>
      </div>


      <div className="flex items-center gap-4">

        <div className="flex items-center -space-x-1.5">
          {activeUsers.map((user, idx) => (
            <div
              key={idx}
              className={`w-7 h-7 rounded-full border-2 border-white ${user.color} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
            >
              {user.initials}
            </div>
          ))}
        </div>

 
        <div className="flex items-center gap-4">
    
          <button
        onClick={(e)=>{
            e.preventDefault()
            downloaddata(canvasfileref.current)
        }}
          className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs px-3 py-2 rounded-xl transition active:scale-95">
            <Download size={13} />
            <span>Download</span>
          </button>

          <button className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-purple-600/10 transition active:scale-95">
            <Share2 size={13} />
            <span>Share Room</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;