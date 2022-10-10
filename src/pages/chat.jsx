import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");

export const Chat = () => {
    const [searchParams] = useSearchParams();
    const [messages, setMessages] = useState([{ username: "Mike", text: "Hello" }])
    const chatName = searchParams.get("chat");
    const username = searchParams.get("username");

    const addMessage = (text) => {
        setMessages(prev => ([ ...prev, {username, text} ]))

    }

    const sendMessage = (e) => {
        e.preventDefault()
        addMessage(e.target.usertext.value);
        e.target.usertext.value = "";
    }
    return (
        <div className='chat-page'>

            <header>
                <h2>{chatName}</h2>
            </header>
            <main>
                <aside>
                    aside
                </aside>
                <div className="chat-container">
                    <div className="messages">
                        {messages && messages.map(message => {
                            return (
                                <div className="message">
                                    <span>{message.username}:</span> {message.text}
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
