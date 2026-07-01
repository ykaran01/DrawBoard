import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
 
} from "@/components/ui/dialog";
import { changeAvatar } from "./services/services";

const ChangeAvatar = ({avataropen ,setavataropen ,avatar}) => {
 const [file, setfile] = useState(null)
  
  const handleImageChange = async(e) => {
   setfile(e.target.files[0])
  
  };
  const handlesubmit = async()=>{
    if(!file) return ;

    const formdata = new FormData()
    formdata.append("avatar",file)
    try{
      await changeAvatar(formdata)
        setfile(null)
      setavataropen(false)
      
    }catch(err){
      alert(err.message)
    }
  }

  return (
    <Dialog open={avataropen} onOpenChange={setavataropen} >
      

      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Change Profile Picture
          </DialogTitle>

          <DialogDescription className="text-center">
            Upload a new profile picture.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 mt-4">
          <img
            src={avatar}
            alt="Avatar Preview"
            className="w-36 h-36 rounded-full object-cover border-4 border-blue-500"
          />

          <label className="cursor-pointer px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition">
            Choose Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          {
            file!=null && <div>
             { file.name}
            </div>
          }

          <div className="flex w-full gap-3">
            <button 
            onClick={()=>{
              setavataropen(false)
            }}
            className="flex-1 py-2 rounded-lg border border-slate-300 hover:bg-slate-100">
              Cancel
            </button>

            <button  onClick={handlesubmit} className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAvatar;