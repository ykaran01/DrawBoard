import React, { useState } from "react";
import { createRoom } from "./services/services";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "./services/services";


const Home = () => {
    const navigate = useNavigate()
    const [roomId, setRoomId] = useState("");
    const [title, setTitle] = useState("");
    const [password, setPassword] = useState("");


    const createRoomHandler = async () => {
        try {
            if (!roomId.trim() || !title.trim() || !password.trim()) {
                alert("Please fill all fields");
                return;
            }

            const data = await createRoom(
                roomId,
                password,
                title
            );
            console.log("Room created:", data);
            navigate(`/room/${roomId}`);
        } catch (err) {
            console.error(err);
        }
    };
    const joinRoomHandler = async () => {
        try {
            if (!roomId.trim() || !password.trim()) {
                alert("Please fill all fields");
                return;
            }
            const data = await joinRoom(
                roomId,
                password,
            );
            console.log("Join created:", data);
            navigate(`/room/${roomId}`);

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white">
                        WhiteBoard
                    </h1>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-slate-300 mb-2">
                            Room ID
                        </label>
                        <input
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            type="text"
                            placeholder="Enter Room ID"
                            className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 mb-2">
                            Title
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder="Enter Room Title"
                            className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 mb-2">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter Password"
                            className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg"
                        />
                    </div>

                    <button
                        onClick={joinRoomHandler}
                        type="button"
                        className="w-full py-3 bg-blue-600 text-white rounded-lg"
                    >
                        Join Room
                    </button>

                    <button
                        type="button"
                        onClick={createRoomHandler}
                        className="w-full py-3 bg-slate-700 text-white rounded-lg"
                    >
                        Create New Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;