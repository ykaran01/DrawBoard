import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './Home'
import { Another } from './UI/Another'
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/another" element={<Another/>} />
                
            </Routes>
        </BrowserRouter>
    )
}

export default App