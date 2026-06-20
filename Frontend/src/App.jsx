import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUp from './UI/Sigin/signUp'
import { Another } from './UI/Main/Another'
import SignIn from './UI/Sigin/SignIn'
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Another />} />
                <Route path='/signIn' element={<SignIn />} />
                <Route path='/signUp' element={<SignUp />} />
                <Route path='/*' element={<div className='bg-black font-extrabold w-screen h-screen flex justify-center items-center text-5xl text-white '>
                    404 NOT found
                </div>}  ></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App