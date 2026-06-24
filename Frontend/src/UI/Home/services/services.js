import API from '../../../service/API.sevice.js'
import { socket } from '@/socket.js';
export const createRoom = async (boardId, password, title) => {
    try {
        const { data } = await API.post('/board/create', { boardId, password, title });
      
        return data.data.boardId
    } catch (err) {
        console.log(err.message)
    }
}

export const joinRoom = async (boardId, password,) => {
    try {
        const { data } = await API.post("/board/join", {
            boardId,
            password,
        });
       
        return data.data
        
    } catch (err) {
        throw err;
    }
};



