import React, { useState } from 'react'
import { DialogBox } from './DialogBox'
import { registerUser } from './service'
import { Link } from 'react-router-dom'
// Importing Lucide Icons
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react'

const SignUp = () => {
    const [open, setopen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false) 
    const [info, setinfo] = useState({
        name: "",
        password: "",
        email: "",
        username: ""
    })
    const [registrationSuccess, setRegistrationSuccess] = useState(false) 

    const onchange = (e) => {
        setinfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async () => {
        if (!info.email || !info.name || !info.password || !info.username) {
            return
        }
        
        setIsSubmitting(true) 

        try {
            const datas = await registerUser(info)
            if (datas) {
                setRegistrationSuccess(true)
                setopen(true)
            }
        } catch (err) {
            alert(err.message)
        } finally {
            setIsSubmitting(false) 
        }
    }

    return (
        <div className='w-[100vw] h-[100vh] bg-zinc-100 flex flex-col md:flex-row  '>
         
            <DialogBox isOpen={open} setIsOpen={setopen} email={info.email} />

            <section className='left md:w-4/7   h-full bg-gradient-to-r from-indigo-500 to-purple-900 p-2 flex flex-col'>
                <div className='md:text-5xl text-xl font-extrabold font-sans text-white p-2 tracking-wide z-10' >𝔇<span className='text-2xl'>raw</span>𝔅<span className='text-2xl'>oard</span></div>
                <div className='w-full h-full flex flex-col justify-center items-center'>
                    <h1 className='md:text-8xl text-4xl text-white font-extrabold' >Join Us !</h1>
                    <div className='w-1/2 mt-8'>
                        <p className='text-purple-100  text-sm md::ext-[20px] font-medium leading-relaxed opacity-90 text-center'>
                            Create an account to start sketching your masterpieces. <br />
                            Save, share, and collaborate seamlessly on your live canvas.
                        </p>
                    </div>
                </div>
            </section>

            <section className='right p-2 md:w-3/7  w-full   h-full'>
                <div className='w-full gap-20 h-full flex flex-col justify-center items-center'>

                    <form className='w-full h-full justify-center gap-8 flex flex-col items-center'>
                        <h1 className='text-4xl font-extrabold' >Sign Up</h1>

                        
                        <div className='flex flex-col gap-1'>
                            <label className='flex items-center gap-1.5 text-sm font-medium text-zinc-700'>
                                <User size={16} className="text-purple-500" /> Username
                            </label>
                            <input value={info.username} onChange={onchange} name='username' className='py-2 px-2 bg-white border border-purple-500 rounded-xl w-90 outline-none focus:ring-2 focus:ring-purple-400' type="text" disabled={isSubmitting} />
                        </div>

                        {/* Full Name Input */}
                        <div className='flex flex-col gap-1'>
                            <label className='flex items-center gap-1.5 text-sm font-medium text-zinc-700'>
                                <User size={16} className="text-purple-500" /> Full Name
                            </label>
                            <input value={info.name} onChange={onchange} name='name' className='py-2 px-2 bg-white border border-purple-500 rounded-xl w-90 outline-none focus:ring-2 focus:ring-purple-400' type="text" disabled={isSubmitting} />
                        </div>

                        
                        <div className='flex flex-col gap-1'>
                            <label className='flex items-center gap-1.5 text-sm font-medium text-zinc-700'>
                                <Mail size={16} className="text-purple-500" /> Email
                            </label>
                            <input value={info.email} onChange={onchange} name='email' className='py-2 px-2 bg-white border border-purple-500 rounded-xl w-90 outline-none focus:ring-2 focus:ring-purple-400' type="email" disabled={isSubmitting} />
                        </div>

                        
                        <div className='flex flex-col gap-1'>
                            <label className='flex items-center gap-1.5 text-sm font-medium text-zinc-700'>
                                <Lock size={16} className="text-purple-500" /> Password
                            </label>
                            <input value={info.password} onChange={onchange} name='password' className='py-2 px-2 bg-white border border-purple-500 rounded-xl w-90 outline-none focus:ring-2 focus:ring-purple-400' type="password" disabled={isSubmitting} />
                        </div>

                       
                        <button 
                            disabled={isSubmitting}
                            onClick={(e) => {
                                e.preventDefault()
                                handleSubmit()
                            }} 
                            className={`font-bold border text-white w-60 py-2 rounded-2xl mt-2 flex items-center justify-center gap-2 transition-all cursor-pointer
                                ${isSubmitting 
                                    ? 'bg-purple-400 border-purple-400 cursor-not-allowed opacity-80' 
                                    : 'bg-purple-600 border-purple-500 hover:bg-purple-700'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    <span>Submit</span>
                                </>
                            )}
                        </button>

                        <div>
                            <h1>Already have an account? <Link className='text-purple-700 underline ' to="/login">signIn</Link></h1>
                        </div>
                    </form>
                    {registrationSuccess && (
                        <button onClick={() => setopen(true)} className='text-sm py-1 px-2 bg-purple-600 rounded-xl text-white cursor-pointer'>
                            Open Verification Dialog Box
                        </button>
                    )}
                </div>
            </section>
        </div>
    )
}

export default SignUp