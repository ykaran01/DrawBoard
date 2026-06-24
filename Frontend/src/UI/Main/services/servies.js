import API from "@/service/API.sevice"

export const getBoard = async (id) => {
    try {
        const { data } = await API.get(`/board/get/${id}`)
        return data.data.elements
    } catch (err) {
        console.log(err.message)
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
            console.error(err);
        }
    }, 2000);
}