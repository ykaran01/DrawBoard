import React, { useEffect, useRef, useState } from "react";
import { Plus, Users, Calendar, ChevronRight, MoreVertical, Trash2, Search, LayoutDashboard, SlidersHorizontal } from "lucide-react";
import { JoinDialogBox } from "./JoinDialogBox";
import { changeImage, deleteboard, getUserBoard } from "./services/services";
import { useNavigate } from "react-router-dom";
import ChangeName from "./ChangeName";
import ChangeAvatar from "./ChangeAvatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContext } from "react";
import { UserContext } from "@/Userprovider";
import { logOut, search } from './services/services'
import { toast } from "sonner";

const Home = () => {
  const { user, setUserData } = useContext(UserContext)
  const [isOpen, setIsOpen] = useState(false);
  const [boards, setboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState({});

  const [uploadingBoardId, setUploadingBoardId] = useState(null);
  const [avataropen, setavataropen] = useState(false)
  const [nameopen, setnameopen] = useState(false)
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [sort, setSort] = useState("0");
  const firstreload = useRef(true)

  const fetchdata = async () => {
    try {
      setLoading(true);
      const data = await getUserBoard();
      setboards(data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const handledelete = async (boardId) => {
    try {
      toast.warning("Are you sure you want to delete this?", {
        position: "top-center",
        action: {
          label: "Confirm",
          onClick: async() => {
            await deleteboard(boardId)
            const newboard = boards.filter((item) => item._id !== boardId)
            setboards(newboard)
          },
        },
        cancel: {
          label: "Cancel",
          onClick: () => {
            return
          }
        },
        duration: Infinity,
      });
    } catch (err) {
      toast.error(err.message)
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

      await changeImage(boardId, formData)
      toast.success("Image Successfully Updated")

      setSelectedFiles((prev) => {
        const updated = { ...prev };
        delete updated[boardId];
        return updated;
      });
      fetchdata();
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploadingBoardId(null);
    }
  };

  const LogOut = async () => {
    try {
      await logOut()
      toast.success("LogOut Succesfull")
      setUserData(null)
      navigate('/')
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    if (firstreload.current) {
      firstreload.current = false;
      return;
    }

    if (name === "" && sort === "0") {
      fetchdata();
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await search(name, sort);
        setboards(data || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [name, sort]);

  return (
    <>
      <JoinDialogBox isOpen={isOpen} setIsOpen={setIsOpen} />
      <ChangeName nameopen={nameopen} setnameopen={setnameopen} user={user} />
      <ChangeAvatar avataropen={avataropen} setavataropen={setavataropen} avatar={user?.avatar} />
      
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans w-full antialiased">
        
        {/* Responsive Navbar */}
        <nav className="bg-white border-b w-full border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-0 md:h-20 flex flex-col md:flex-row gap-4 md:gap-6 justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 cursor-pointer w-full md:w-auto justify-between md:justify-start" onClick={() => navigate('/')}>
              <div className="flex items-center gap-2">
                <LayoutDashboard size={26} className="text-indigo-600" />
                <span>DrawBoard</span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center w-full md:max-w-xl flex-1 gap-3">
              <div className="flex w-full items-center rounded-xl shadow-zinc-300 hover:shadow-md border bg-zinc-100 px-3 py-2 transition-all">
                <Search size={18} className="text-zinc-500 shrink-0" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Type to search..."
                  className="ml-2 w-full bg-transparent outline-none text-sm"
                />
              </div>
              
              <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shrink-0">
                <SlidersHorizontal size={16} className="text-slate-400" />
                <select 
                  onChange={(e) => setSort(e.target.value)} 
                  className="w-full sm:w-auto bg-transparent text-sm outline-none cursor-pointer font-medium text-slate-600"
                >
                  <option value="0">All Matches</option>
                  <option value="-1">Newest First</option>
                  <option value="1">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Actions (Create Button & Profile) */}
            <div className="flex gap-3 md:gap-4 items-center w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0" >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(true);
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition-all text-sm"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span className="hidden xs:inline sm:inline">Create or Join Board</span>
                <span className="inline xs:hidden sm:hidden">Create/Join</span>
              </button>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-10 h-10 rounded-full bg-slate-100 flex justify-center items-center object-cover cursor-pointer ring-2 ring-transparent hover:ring-indigo-500 transition-all focus:outline-none shrink-0">
                    <img className="rounded-full w-10 h-10 object-cover border border-slate-200" src={user?.avatar || "https://png.pngtree.com/png-vector/20240611/ourlarge/pngtree-user-profile-icon-image-vector-png-image_12640450.png"} alt="profile" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-32px)] sm:w-80 max-w-sm mt-2 mr-4 sm:mr-0 z-50">
                  <div className="w-full rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col items-center bg-black rounded-3xl p-4">
                      <img
                        src={user?.avatar || "https://png.pngtree.com/png-vector/20240611/ourlarge/pngtree-user-profile-icon-image-vector-png-image_12640450.png"}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover border"
                      />
                      <h2 className="mt-4 text-xl font-semibold text-white text-center break-all">
                        {user?.name}
                      </h2>
                      <p className="text-sm text-zinc-400 break-all">@{user?.username}</p>
                    </div>

                    <div className="mt-6 border-t pt-4">
                      <div className="flex flex-col sm:flex-row justify-between text-sm gap-1">
                        <span className="text-slate-500">Email</span>
                        <span className="text-blue-500 break-all sm:text-right">{user?.email}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                      <button onClick={(e) => {
                        e.preventDefault()
                        setnameopen(true)
                      }} className="w-full rounded-md border cursor-pointer border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 transition">
                        Edit Name
                      </button>

                      <button onClick={(e) => {
                        e.preventDefault()
                        setavataropen(true)
                      }} className="w-full rounded-md border cursor-pointer border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 transition">
                        Change Avatar
                      </button>
                      
                      <button onClick={(e) => {
                        e.preventDefault()
                        LogOut()
                      }} className="w-full rounded-md border cursor-pointer border-slate-300 px-4 text-red-500 py-2 text-sm font-medium hover:bg-slate-100 transition">
                        LogOut
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

          </div>
        </nav>

        {/* Board Main Workspace */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {boards.map((board) => {
                const currentFile = selectedFiles[board._id];

                return (
                  <div
                    key={board._id}
                    onClick={() => navigate(`../room/${board.boardId}`)}
                    className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      <div className="relative mb-3">
                        <div className="rounded-xl overflow-hidden bg-slate-100 aspect-video flex items-center justify-center">
                          {board.image ? (
                            <img src={board.image} alt={board.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-slate-400">No cover image</span>
                          )}
                        </div>

                        <div className="absolute top-2 left-2 z-30">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handledelete(board._id)
                            }}
                            className="p-1.5 cursor-pointer hover:bg-red-500 bg-white/95 rounded-full text-red-600 hover:text-white shadow-sm transition-all"
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
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
                              className="w-56 p-4 space-y-3 z-40"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="space-y-2">
                                <label
                                  htmlFor={`image-${board._id}`}
                                  className="flex h-24 w-full cursor-pointer flex-col items-center justify-center text-center rounded-lg border-2 border-dashed border-slate-300 p-2 text-xs"
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
                        <span className="truncate mr-2">{board.title}</span>
                        <ChevronRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </h2>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-slate-500">
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
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Home;