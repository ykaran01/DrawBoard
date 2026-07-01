import React, { useState } from 'react'
import { loginUser } from './service'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '@/Userprovider'
import { useContext } from 'react'
const SignIn = () => {
    const naviagte = useNavigate()
    const { user } = useContext(UserContext)
    console.log
    if (user) {
        naviagte('/dash')
    }
    const [info, setinfo] = useState({
        email: "",
        password: ""
    })
    const handleChange = (e) => {
        setinfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(info)
            if(data)
                naviagte('/dash')

        } catch (err) {
            alert(err.message)
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


            <section className='right w-full md:w-3/7 min-h-[60vh] md:min-h-screen p-6 md:p-8 flex items-center justify-center bg- md:bg-transparent'>
                <div className='w-full max-w-md py-8 md:py-0 flex flex-col justify-center items-center'>


                    <form onSubmit={handleSubmit} className='w-full justify-center gap-5 md:gap-6 flex flex-col items-center'>
                        <h1 className='text-3xl md:text-4xl font-extrabold text-zinc-800'>Sign In</h1>

                        <div className='flex flex-col w-full max-w-sm gap-1'>
                            <label className='text-sm font-semibold text-zinc-600 px-1'>Email</label>
                            <input
                                name="email"
                                className='py-2.5 px-4 border border-purple-500 rounded-xl w-full  text-zinc-700'
                                type="email"
                                placeholder="you@example.com"
                                value={info.email}
                                onChange={(e) => handleChange(e)}
                                required
                            />
                        </div>

                        <div className='flex flex-col w-full max-w-sm gap-1'>
                            <label className='text-sm font-semibold text-zinc-600 px-1'>Password</label>
                            <input
                                name='password'
                                className='py-2.5 px-4 bg-white  rounded-xl w-full border border-purple-500 text-zinc-700'
                                type="password"
                                placeholder="••••••••"
                                value={info.password}
                                onChange={(e) => handleChange(e)}
                                required
                            />
                        </div>


                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className='bg-purple-600 hover:bg-purple-700 transition-colors font-bold text-white w-full max-w-sm py-3 rounded-xl mt-4 shadow-lg shadow-purple-600/10 cursor-pointer'
                        >

                            Submit
                        </button>

                        <div className='mt-2 text-center'>
                            <p className='text-sm text-zinc-600'>
                                New to the website?{' '}
                                <a className='text-purple-700 font-bold hover:underline' href="/signup">signUp</a>
                            </p>
                        </div>
                    </form>

                </div>
            </section>
        </div>
    )
}

export default SignIn