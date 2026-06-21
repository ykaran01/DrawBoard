
import React, { useEffect } from 'react'
import { Send } from 'lucide-react';
import { socket } from '@/socket';
import { useState } from 'react';

const Messages = ({ chatopen }) => {
    const username = socket.id
    const [message, setmessage] = useState(null)
    const [allmessages, setallmessages] = useState([])
    const handleSubmit = (e) => {
        const time = new Date(Date.now())
        e.preventDefault()
        if (!message.trim()) return
        const usermessaage = {
            message: message,
            user: username,
            hrs: time.getHours(),
            min: time.getMinutes()
        }
        socket.emit("message-sent", usermessaage)
        setmessage("")

    }
    useEffect(() => {
        socket.on("message-recieve", (data) => {
            setallmessages(prev => [...prev, data])
        })
        return () => {
            socket.off("message-recieve");
        };
    }, [])


    return (
        <div
            className={`absolute top-0 right-0 z-10 flex h-full  w-full md:w-[23vw]
                        transition-all duration-300 ease-in-out
                    ${chatopen
                    ? "translate-x-0 opacity-90"
                    : "translate-x-full opacity-100 pointer-events-none"
                }`}
        >
            <div className="flex w-full flex-col gap-4 p-4 backdrop-blur-md bg-white/70 border-l border-purple-200 shadow-2xl">


                <div className="w-full">
                    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 px-4 py-3 shadow-lg">
                        <h1 className="text-xl font-bold tracking-wide text-white">
                            ChatRoom
                        </h1>

                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-xs text-white">Online</span>
                        </div>
                    </div>
                </div>


                <div className={`h-full w-full overflow-y-auto rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50 to-purple-100 p-4 shadow-inner`}>

                    {allmessages.map((item, index) => (
                        <div
                            key={index}
                            className={`mb-3 flex ${item.user === username
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                        >
                            <div
                                className={`min-w-[30%] max-w-[80%] rounded-2xl px-3 py-2 shadow
            ${item.user === username
                                        ? "bg-purple-500 text-white rounded-br-md"
                                        : "bg-white text-gray-800 rounded-bl-md"
                                    }`}
                            >
                                {item.user !== username && <h3 className="text-xs font-semibold">
                                    {(item.user).slice(0, 8)}
                                </h3>}

                                <p>{item.message}</p>

                                <div className="flex justify-end">
                                    <span className="text-[10px]">
                                        {item.hrs}:{item.min}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-purple-200 bg-white p-2 shadow-md">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => {
                            e.preventDefault()
                            setmessage(e.target.value)
                        }}
                        placeholder="Type a message..."
                        className="flex-1 rounded-xl bg-transparent px-3 py-2 outline-none placeholder:text-gray-400"
                    />

                    <button
                        onClick={handleSubmit}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Messages