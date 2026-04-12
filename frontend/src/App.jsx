import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Chat from './component/Chat'
import Errorpage from './component/Errorpage'
import Landing from './component/Landing'
import MyContext from './component/MyContext'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Navigate, useLocation } from 'react-router-dom';


function App() {

const [prompt , setPrompt] = useState("");
const [reply , setReply] = useState([]);
const [threadId , setThreadId] = useState(uuidv4());
const [newchat , setNewchat] = useState(true);
const [prevChat, setPrevChat] = useState([]);  // stores all chats of curr thread
const [allThreads, setAllThreads] = useState([]); // stores all threads of the user
const [selectedModel, setSelectedModel] = useState("gemini");
const [isTyping, setIsTyping] = useState(false);

 const providerValue = {
    prompt, setPrompt,
    reply, setReply,
    threadId, setThreadId,
    newchat, setNewchat,
    prevChat, setPrevChat,
    allThreads, setAllThreads,
    selectedModel, setSelectedModel,
    isTyping, setIsTyping
 };

  return (
    <div className='app'>
      <MyContext.Provider value={providerValue}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/chat' element={<RequireAuth><Chat /></RequireAuth>} />
            <Route path='/*' element={<Errorpage />} />
          </Routes>
        </BrowserRouter>
      </MyContext.Provider>
    </div>
  );
}

// Route protection component (must be outside App)
function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) {
    return <Navigate to='/' state={{ from: location }} replace />;
  }
  return children;
}
export default App
