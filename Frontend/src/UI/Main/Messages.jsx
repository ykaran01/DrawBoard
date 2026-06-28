import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { socket } from "@/socket";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useContext } from "react";
import { UserContext } from "@/Userprovider";
import { getMessages } from "./services/servies";
const Messages = ({ chatopen, setchatopen ,roomid}) => {
    const { user } = useContext(UserContext)
    
    const [message, setmessage] = useState("");
    const [allmessages, setallmessages] = useState([]);

    const bottomRef = useRef(null);

    useEffect(() => {
        const receiveMessage = (data) => {
            
            setallmessages((prev) => [...prev, data]);
        };
        socket.on("message-recieve", receiveMessage);
        return () => socket.off("message-recieve", receiveMessage);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allmessages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

       
        const usermessage = {
            message: message.trim(),
            user: user._id,
            roomid
         
        };

        socket.emit("message-sent", usermessage);
        setmessage("");

    };
    useEffect(()=>{
        const fetchMessage = async()=>{
            try{
               const data =  await getMessages(roomid)
               setallmessages(data)
            }catch(err){
                console.log(err.message)
            }
        }
        fetchMessage()
    },[])

    return (
        <Sheet open={chatopen} onOpenChange={setchatopen}>
            <SheetContent
                side="right"
                className="w-full md:w-[380px] p-0 flex flex-col gap-0 border-l border-purple-200"
            >

                <SheetHeader className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-violet-500 px-4 py-3 shadow-lg">
                    <SheetTitle className="text-xl font-bold text-white text-left">
                        ChatRoom
                    </SheetTitle>
                </SheetHeader>


                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-purple-50 to-purple-100">
                    {allmessages.length === 0 && (
                        <p className="text-center text-purple-300 text-sm mt-8">
                            No messages yet. Say hi!
                        </p>
                    )}
                    {allmessages.map((item, index) => (
                        <div
                            key={index}
                            className={`flex ${item.sender === user?._id ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${item.sender === user?._id
                                    ? "bg-purple-500 text-white rounded-br-md"
                                    : "bg-white text-gray-800 rounded-bl-md border border-purple-100"
                                    }`}
                            >
                                {item.sender !== user?._id && (
                                    <p className="text-[10px] font-semibold text-purple-400 mb-0.5">
                                        {user?.username}
                                    </p>
                                )}
                                <p className="text-sm break-words">{item.message}</p>
                                <p className={`text-[10px] text-right mt-0.5 ${item.sender === user?._id ? "text-purple-200" : "text-gray-400"
                                    }`}>
                                   {new Date(item.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>


                <div className="flex-shrink-0 p-3 border-t border-purple-200 bg-white">
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50 px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all"
                    >
                        <input

                            type="text"
                            value={message}
                            onChange={(e) => setmessage(e.target.value)}
                            placeholder="Type a message..."
                            autoComplete="off"
                            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Messages;