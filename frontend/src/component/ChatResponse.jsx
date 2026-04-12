import { useContext, useEffect, useState } from "react";
import MyContext from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHightlight from "rehype-highlight";
import 'highlight.js/styles/github-dark.css';
import { useNavigate } from "react-router-dom";

const modelOptions = [
  { value: "gemini", label: "Gemini", icon: "✦", color: "#4285f4" },
  { value: "web_search", label: "Web Search", icon: "🌐", color: "#00d4aa" },
  { value: "gpt4", label: "GPT 4o", icon: "⚡", color: "#a855f7" },
];

const ChatResponse = () => {

  const { newchat, prevChat, reply, selectedModel, setSelectedModel, isTyping, setIsTyping } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const currentModel = modelOptions.find(m => m.value === selectedModel) || modelOptions[0];
  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    if (!reply || !reply.reply) {
      setLatestReply(null);
      return;
    }
    if (!prevChat?.length) return;
    const content = String(reply?.reply).split(" ");
    let indx = 0;
    setIsTyping(true);
    let interval = setInterval(() => {
      setLatestReply(content.slice(0, indx + 1).join(" "));
      indx++;
      if (indx >= content.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);

    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };

  }, [prevChat, reply]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.model-dropdown')) setDropdownOpen(false);
      if (!e.target.closest('.profile-dropdown')) setProfileOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <div className="overflow-y-auto w-full [&::-webkit-scrollbar]:hidden  [&::-webkit-scrollbar-thumb]:bg-sky-400 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex justify-between items-center p-5 m-2 font-bold text-xl">
        {/* Model Selector Dropdown */}
        <div className="model-dropdown" style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              cursor: 'pointer',
              color: '#ececec',
              fontSize: '15px',
              fontWeight: '600',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.25s ease',
              boxShadow: dropdownOpen ? `0 0 16px ${currentModel.color}33` : 'none',
              borderColor: dropdownOpen ? currentModel.color : 'rgba(255,255,255,0.12)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = currentModel.color;
              e.currentTarget.style.boxShadow = `0 0 12px ${currentModel.color}22`;
            }}
            onMouseLeave={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <span style={{ fontSize: '18px' }}>{currentModel.icon}</span>
            <span>{currentModel.label}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{
              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.25s ease',
            }}>
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Model Dropdown Menu */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: '0',
              minWidth: '200px',
              background: 'rgba(24, 24, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '6px',
              zIndex: 100,
              boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
              animation: 'dropdownSlideIn 0.2s ease',
            }}>
              {modelOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedModel(option.value);
                    setDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 14px',
                    background: selectedModel === option.value
                      ? `linear-gradient(135deg, ${option.color}18, ${option.color}08)`
                      : 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    color: selectedModel === option.value ? option.color : '#b0b0b0',
                    fontSize: '14px',
                    fontWeight: selectedModel === option.value ? '600' : '400',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedModel !== option.value) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = '#ececec';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedModel !== option.value) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#b0b0b0';
                    }
                  }}
                >
                  <span style={{
                    fontSize: '16px',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    background: selectedModel === option.value
                      ? `${option.color}20`
                      : 'rgba(255,255,255,0.04)',
                  }}>
                    {option.icon}
                  </span>
                  <span>{option.label}</span>
                  {selectedModel === option.value && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 'auto' }}>
                      <path d="M2 7L5.5 10.5L12 3.5" stroke={option.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="profile-dropdown" style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: profileOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: '1px solid transparent',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#ececec',
              fontSize: '14px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={(e) => {
              if (!profileOpen) e.currentTarget.style.background = 'transparent';
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '700',
              color: '#fff',
              flexShrink: 0,
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{
              transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.25s ease',
            }}>
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Profile Menu */}
          {profileOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: '0',
              minWidth: '180px',
              background: 'rgba(24, 24, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '6px',
              zIndex: 100,
              boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
              animation: 'dropdownSlideIn 0.2s ease',
            }}>
              {/* User info */}
              <div style={{
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                marginBottom: '4px',
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>{userName}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Signed in</div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: '#f87171',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(248,113,113,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <i className="fa-solid fa-right-from-bracket" style={{ fontSize: '13px' }}></i>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col  h-full mx-auto max-w-250 overflow-y-auto w-full [&::-webkit-scrollbar]:hidden  [&::-webkit-scrollbar-thumb]:bg-sky-400 [&::-webkit-scrollbar-thumb]:rounded-lg p-2">
        {newchat && (
          <div className="">
            <h2 className="text-3xl font-bold m-25">Welcome to 108Chat!</h2>
          </div>
        )}

        {prevChat.slice(0, -1).map((chat, idx) => (
          <div key={idx} className={`m-2 w-full ${chat.role === "user" ? "flex justify-end text-lg" : "text-left text-lg"}`}>
            {chat.role === "user" ? (
              <p className="bg-[#323232] max-w-250 w-fit  ml-10 p-5 rounded-xl"> {chat.prompt || chat.content}</p>
            ) : (
              <div className="w-fit max-w-250 p-5 rounded-xl">
                <ReactMarkdown rehypePlugins={[rehypeHightlight]}>{chat?.reply?.reply || chat.content || ""}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {prevChat.length > 0 && (
          <div className="m-2 w-full text-left text-lg">
            <div className="w-fit max-w-250 p-5 rounded-xl">
              <ReactMarkdown rehypePlugins={[rehypeHightlight]}>{latestReply == null ? prevChat[prevChat.length - 1]?.reply?.reply || prevChat[prevChat.length - 1]?.content || "" : latestReply}</ReactMarkdown>
            </div>
          </div>
        )}

      </div>

      {/* Dropdown animation keyframes */}
      <style>{`
      @keyframes dropdownSlideIn {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>

    </div>

  )
}

export default ChatResponse