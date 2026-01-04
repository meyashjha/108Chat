import Chatwindow from "./Chatwindow"
import Sidebar from "./Sidebar"

const Chat = () => {
  return (
    <div className="grid grid-cols-12 h-screen">
        <div className="col-span-2"><Sidebar/></div>
        <div className="col-span-10"><Chatwindow/></div>      
    </div>
  )
}

export default Chat