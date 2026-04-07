import {useState} from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import Info from './pages/Info'
import Privacy from './pages/Privacy'
import Support from './pages/Support'
import Terms from './pages/Terms'
import Authenticate from './pages/Authenticate'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Reset from './pages/Reset'
const App = () => {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage/>} />
                <Route path='/Login' element={<Login/>}/>
                <Route path='/Register' element={<Register/>}/>
                <Route path='/Info' element={<Info/>}/>
                <Route path='/Privacy' element={<Privacy/>}/>
                <Route path='/Terms' element={<Terms/>}/>
                <Route path='/Support' element={<Support/>}/>
                <Route path='/Authenticate' element={<Authenticate/>}/>
                <Route path='/Home' element={<Home/>}/>
                <Route path='/Chat' element={<Chat/>}/>
                <Route path='/Reset' element={<Reset/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App