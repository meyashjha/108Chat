import { useState, useContext, useEffect } from "react"
import MyContext from "./MyContext"
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
  </svg>
)

const OpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
  </svg>
)


const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const {allThreads, setAllThreads, threadId, setNewchat, setPrompt, setReply, setThreadId, setPrevChat} = useContext(MyContext);
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'User';

const getallThreads = async()=>{
    try{
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/chat/thread`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAllThreads(data);
      console.log("Fetched all threads:", data);
    }catch(err){
      console.error("Error fetching threads:", err);
    }
  };
const createNewChat = async()=>{
  setNewchat(true);
  setPrompt("");
  setReply([]);
  setThreadId(uuidv4());
  setPrevChat([]);
}
const changeThread = (threadId)=>{
  try{
    const res =allThreads.filter(thread => thread.threadId === threadId);
    setThreadId(threadId);
    const data = res[0]?.messages;
    console.log("sgs",data);
    setPrevChat(data);
    setNewchat(false);
    setReply(null);
  }catch(err){
    console.error("Error changing thread:", err);
  }
}

const deleteThread = async(Id)=>{
  try{
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/chat/thread/${Id}`,{
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` }
    });
    getallThreads();
    if(Id === threadId){
      createNewChat();
    }
  }catch(err){
    console.error("Error deleting thread:", err);
  }
}

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  navigate('/');
}

  useEffect(()=>{getallThreads()},[threadId])
  return (
    <div className={`flex flex-col border-r border-sky-900 h-full transition-all duration-500 ${showSidebar ? "w-64" : "w-21"}`} style={{backgroundColor: "#171717"}}>
      
      <div className={`flex items-center justify-between p-2 `}>
        <img className={`rounded-full h-10 w-10 `} src="/logo.png"></img>
        <button onClick={() => setShowSidebar(!showSidebar)} className="cursor-pointer p-2 hover:scale-110 transition">
          {showSidebar ? <CloseIcon/> : <OpenIcon/>}
        </button>
      </div>

      <div onClick={createNewChat} className={`flex items-center hover:bg-gray-700/50 hover:rounded-2xl cursor-pointer gap-2 p-2 ${showSidebar ? "block" : "hidden"}`} >
        <i className="fa-regular fa-pen-to-square"></i>
        <h1>New Chat</h1>
      </div>

      <div className={`flex-1 p-2 overflow-y-auto [&::-webkit-scrollbar]:hidden ${showSidebar ? "block" : "hidden"} border-b border-gray-700 `}>
        {allThreads?.map((thread) => (
          <div onClick={() => changeThread(thread.threadId)} key={thread.threadId} className={`history flex items-center justify-between p-2 hover:bg-gray-700/50 hover:rounded-2xl cursor-pointer gap-2 ${threadId === thread.threadId ? "bg-gray-700/50 rounded-2xl" : ""}`}>
            <h1>{thread.title.substring(0, thread.title.length > 20 ? 20 : thread.title.length) || "Unnamed Thread"} ...</h1>
            <i className="fa-solid fa-trash opacity-0" style={{color: "#ffffff"}} onClick={(e) => {e.stopPropagation(); deleteThread(thread.threadId)}}></i>
            
          </div>
        ))}

      </div>

      <div className={`flex items-center justify-between p-2 ${showSidebar ? "block" : "hidden"}`}>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-sky-700 flex items-center justify-center text-white font-bold text-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-sm font-medium truncate max-w-28">{userName}</h2>
        </div>
        <button
          onClick={handleLogout}
          className="cursor-pointer p-2 hover:bg-red-500/20 rounded-lg transition"
          title="Logout"
        >
          <i className="fa-solid fa-right-from-bracket text-gray-400 hover:text-red-400"></i>
        </button>
      </div>
    </div>
    
  )
}

export default Sidebar
