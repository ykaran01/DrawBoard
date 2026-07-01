import API from "@/service/API.sevice"

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


let saveTimer = null;
export const saveBoard = (canvas, id) => {
    const objects = canvas.getObjects().map(obj =>
        obj.toObject(["id"])
    );
   
    if (!id) return
    clearInterval(saveTimer)
    saveTimer = setTimeout(async () => {
        try {

            await API.put(`/board/add/${id}`,
                { objects },
            );

            console.log("Board Saved");
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