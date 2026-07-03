
import API from '@/service/API.sevice'

export const registerUser = async (data) => {
    try {
        const response = await API.post('/user/register', data)
        
        return response.data.success
    } catch (err) {
       
        throw new Error(err.response?.data?.message || "Something went wrong");
    }
}

export const verifyotp = async (email, OTP) => {
    try {
        
        const response = await API.post('/user/otp', { email, OTP })
        if (response.status === 200) {
            return true;
        }
        return false;
    } catch (err) {
        
        throw new Error(err.response?.data?.message || "Something went wrong");
    }
}

export const loginUser = async(info,setuser)=>{
    try{
       
        const {data} = await  API.post('/user/login',info)
        if(data.statsCode==200 || data.data.statsCode==200 || data.success){
            const {data} =   await API.get('/user/me')
            setuser(data.data)

        }
    
    }catch(err){
        throw new Error(err.response?.data?.message || "Something went wrong");
    }
    


}
