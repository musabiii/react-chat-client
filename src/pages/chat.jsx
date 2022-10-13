import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import io from "socket.io-client";
import copysvg from "../ui/copy.svg"
import exitsvg from "../ui/exit.svg"
import sendmsg from "../ui/sendmsg.svg"

console.log("out of chat page render")

export const Chat = () => {
    const [searchParams] = useSearchParams();
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [socket, setSocket] = useState(io.connect("http://localhost:3000"));
    const navigate = useNavigate()

    const chatName = searchParams.get("chat");
    const usernameClient = searchParams.get("username");


    useEffect(() => {
        if (!usernameClient) {
            navigate(`/auth?chat=${chatName}`)
        }

        socket.emit("join", { username: usernameClient, chatName })
        socket.on("message", (message) => {
            addMessage(message);
        })

        socket.on("updateUsers", (users) => {
            setUsers(users)
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    const addMessage = ({ username, text, timestamp }) => {
        setMessages(prev => ([...prev, { username, text, timestamp }]))
    }

    const sendMessage = (e) => {
        e.preventDefault()
        const value = e.target.usertext.value;
        if (value) {
            socket.emit("chatMessage", { username: usernameClient, text: value })
            e.target.usertext.value = "";
            const messagesWindow = document.querySelector('.messages');
            messagesWindow.scrollTop = messagesWindow.scrollHeight;
        }
    }

    const handleExit = () => {
        navigate("/");
    }

    const copyLink = () => {
        const ind = location.href.indexOf("&username");
        const copyText = location.href.slice(0,ind);
        navigator.clipboard.writeText(copyText);

        const infoMessage = "chat URL is copied!"

        const chatNameElement = document.querySelector('.chatname');
        const chatNameContent = chatNameElement.innerHTML;

        if (chatNameElement.innerText !== infoMessage) {
            chatNameElement.innerHTML = `<h2 class = "copy-info">${infoMessage}</h2>`
            setTimeout(() => {
                chatNameElement.innerHTML = chatNameContent;
            }, 1500);
        }

    }

    return (
        <div className='chat-page'>

            <header>
                <h3 className='title'>Instant chat</h3>
                <div className='chatname' title='copy chat url' onClick={copyLink}>
                    <h2>{chatName}</h2>
                    <div className='copy-chatname'><img src={copysvg} alt="copy" /></div>
                </div>
                <div className="exit"  onClick={handleExit}>
                    <img src={exitsvg} alt="exit" />
                </div>
            </header>
            <main>
                <aside>
                    <div className="users">
                        <h3>Users:</h3>
                        <div className='user-row'>
                            {users.map(user => {
                                if (user === usernameClient) return <p className='user-client'>{user}</p>
                                return <p>{user}</p>
                            })}
                        </div>
                    </div>
                </aside>
                <div className="chat-container">
                    <div className="messages">
                        {messages && messages.map(message => {
                            if (message.username === usernameClient) {
                                return (
                                    <div className="message message-client">
                                        <div className="text-time">
                                            <div className='text'>{message.text}</div>
                                            <div className="timestamp">{message.timestamp}</div>
                                        </div>
                                        <div className='username'>{message.username}</div>
                                    </div>
                                )
                            }
                            if (message.username === "Bot") {
                                return (
                                    <div className="message message-bot">
                                        <span className="timestamp">{message.timestamp}</span>
                                        <div className='text'>{message.text}</div>
                                    </div>
                                )
                            }
                            return (
                                <div className="message">
                                    <div className='username'>{message.username}</div>
                                    <div className="text-time">
                                        <div className='text'>{message.text}</div>
                                        <div className="timestamp">{message.timestamp}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <form className='footer' onSubmit={sendMessage} autoComplete="off">
                        <input id='usertext' type="text" />
                        <button>
                            <img src={sendmsg} alt="" />
                        </button>
                    </form>
                </div>

            </main>

        </div>
    )
}
