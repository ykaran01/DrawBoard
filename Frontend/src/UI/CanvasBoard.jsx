function CanvasBoard({
  canvasRef,
  background,
  pointer,
  socket,
  current,
  textInputPos,
  textValue,
  setTextValue,
  handleTextSubmit,
}) {
  return (
    <div className="relative w-[1210px] h-[670px]">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 rounded-xl shadow-xl border cursor-crosshair"
        style={{ background }}
      />
      {current === "text" && textInputPos && (
        <div
          className="absolute z-40"
          style={{
            left: `${textInputPos.x}px`,
            top: `${textInputPos.y - 10}px`,
          }}
        >
          <textarea
            cols="35"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={handleTextSubmit}
            placeholder="Press Enter"
            className="border border-indigo-500 bg-white px-2 py-1 rounded shadow outline-none"
          />
        </div>
      )}
    </div>
  );
}

export default CanvasBoard;