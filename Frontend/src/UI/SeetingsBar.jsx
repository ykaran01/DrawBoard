import React from 'react'
import { colorSwatches } from '../Helper/constants';
export const SeetingsBar = ({
  size,
  color,
  setcolor,
  setSize,
  Opacity,
  setOpacity,
  handleUndo,
  handleRedo,
  clearCanvas
}) => {
  return (
    <div className="w-72 bg-slate-900 rounded-[24px] shadow-[0_8px_30px_rgb(216,200,235,0.4)] border-2 border-[#e6daf8] p-5 flex flex-col justify-between">
      <div className="space-y-5">
        <div className="border-b border-[#ebdffc] pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-wide">
              Settings
            </span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#c0a7e9] animate-pulse" />
        </div>
        <div className="bg-[#f3ebfc] rounded-2xl p-3.5 border border-[#e3d5f7]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold tracking-wide text-[#7d6b99]">
              Brush Size
            </h3>
            <span className="text-xs font-mono font-bold bg-white text-[#6c568f] px-2 py-0.5 rounded-full border border-[#ded0f5]">
              {size}px
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value))
            }}
            className="w-full accent-[#a78bfa] cursor-pointer h-1.5 bg-white rounded-lg  border border-[#e1d4f4]"
          />
        </div>
        <div className="bg-[#f3ebfc] rounded-2xl p-3.5 border border-[#e3d5f7]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold tracking-wide text-[#7d6b99]">
              Opacity
            </h3>
            <span className="text-xs font-mono font-bold bg-white text-[#6c568f] px-2 py-0.5 rounded-full border border-[#ded0f5]">
              {Math.round(Opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step={0.1}
            value={Opacity}
            onChange={(e) => {
              e.preventDefault();
              setOpacity(Number(e.target.value));
            }}
            className="w-full accent-[#a78bfa] cursor-pointer h-1.5 bg-white rounded-lg  transition ease-in-out border border-[#e1d4f4]"
          />
        </div>

        <div className="bg-[#f3ebfc] rounded-2xl p-3.5 border border-[#e3d5f7]">
          <h3 className="text-xs font-bold tracking-wide text-[#7d6b99] mb-3">
            Color Swatches
          </h3>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-5 gap-2">
              {colorSwatches.map((swatchColor) => (
                <button
                  key={swatchColor}
                  type="button"
                  onClick={() => setcolor(swatchColor)}
                  className={`w-8 h-8 rounded-xl border-2 cursor-pointer  mx-auto ${color === swatchColor
                    ? "border-[#9370db] ring-4 ring-[#e9e0fd] scale-102 shadow-sm"
                    : "border-transparent"
                    }`}
                  style={{ backgroundColor: swatchColor }}
                  title={swatchColor}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#e2d4f5]">
              <div className="relative w-8 h-8 rounded-xl border-2 border-[#d8cbe7] overflow-hidden shadow-inner ">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setcolor(e.target.value)}
                  className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[10px] tracking-wide text-[#9e8cb8] font-semibold">Selected Ink</span>
                <span className="font-mono text-xs font-bold text-[#5c4d70] uppercase">
                  {color}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2.5 mt-6">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleUndo}
            className="bg-[#eddffd]  text-[#6c568f] text-xs py-2.5 font-bold rounded-xl transition duration-500 active:scale-95 border border-[#dfcbf9]"
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            className="bg-[#eddffd]  text-[#6c568f] text-xs py-2.5 font-bold rounded-xl transition duration-200 active:scale-95 border border-[#dfcbf9]"
          >
            Redo
          </button>
        </div>

        <button
          onClick={clearCanvas}
          className="w-full bg-red-500  text-white text-sm py-3 font-bold rounded-xl active:scale-[0.98]   tracking-wide"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  )
}
export default SeetingsBar