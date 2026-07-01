import React from "react";
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
    <div className="w-20  z-10 rounded-2xl border border-purple-100 bg-white/90 backdrop-blur-md shadow-xl p-3 flex flex-col gap-2 h-fit">

      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-center text-purple-500">
        Tools
      </h2>

      {Values.map((item) => {
        const ItemIcon = item.icon;

        return (
          <button
            key={item.id}
            title={item.name}
            onClick={() => setcurrent(item.id)}
            className={`group relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 
              ${current === item.id
                ? "bg-violet-600 text-white shadow-lg shadow-purple-300 "
                : "bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-600 "
              }`}
          >
            <ItemIcon size={20} />

            <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0  duration-200 group-hover:opacity-100">
              {item.name}
            </span>
          </button>
        );
      })}

      <div className="mx-auto my-1 h-px w-10 bg-slate-200" />

      <button
        title="Text"
        onClick={() => {
          addText();
          setcurrent("text");
        }}
        className={`group relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 active:scale-95
          ${current === "text"
            ? "bg-violet-600 text-white shadow-lg shadow-purple-300 "
            : "bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-600 "
          }`}
      >
        <Type size={20} />

        <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Text
        </span>
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      <button
        title="Image"
        onClick={() => {
          fileInputRef.current?.click();
          setcurrent("image");
        }}
        className={`group relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 active:scale-95
          ${current === "image"
            ? "bg-violet-600 text-white shadow-lg shadow-purple-300 scale-105"
            : "bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-600 "
          }`}
      >
        <Image size={20} />

        <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Image
        </span>
      </button>
    </div>
  );
}

export default ToolsBar;