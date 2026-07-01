import API from '../../../service/API.sevice.js'

export const createRoom = async (boardId, password, title) => {
    try {
        const { data } = await API.post('/board/create', { boardId, password, title });

        return data.data.boardId
    } catch (err) {
        throw new Error(err.response?.data?.message || "Something went wrong");
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
        throw new Error(err.response?.data?.message || "Something went wrong");
    }
};

export const getUserBoard = async () => {
    try {

        const { data } = await API.get('/board/myboards')
        return data.data
    } catch (err) {
       throw new Error(err.response?.data?.message || "Something went wrong");
    }
}

export const deleteboard = async (boardId) => {
    try {
        const { deta } = await API.delete(`board/delete/${boardId}`)
        console.log(data)

    } catch (err) {
         throw new Error(err.response?.data?.message || "Something went wrong");
    }
}

export const changeImage = async (boardId, formdata) => {
    try {
        const { data } = await API.patch(`/board/changeImage/${boardId}`, formdata)
        console.log(data)
    } catch (err) {
        throw new Error(err.response?.data?.message || "Something went wrong");
    }
}


export const changeAvatar = async(formdata)=>{
   try{
        const res = await API.patch('/user/avatar',formdata)
        
   }catch(err){
    throw new Error(err.response?.data?.message || "Something went wrong");
   } 
}

export const changename = async(name)=>{
    try{
        const res = await API.patch('/user/name',{name})
       
    }catch(err){
        throw new Error(err.response?.data?.message || "Something went wrong");
    }
}


