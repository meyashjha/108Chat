import ChatResponse from "./ChatResponse"
import ChatInput from "./ChatInput"

const ChatWindow = () => {
  return (
    <div className="h-screen flex flex-col justify-between items-center text-center" style={{backgroundColor: "#121212"}}>
      <ChatResponse/>
      <ChatInput/>
    </div>
  )
}

export default ChatWindow