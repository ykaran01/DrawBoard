import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import React from 'react'
import { colorSwatches } from "@/Helper/constants"

export const Settings = ({
    size,
    color,
    setcolor,
    setSize,
    Opacity,
    setOpacity,
    clearCanvas,
    open,
    onOpenChange,
    background,       // 1. Accept background color state from parent
     setbackground
    // 2. Accept background color setter from parent
}) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        
            <SheetContent className="w-[400px] bg-white/30 border-l border-zinc-200 p-6 flex flex-col justify-between">
                
                <SheetHeader className="mb-2">
                    <SheetTitle className="text-2xl font-extrabold text-zinc-900 tracking-tight">
                        Settings
                    </SheetTitle>
                </SheetHeader>

                
                <div className="flex-1 flex flex-col gap-5 overflow-y-auto py-2 pr-1">
                    
                    
                    <div className="bg-[#f3ebfc] rounded-2xl p-4 border border-[#e3d5f7] shadow-xs">
                        <div className="flex justify-between items-center mb-2.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7d6b99]">
                                Brush Size
                            </h3>
                            <span className="text-xs font-mono font-bold bg-white text-[#6c568f] px-2.5 py-0.5 rounded-full border border-[#ded0f5]">
                                {size}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            className="w-full accent-[#a78bfa] cursor-pointer h-1.5 bg-white rounded-lg border border-[#e1d4f4]"
                        />
                    </div>

                    
                    <div className="bg-[#f3ebfc] rounded-2xl p-4 border border-[#e3d5f7] shadow-xs">
                        <div className="flex justify-between items-center mb-2.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7d6b99]">
                                Opacity
                            </h3>
                            <span className="text-xs font-mono font-bold bg-white text-[#6c568f] px-2.5 py-0.5 rounded-full border border-[#ded0f5]">
                                {Math.round(Opacity * 100)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step={0.1}
                            value={Opacity}
                            onChange={(e) => setOpacity(Number(e.target.value))}
                            className="w-full accent-[#a78bfa] cursor-pointer h-1.5 bg-white rounded-lg border border-[#e1d4f4]"
                        />
                    </div>

                    <div className="bg-[#f3ebfc] rounded-2xl p-4 border border-[#e3d5f7] shadow-xs">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#7d6b99] mb-3">
                            Color Swatches for Brush
                        </h3>

                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-5 gap-2">
                                {colorSwatches.map((swatchColor) => (
                                    <button
                                        key={`brush-${swatchColor}`}
                                        type="button"
                                        onClick={() => setcolor(swatchColor)}
                                        className={`w-8 h-8 rounded-xl border-2 cursor-pointer transition-all ${
                                            color === swatchColor
                                                ? "border-[#9370db] ring-4 ring-[#e9e0fd] scale-105"
                                                : "border-transparent hover:scale-105"
                                        }`}
                                        style={{ backgroundColor: swatchColor }}
                                        title={swatchColor}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center gap-3 pt-3 border-t border-[#e2d4f5]">
                                <div className="relative w-8 h-8 rounded-xl border-2 border-[#d8cbe7] overflow-hidden shadow-inner flex-shrink-0">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => setcolor(e.target.value)}
                                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-sans text-[10px] tracking-wide text-[#9e8cb8] font-bold uppercase">Selected Ink</span>
                                    <span className="font-mono text-xs font-bold text-[#5c4d70] uppercase">
                                        {color}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f3ebfc] rounded-2xl p-4 border border-[#e3d5f7] shadow-xs">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#7d6b99] mb-3">
                            Canvas Background
                        </h3>

                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-5 gap-2">
                                {colorSwatches.map((swatchColor) => (
                                    <button
                                        key={`bg-${swatchColor}`}
                                        type="button"
                                        onClick={() => setbackground(swatchColor)}
                                        className={`w-8 h-8 rounded-xl border-2 cursor-pointer transition-all ${
                                            background === swatchColor
                                                ? "border-[#9370db] ring-4 ring-[#e9e0fd] scale-105"
                                                : "border-transparent hover:scale-105"
                                        }`}
                                        style={{ backgroundColor: swatchColor }}
                                        title={swatchColor}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center gap-3 pt-3 border-t border-[#e2d4f5]">
                                <div className="relative w-8 h-8 rounded-xl border-2 border-[#d8cbe7] overflow-hidden shadow-inner flex-shrink-0">
                                    <input
                                        type="color"
                                        value={background}
                                        onChange={(e) => setbackground(e.target.value)}
                                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-sans text-[10px] tracking-wide text-[#9e8cb8] font-bold uppercase">Background Color</span>
                                    <span className="font-mono text-xs font-bold text-[#5c4d70] uppercase">
                                        {background}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

               
                <div className="space-y-2.5 mt-4 pt-4 border-t border-zinc-100">
                    <button
                        onClick={clearCanvas}
                        className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-3 font-bold rounded-xl transition duration-150 active:scale-[0.98] tracking-wide shadow-sm"
                    >
                        Clear Canvas
                    </button>
                </div>
               
            </SheetContent>
        </Sheet>
    )
}