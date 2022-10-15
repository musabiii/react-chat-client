import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import io from "socket.io-client";
import copysvg from "../ui/copy.svg"
import exitsvg from "../ui/exit.svg"
import sendmsgsvg from "../ui/sendmsg.svg"
import githubsvg from "../ui/github.svg"
import clientsvg from "../ui/client.svg"
import serversvg from "../ui/server.svg"
import sunsvg from "../ui/sun.svg"
import moonsvg from "../ui/moon.svg"

console.log("out of chat page render")

export const Chat = () => {
    const [searchParams] = useSearchParams();
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [socket, setSocket] = useState(io.connect("http://localhost:3001"));
    const [darkmode, setDarkmode] = useState(false)
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
            const messagesWindow = document.querySelector('.messages');
            messagesWindow.scrollTop = messagesWindow.scrollHeight;
        })

        socket.on("updateUsers", (users) => {
            setUsers(users)
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    useEffect(() => {
        const sunimg = document.querySelector('.dark-mode-sun');
        const moonimg = document.querySelector('.dark-mode-moon');

        if (darkmode) {
            document.body.classList.add('dark-mode')
            // sunimg.style.display = "block"
            // moonimg.style.display = "none"
            sunimg.style.opacity = 0
            moonimg.style.opacity = 1
            // darkmodeimg.src = moonsvg
        } else {
            document.body.classList.remove('dark-mode')
            // moonimg.style.display = "block"
            // sunimg.style.display = "none"
            sunimg.style.opacity = 1
            moonimg.style.opacity = 0
            // darkmodeimg.src = sunsvg
        }
    }, [darkmode])


    const addMessage = ({ username, text, timestamp }) => {
        setMessages(prev => ([...prev, { username, text, timestamp }]))
    }

    const sendMessage = (e) => {
        e.preventDefault()
        const value = e.target.usertext.value;
        if (value) {
            socket.emit("chatMessage", { username: usernameClient, text: value })
            e.target.usertext.value = "";

        }
    }

    const handleExit = () => {
        document.body.classList.remove('dark-mode')
        navigate("/");
    }

    const copyLink = () => {
        const ind = location.href.indexOf("&username");
        const copyText = location.href.slice(0, ind);
        navigator.clipboard.writeText(copyText);

        const infoMessage = "invite URL is copied!"

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
                <div className="right-block">
                    <div className="dark-mode-box">
                        <div className="dark-mode-wrapper" onClick={() => setDarkmode(!darkmode)}>
                            <img className='dark-mode-moon' src={moonsvg} alt="moon" />
                            <div className="dark-mode-ball"></div>
                            <img className='dark-mode-sun' src={sunsvg} alt="sun" />
                        </div>
                    </div>
                    <div className="exit" onClick={handleExit}>
                        <img src={exitsvg} alt="exit" />
                    </div>
                </div>

            </header>
            <main>
                <aside>
                    <div className="users">
                        <h3 className='users-title'>Users:</h3>
                        <div className='user-row'>
                            {users.map(user => {
                                if (user === usernameClient) return <p key={user} className='user-client'>{user}</p>
                                return <p key={user}>{user}</p>
                            })}
                        </div>
                    </div>
                    <div className="invite">
                        <button className='invite-btn' onClick={copyLink}>
                            invite +
                        </button>
                    </div>
                    <div className="aside-footer">

                        <div className="about">
                            <a className="about-row" target="_blank" href='https://github.com/musabiii'>
                                <img src={githubsvg} alt="" />
                                <div>musabiii</div>
                            </a>
                            <a className="about-row" target="_blank" href='https://github.com/musabiii/react-chat-client'>
                                <img src={clientsvg} alt="" />
                                <div>client</div>
                            </a>
                            <a className="about-row" target="_blank" href='https://github.com/musabiii/react-chat-server'>
                                <img src={serversvg} alt="" />
                                <div>server</div>
                            </a>
                        </div>

                    </div>
                </aside>
                <div className="chat-container">
                    <div className="messages">
                        {messages && messages.map(message => {
                            if (message.username === usernameClient) {
                                return (
                                    <div key={message.timestamp} className="message message-client">
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
                    <form className='form' onSubmit={sendMessage} autoComplete="off">
                        <input id='usertext' type="text" autoFocus placeholder='type message...' />
                        <button>
                            <img src={sendmsgsvg} alt="" />
                        </button>
                    </form>
                </div>

            </main>




        </div>
    )
}
