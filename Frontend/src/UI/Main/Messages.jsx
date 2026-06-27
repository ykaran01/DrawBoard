import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { socket } from "@/socket";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const Messages = ({ chatopen, setchatopen }) => {
    const [username, setUsername] = useState(socket.id || "");
    const [message, setmessage] = useState("");
    const [allmessages, setallmessages] = useState([]);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        const onConnect = () => setUsername(socket.id);
        socket.on("connect", onConnect);
        if (socket.id) setUsername(socket.id);
        return () => socket.off("connect", onConnect);
    }, []);

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

    useEffect(() => {
        if (chatopen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [chatopen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const time = new Date();
        const usermessage = {
            message: message.trim(),
            user: username,
            hrs: String(time.getHours()).padStart(2, "0"),
            min: String(time.getMinutes()).padStart(2, "0"),
        };

        socket.emit("message-sent", usermessage);
        setmessage("");
        inputRef.current?.focus();
    };

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

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-purple-50 to-purple-100">
                    {allmessages.length === 0 && (
                        <p className="text-center text-purple-300 text-sm mt-8">
                            No messages yet. Say hi! 
                        </p>
                    )}
                    {allmessages.map((item, index) => (
                        <div
                            key={index}
                            className={`flex ${item.user === username ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${
                                    item.user === username
                                        ? "bg-purple-500 text-white rounded-br-md"
                                        : "bg-white text-gray-800 rounded-bl-md border border-purple-100"
                                }`}
                            >
                                {item.user !== username && (
                                    <p className="text-[10px] font-semibold text-purple-400 mb-0.5">
                                        {item.user?.slice(0, 8)}
                                    </p>
                                )}
                                <p className="text-sm break-words">{item.message}</p>
                                <p className={`text-[10px] text-right mt-0.5 ${
                                    item.user === username ? "text-purple-200" : "text-gray-400"
                                }`}>
                                    {item.hrs}:{item.min}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="flex-shrink-0 p-3 border-t border-purple-200 bg-white">
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50 px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all"
                    >
                        <input
                            ref={inputRef}
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