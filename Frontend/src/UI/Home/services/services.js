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

export const joinRoom = async (boardId, password) => {
    try {
        
        const { data } = await API.post("/board/join", {
            boardId,
            password,
        });

        return data.success;
    } catch (err) {
        console.error(err.response?.data || err.message);
        return false;
    }
};

export const getUserBoard = async()=>{
    try{
       
        const {data} = await API.get('/board/myboards')
        return data.data 
    }catch(err){
        console.log(err.message)
    }
}

export const deleteboard = async(boardId)=>{
    try{
        const {deta} = await API.delete(`board/delete/${boardId}`)
        console.log(data)
        
    }catch(err){
        console.log(err.message)
    }
}



