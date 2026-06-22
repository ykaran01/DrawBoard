import React from 'react';
import { Values } from "@/Helper/constants";
import { Image, Type } from "lucide-react";

function ToolsBar({
  current,
  setcurrent,
  fileInputRef,
  handleImageUpload,
  addText,
}) {
  return (

    <div className="w-18 bg-slate-900 rounded-xl p-2.5 flex flex-col gap-2.5 shadow-lg h-fit">
      <h2 className="text-white text-center text-xs font-semibold mb-1">
        Tools
      </h2>

      {Values.map((item) => {
        const ItemIcon = item.icon;
        return (
          <button
            title={item.name}
            key={item.id}
            onClick={() => setcurrent(item.id)}
            className={`w-full aspect-square rounded-lg flex items-center justify-center uppercase transition ${
              current === item.id
                ? "bg-purple-600 text-white"
                : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            }`}
          >
            <ItemIcon size={20} />
          </button>
        );
      })}

      <button
        onClick={() => {
          addText();
          setcurrent("text");
        }}
        className={`w-full aspect-square rounded-lg flex items-center justify-center transition ${
          current === "text"
            ? "bg-purple-600 text-white"
            : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
        }`}
      >
        <Type size={20} />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className={`w-full aspect-square rounded-lg flex justify-center items-center transition ${
          current === "image"
            ? "bg-purple-600 text-white"
            : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
        }`}
      >
        <Image size={20} />
      </button>
    </div>
  );
}

export default ToolsBar;