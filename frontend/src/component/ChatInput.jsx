import { useContext, useEffect, useState } from "react"
import MyContext from "./MyContext"
import { RingLoader } from "react-spinners"


const ChatInput = () => {
  const { prompt, setPrompt, reply, setReply, threadId, setThreadId, setNewchat, setPrevChat, selectedModel, isTyping } = useContext(MyContext);
  const [loading, setloading] = useState(false);

  const isBusy = loading || isTyping;

  const getResponse = async () => {
    if (isBusy || !prompt.trim()) return;
    setloading(true);
    setNewchat(false);
    const token = localStorage.getItem('token');
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ prompt, threadId, model: selectedModel }),
    }

    console.log("Fetching response for prompt:", prompt, "in thread:", threadId);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/chat/talk`, options);
      const data = await response.json();
      setReply(data);
      setloading(false);
      console.log("Received response data:", data);
    } catch (error) {
      console.error("Error fetching response:", error);
      setloading(false);
    }
  }

  useEffect(() => {
    if (prompt && reply) {
      setPrevChat((prev) => [...prev, {
        role: "user",
        prompt: prompt
      },
      {
        role: "assistant",
        reply: reply
      }]);
    }
    setPrompt("");
  }
    , [reply]);

  return (
    <div className="p-2 w-full">

      <form onSubmit={(e) => { e.preventDefault(); getResponse(); }} className="flex mr-2 p-2 bg-none items-center rounded-xl w-full shadow-sm shadow-sky-950" >
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isBusy} className={`p-4 my-2 w-full bg-gray-900/50 rounded-xl focus:outline-0 ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}`} type="text" placeholder={isBusy ? "Waiting for response..." : "Ask Me Anything....I Mean Anything iykyk"} />

        <div className=" p-4 -ml-2 my-2 w-20 bg-gray-900/50 rounded-r-xl ">
          {isBusy ? <RingLoader className="" size={25} color="#ecfeff" loading={true} /> : <button onClick={getResponse} className="cursor-pointer">
            <i className="fa-regular fa-paper-plane hover:scale-110"></i>
          </button>
          }
        </div>
      </form>
      <div className="mt-2">
        <p>108Chat can make mistakes, just not as many as you 😎</p>
      </div>


    </div>
  )
}

export default ChatInput