import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './component/Login'
import Chat from './component/Chat'
import Errorpage from './component/Errorpage'
import Landing from './component/Landing'

function App() {


  return (
    <>
      <BrowserRouter>
      <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path="/login" element={<Login/>} />
      <Route path='/chat' element={<Chat/>} />
      <Route path='/*' element={<Errorpage/>}/>
      </Routes>
      </BrowserRouter>
        
    </>
  )
}

export default App
