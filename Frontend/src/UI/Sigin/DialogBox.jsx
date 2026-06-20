import React, { useState } from 'react'
import { verifyotp } from './service'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useNavigate } from 'react-router-dom'
export const DialogBox = ({ isOpen, setIsOpen ,email}) => {
    const navigate = useNavigate()
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (otp.length < 6) return 

        try{
            setIsLoading(true)
            console.log(email)
            const data = await verifyotp(email,otp)
            if(data){
                navigate('/signin')
            }
        }catch(err){
            alert(err.message)
        }finally{
            setIsLoading(false)
            setOtp("")
        }
        
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl animate-in fade-in-50 zoom-in-95">
                
                <DialogHeader className="flex flex-col items-center text-center space-y-2">
                    
                  

                    <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-900">
                        Verification Code
                    </DialogTitle>
                    
                    <DialogDescription className="text-sm text-zinc-500 max-w-xs ">
                        Please enter the 6-digit verification code sent to your email address.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center gap-5 w-full">
                    
                    
                    <div className="w-full max-w-xs relative">
                        <input 
                            type="number" 
                            maxLength={6} 
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)} 
                            className="w-full text-center tracking-[1em] text-2xl font-extrabold py-3 px-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-zinc-800 placeholder:text-zinc-300 placeholder:tracking-normal transition-all"
                            required
                           
                        />
                    </div>

               
                    <button 
                        type="submit" 
                        disabled={otp.length < 6 || isLoading}
                        className="w-full max-w-xs py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            "Verify Code"
                        )}
                    </button>
                    
                </form>
            </DialogContent>
        </Dialog>
    )
}

