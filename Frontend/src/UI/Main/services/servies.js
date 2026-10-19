import API from "@/service/API.sevice"
let saveTimer = null;

export const getBoard = async (id) => {
    try {
        const { data } = await API.get(`/board/get/${id}`)
        if(data.success){
            return {elements:data.data.elements,name:data.data.title}
        }
           return  {elements:null,name:null}
        
        
    } catch (err) {
        throw new Error(err.response?.data?.message || "Something went wrong");
    }
}

export const saveBoard = (canvas, id) => {
    const objects = canvas.getObjects().map(obj =>
        obj.toObject(["id"])
    );
   
    if (!id) return;
    clearTimeout(saveTimer)
    saveTimer = setTimeout(async () => {
        try {

            await API.put(`/board/add/${id}`,
                { objects },
            );

            
        } catch (err) {
            throw new Error(err.response?.data?.message || "Something went wrong");
        }
    }, 1500);
}

export const getMessages = async(roomId)=>{
    try{
        const {data} = await API.get(`/message/${roomId}`)
        return data.data
        
    }catch(err){
      throw new Error(err.response?.data?.message || "Something went wrong");
    }
}

export const authoriseUser = async(roomId)=>{
    try{
        const {data} = await API.post(`/board/authorise/${roomId}`)
        return data.data
        
    }catch(err){
      throw new Error(err.response?.data?.message || "Something went wrong");
    }
}

export const  getUserAllVersion = async(roomId)=>{

    try{
        console.log(roomId)
        const {data} = await API.get(`/version/${roomId}/all`)
        console.log(data)
        return data.data
    }catch(err){
        throw new Error(err.response?.data?.message || "Something went wrong");
    }
}

export const saveboard =  async(roomId, canvas,message)=>{
    const objects = canvas.getObjects().map(obj =>
        obj.toObject(["id"])
    );
    try{
         const {data} =  await API.post(`/version/${roomId}`, { objects ,message});
         console.log(data)
         return data.success;
    }catch(err){
        throw new Error(err.response?.data?.message || "Something went wrong");
    }
   
}

export const getVersion = async(versionId)=>{
    try{
        const {data} = await API.get(`/version/${versionId}`)
    
        return {success:data.success,elements:data.data.elements}
    }catch(err){
        throw new Error(err.response?.data?.message || "Something went wrong");
    }
}

export const deleteVersion = async(versionId)=>{
    try{  
        const {data} = await API.delete(`/version/${versionId}`)
        return data.success
    }
    catch(err){
        throw new Error(err.response?.data?.message || "Something went wrong");
    }
}