import ChatWindow from "./ChatWindow"
import Sidebar from "./Sidebar"

const Chat = () => {
  return (
    <div className="flex h-screen">
        <div className="shrink-0"><Sidebar/></div>
        <div className="flex-1 overflow-hidden"><ChatWindow/></div>      
    </div>
  )
}

export default Chat