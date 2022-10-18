import React, { useEffect, useRef, useState } from 'react'
import { createSearchParams, Link, useNavigate, useSearchParams } from 'react-router-dom'


export const Auth = () => {
    const [username, setUsername] = useState('')
    const [searchParams] = useSearchParams()
    const existChat = searchParams.get('chat');
    const [chatId, setChatId] = useState(existChat || "")
    const [activeTab, setActiveTab] = useState('create')

    const navigate = useNavigate()


    useEffect(() => {
        if (existChat) {
            setActiveTab('enter')
        }
    }, [])


    const createChat = (e) => {
        e.preventDefault();
        if (username) {
            const chatName = Math.random().toString(36).slice(-8);
            const path = `#/chat?${createSearchParams({ chat: chatName, username }).toString()}`;
            // navigate(path)
            location.href = path;
            location.reload();
        } else {
            showError('username')
        }
    }

    const enterChat = (e) => {
        e.preventDefault();
        if (username && chatId) {
            const path = `#/chat?${createSearchParams({ chat: chatId, username }).toString()}`;
            // navigate(path)
            location.href = path;
            location.reload();
        } else {
            if (!username) {
            showError('username')
            }
            if (!chatId) {
            showError('chatid')
            }
        }
    }

    function showError(idname) {
        const usernameInput = document.getElementById(idname);
        usernameInput.classList.add('input-error')
        const interval = setInterval(() => {
            usernameInput.classList.toggle('input-error')
        }, 200);
        setTimeout(() => {
            clearInterval(interval)
            usernameInput.classList.remove('input-error')
        }, 600);
    }

    return (
        <div className='auth-page'>
            <h1>Welcome to instant chat!</h1>
            <div className="tabs">
                <div className={`tab ${activeTab === "create" ? "active" : ""}`} onClick={() => setActiveTab("create")}>create chat</div>
                <div className={`tab ${activeTab === "enter" ? "active" : ""}`} onClick={() => setActiveTab("enter")}>enter to chat</div>
            </div>
            <div className="forms">
                {activeTab === "create" && <form>
                    <div className='form-row'>
                        <label htmlFor="username">username:</label><input value={username} autoFocus onChange={(e) => setUsername(e.target.value)} id='username' type="text" />
                    </div>
                    <button onClick={createChat}>Create</button>
                    {/* <p>or</p> */}
                </form>}
                {activeTab === "enter" && <form>
                    <div className='form-row'><label htmlFor="username">username:</label><input value={username} autoFocus onChange={(e) => setUsername(e.target.value)} id='username' type="text" /></div>
                    <div className='form-row'><label htmlFor="chatid">chat name:</label><input value={chatId} onChange={(e) => setChatId(e.target.value)} id='chatid' type="text" /></div>
                    <button onClick={enterChat}>Enter</button>
                </form>}
            </div>
        </div>
    )
}

