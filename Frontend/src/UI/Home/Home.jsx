import React, { useEffect, useState } from "react";
import { Plus, Users, Calendar, ChevronRight, MoreVertical, Trash2 } from "lucide-react";
import { JoinDialogBox } from "./JoinDialogBox";
import { changeImage, deleteboard, getUserBoard } from "./services/services";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [boards, setboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState({});

  const [uploadingBoardId, setUploadingBoardId] = useState(null);

  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      setLoading(true);
      const data = await getUserBoard();
      setboards(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const handledelete = async (boardId) => {
    try {
      await deleteboard(boardId)
    } catch (err) {
      console.log(err)
    }
  }


  const handleFileChange = (boardId, file) => {
    if (!file) return;
    setSelectedFiles((prev) => ({
      ...prev,
      [boardId]: file,
    }));
  };


  const handleSaveImage = async (e, boardId) => {
    e.preventDefault();
    e.stopPropagation();

    const file = selectedFiles[boardId];
    if (!file) return alert("Please select an image first!");

    try {
      setUploadingBoardId(boardId);


      const formData = new FormData();
      formData.append("image", file);

    await changeImage(boardId,formData)

      setSelectedFiles((prev) => {
        const updated = { ...prev };
        delete updated[boardId];
        return updated;
      });
      fetchdata();
    } catch (err) {
      console.error("Failed to upload image:", err);
    } finally {
      setUploadingBoardId(null);
    }
  };

  return (
    <>
      <JoinDialogBox isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">


        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">DrawBoard</h1>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(true);
              }}
              className="inline-flex items-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition-all text-sm"
            >
              <Plus size={18} strokeWidth={2.5} />
              Create or Join Board
            </button>
          </div>
        </nav>


        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="h-40 rounded-xl bg-slate-200 mb-4" />
                  <div className="h-5 w-2/3 bg-slate-200 rounded mb-6" />
                  <div className="flex justify-between mt-8">
                    <div className="h-4 w-16 bg-slate-200 rounded" />
                    <div className="h-4 w-12 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : boards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {boards.map((board) => {
                const currentFile = selectedFiles[board._id];

                return (
                  <div
                    key={board._id}
                    onClick={() => navigate(`../room/${board.boardId}`)}
                    className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm  flex flex-col justify-between cursor-pointer"
                  >
                    <div>

                      <div className="relative mb-3">
                        <div className="rounded-xl overflow-hidden  bg-slate-100 aspect-video flex items-center justify-center">
                          {board.image ? (
                            <img src={board.image} alt={board.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-slate-400">No cover image</span>
                          )}
                        </div>

                        <div className="absolute top-2 left-3 z-30">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handledelete(board._id)
                            }

                            }
                            className="p-1.5 bg-white/95  rounded-full text-slate-600 shadow-sm transition-all border border-slate-200"
                          >
                            <Trash2 color="red" size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                        <div className="absolute top-2 right-2 z-30">

                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full text-slate-600 shadow-sm transition-all border border-slate-200"
                              >
                                <MoreVertical size={16} strokeWidth={2.5} />
                              </button>
                            </PopoverTrigger>

                            <PopoverContent
                              className="w-56 p-4 space-y-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="space-y-2">
                                <label
                                  htmlFor={`image-${board._id}`}
                                  className="flex h-24 w-full cursor-pointer flex-col items-center justify-center text-center rounded-lg border-2 border-dashed border-slate-300 p-2 text-xs "
                                >
                                  <span className="font-medium text-slate-600 truncate max-w-full px-1">
                                    {currentFile ? currentFile.name : "Click to upload image"}
                                  </span>
                                </label>

                                <input
                                  id={`image-${board._id}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(board._id, e.target.files[0])}
                                />

                                <button
                                  onClick={(e) => handleSaveImage(e, board._id)}
                                  disabled={uploadingBoardId === board._id || !currentFile}
                                  className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                                >
                                  {uploadingBoardId === board._id ? "Saving..." : "Save Cover"}
                                </button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <h2 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200 flex items-center justify-between">
                        {board.title}
                        <ChevronRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h2>
                    </div>


                    <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-slate-500">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Users size={14} />
                        <span>{board?.users?.length || 0} members</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Calendar size={12} />
                        <span>
                          {board?.createdAt ? new Date(board.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto p-8 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-1">No active boards</h3>
              <p className="text-sm text-slate-500 mb-6">Get started by making your first workspace.</p>
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-xl text-sm transition"
              >
                <Plus size={16} /> Join / Create Board
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Home;