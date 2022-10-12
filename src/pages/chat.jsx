import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import io from "socket.io-client";
import copysvg from "../ui/copy.svg"
import exitsvg from "../ui/exit.svg"

console.log("out of chat page render")

export const Chat = () => {
    const [searchParams] = useSearchParams();
    const [messages, setMessages] = useState([{ username: "Mike", text: "Hello" }])
    const [users, setUsers] = useState([])
    const [socket, setSocket] = useState(io.connect("http://localhost:3000"));
    const navigate = useNavigate()

    const chatName = searchParams.get("chat");
    const usernameClient = searchParams.get("username");


    useEffect(() => {
        // const socket = io.connect("http://localhost:3000");
        console.log("use effect")
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




    const addMessage = ({ username, text }) => {
        setMessages(prev => ([...prev, { username, text }]))
    }

    const sendMessage = (e) => {
        e.preventDefault()
        // addMessage(e.target.usertext.value);
        const value = e.target.usertext.value;
        if (value) {
            socket.emit("chatMessage", { username: usernameClient, text: value })
            e.target.usertext.value = "";
            const messagesWindow = document.querySelector('.messages');
            messagesWindow.scrollTop = messagesWindow.scrollHeight + 200;
        }
        // messagesWindow.scrollTo(0, messagesWindow.scrollHeight+200);
    }

    const handleExit = () => {
        navigate("/");
    }

    return (
        <div className='chat-page'>

            <header>
                <h3 className='title'>Instant chat</h3>
                <div className='chatname'>
                    <h2>{chatName}</h2>
                    <div className='copy-chatname'><img src={copysvg} alt="copy" /></div>
                </div>
                <div className="exit">
                    <img src={exitsvg} alt="exit" />
                    <h3 className='exit-title' onClick={handleExit}>exit</h3>
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
                                        <div className='text'>{message.text}</div>
                                        <div className='username'>{message.username}</div>
                                    </div>
                                )
                            }

                            return (
                                <div className="message">
                                    <div className='username'>{message.username}</div>
                                    <div className='text'>{message.text}</div>
                                </div>
                            )
                        })}
                    </div>
                    <form className='footer' onSubmit={sendMessage}>
                        <input id='usertext' type="text" />
                        <button>send</button>
                    </form>
                </div>

            </main>

        </div>
    )
}
