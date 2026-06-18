import { Values } from "../Helper/constants";
import { Image, Type } from "lucide-react";
import { Undo2, Redo2 } from "lucide-react";
function ToolsBar({
  current,
  setcurrent,
  fileInputRef,
  handleImageUpload,
  addText,
  handleUndo,
  handleRedo
}) {
  return (
    <div className="w-20 bg-slate-900 rounded-xl p-3 flex flex-col gap-3 shadow-lg">
      <h2 className="text-white text-center text-sm font-semibold mb-2">
        Tools
      </h2>
      {Values.map((item) => {
        const ItemIcon = item.icon
        return (
          <button
          title={item.name}
            key={item.id}
            onClick={() => setcurrent(item.id)}
            className={`py-2 rounded-lg   flex items-centre justify-center uppercase  transition ${current === item.id
                ? "bg-purple-600 text-white"
                : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
              }`}
          > <ItemIcon></ItemIcon>
          </button>
        );
      })}
      <button
        onClick={() => {
          addText()
          setcurrent("text")
        }}
        className={`py-2 rounded-lg  flex items-center justify-center  transition ${current === "text"
            ? "bg-purple-600 text-white"
            : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
          }`}> <Type />
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
          className={`py-2 rounded-lg  flex justify-center items-center  transition ${current === "image"
              ? "bg-purple-600 text-white"
              : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            }`}>  <Image />
        </button>


        <div className="w-full flex h-full flex-col justify-end gap-2">
             <button
            onClick={handleUndo}
          className={`py-2 rounded-lg w-full flex justify-center items-center  transition ${current === "image"
              ? "bg-purple-600 text-white"
              : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            }`}>  <Undo2 />
        </button>
             <button
            onClick={handleRedo}
          className={`py-2  w-full rounded-lg  flex justify-center items-center  transition ${current === "image"
              ? "bg-purple-600 text-white"
              : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            }`}>  <Redo2 />
        </button>
        </div>
       

      </div>
  );
}

export default ToolsBar;