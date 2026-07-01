import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { changename } from './services/services';
const ChangeName = ({nameopen,setnameopen ,user}) => {
    const [newname, setname] = useState("")
    const handleSubmit = async()=>{
        if(!newname) return;
        try{
            await changename(newname.trim())
            user.name = newname.trim()
            setname("")
            setnameopen(false)
        }catch(err){
            alert(err.message)
        }

    }

    return (

        <Dialog open={nameopen} onOpenChange={setnameopen} >
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-bold">
                        Change Your Name
                    </DialogTitle>

                    <DialogDescription className="text-center">
                        Update your display name.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <label className="text-sm font-medium text-slate-600">
                            Current Name
                        </label>
                        <input
                            type="text"
                            value={user?.name}
                            disabled
                            className="w-full mt-1 px-4 py-2 rounded-xl border bg-slate-100 text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-600">
                            New Name
                        </label>
                        <input
                            type="text"
                            value={newname}
                            placeholder="Enter your new name"
                            onChange={(e)=>{
                                e.preventDefault()
                                setname(e.target.value)
                            }}
                            className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                        />
                    </div>

                    <button  
                        onClick={handleSubmit}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
                        Submit
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ChangeName