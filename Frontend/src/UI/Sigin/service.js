
import API from '@/service/API.sevice'

export const registerUser = async (data) => {
    try {
        const response = await API.post('/user/register', data)
        console.log(response.data)
        return response.data.success
    } catch (err) {
        const errorMessage = err.message || "Something went wrong";
        throw new Error(errorMessage)
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
        const errorMessage = err.response?.data?.message || "Invalid or expired verification code.";
        console.error("OTP Verification Error:", errorMessage);
        throw new Error(errorMessage);
    }
}

export const loginUser = async(info)=>{
    try{
        const {data} = await  API.post('/user/login',info)
        const {accessToken ,refreshToken} = data
        cook
    }catch(err){
        console.log(err.message)
    }
    


}