import React from 'react'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import SignUp from './UI/Sigin/signUp'
import { Another } from './UI/Main/Another'
import SignIn from './UI/Sigin/SignIn'
import { UserProvider } from './Userprovider'

import Home from './UI/Home/Home'
const App = () => {


    const ProtectedLayout = () => {
        return (
            <UserProvider>
                <Outlet />
            </UserProvider>
        )
    }
    return (
        <BrowserRouter>
            <Routes>

                <Route path='/signUp' element={<SignUp />} />
                <Route element={<ProtectedLayout />} >
                    <Route path='/signIn' element={<SignIn />} />
                    <Route path="/room/:roomid" element={<Another />} />
                    <Route path="/dash" element={<Home />} />

                </Route>
                <Route path='/*' element={<div className='bg-black font-extrabold w-screen h-screen flex justify-center items-center text-5xl text-white '>
                    404 NOT found
                </div>}  ></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App