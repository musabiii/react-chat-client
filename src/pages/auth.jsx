import React, { useEffect, useState } from 'react'
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
        const chatName = Math.random().toString(36).slice(-8);
        navigate(`/chat?${createSearchParams({ chat: chatName, username }).toString()}`)
    }

    const enterChat = (e) => {
        e.preventDefault();
        navigate(`/chat?${createSearchParams({ chat: chatId, username }).toString()}`)
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
                        <label htmlFor="username">username:</label><input value={username} onChange={(e) => setUsername(e.target.value)} id='username' type="text" />
                    </div>
                    <button onClick={createChat}>Create</button>
                    {/* <p>or</p> */}
                </form>}
                {activeTab === "enter" && <form>
                    <div className='form-row'><label htmlFor="username">username:</label><input value={username} onChange={(e) => setUsername(e.target.value)} id='username' type="text" /></div>
                    <div className='form-row'><label htmlFor="chatid">chat name:</label><input value={chatId} onChange={(e) => setChatId(e.target.value)} id='chatid' type="text" /></div>
                    <button onClick={enterChat}>Enter</button>
                </form>}
            </div>
        </div>
    )
}

