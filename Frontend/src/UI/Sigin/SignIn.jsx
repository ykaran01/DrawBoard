import React, { useState, useEffect, useContext } from 'react'
import { loginUser } from './service'
import { useNavigate, Link } from 'react-router-dom'
import { UserContext } from '@/Userprovider'

import { Mail, Lock, LogIn, Loader2 } from 'lucide-react'

const SignIn = () => {
    const navigate = useNavigate()
    const { user ,setUserData} = useContext(UserContext)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [info, setinfo] = useState({
        email: "",
        password: ""
    })

 
    useEffect(() => {
        if (user) {
            navigate('/dash')
        }
    }, [user, navigate])

    const handleChange = (e) => {
        setinfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true)
        try {
            const data = await loginUser(info,setUserData)
            if (data) {
                navigate('/dash')
            }
        } catch (err) {
            alert(err.message)
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <div className='w-full min-h-screen bg-zinc-50 flex flex-col md:flex-row overflow-x-hidden'>

            
            <section className='left w-full md:w-4/7 min-h-[40vh] md:min-h-screen bg-gradient-to-r from-indigo-500 to-purple-900 p-6 md:p-8 flex flex-col justify-between md:justify-start gap-12 md:gap-0'>
                <div className='text-3xl md:text-5xl font-extrabold font-sans text-white tracking-wide z-10'>
                    𝔇<span className='text-xl md:text-2xl'>raw</span>𝔅<span className='text-xl md:text-2xl'>oard</span>
                </div>

                <div className='w-full md:h-full flex flex-col justify-center items-center pb-8 md:pb-0'>
                    <h1 className='text-5xl sm:text-6xl md:text-7xl text-white font-extrabold text-center tracking-tight'>
                        Welcome Back
                    </h1>
                    <div className='w-full sm:w-3/4 md:w-1/2 mt-4 md:mt-8 px-4'>
                        <p className='text-purple-100 text-base sm:text-lg md:text-[20px] font-medium leading-relaxed opacity-90 text-center'>
                            Discover a seamless canvas to sketch your ideas. <br className='hidden sm:inline' />
                            Sign in to seamlessly pick up right where you left off.
                        </p>
                    </div>
                </div>
            </section>

           
            <section className='right w-full md:w-3/7 min-h-[60vh] md:min-h-screen p-6 md:p-8 flex items-center justify-center bg-transparent'>
                <div className='w-full max-w-md py-8 md:py-0 flex flex-col justify-center items-center'>

                    <form onSubmit={handleSubmit} className='w-full justify-center gap-5 md:gap-6 flex flex-col items-center'>
                        <h1 className='text-3xl md:text-4xl font-extrabold text-zinc-800'>Sign In</h1>

                       
                        <div className='flex flex-col w-full max-w-sm gap-1.5'>
                            <label className='text-sm font-semibold text-zinc-600 px-1 flex items-center gap-1.5'>
                                <Mail size={16} className="text-purple-500" /> Email
                            </label>
                            <input
                                name="email"
                                className='py-2.5 px-4 border border-purple-500 rounded-xl w-full text-zinc-700 outline-none focus:ring-2 focus:ring-purple-400'
                                type="email"
                                placeholder="you@example.com"
                                value={info.email}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className='flex flex-col w-full max-w-sm gap-1.5'>
                            <label className='text-sm font-semibold text-zinc-600 px-1 flex items-center gap-1.5'>
                                <Lock size={16} className="text-purple-500" /> Password
                            </label>
                            <input
                                name='password'
                                className='py-2.5 px-4 bg-white rounded-xl w-full border border-purple-500 text-zinc-700 outline-none focus:ring-2 focus:ring-purple-400'
                                type="password"
                                placeholder="••••••••"
                                value={info.password}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                      
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full max-w-sm py-3 rounded-xl mt-4 font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer
                                ${isSubmitting 
                                    ? 'bg-purple-400 shadow-transparent cursor-not-allowed opacity-80' 
                                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/10'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    <span>Submit</span>
                                </>
                            )}
                        </button>

                        <div className='mt-2 text-center'>
                            <p className='text-sm text-zinc-600'>
                                New to the website?{' '}
                                <Link className='text-purple-700 font-bold hover:underline' to="/signup">signUp</Link>
                            </p>
                        </div>
                    </form>

                </div>
            </section>
        </div>
    )
}

export default SignIn