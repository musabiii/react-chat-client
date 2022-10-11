import React, { useEffect, useState } from 'react'
import { createSearchParams, Link, useNavigate, useSearchParams } from 'react-router-dom'


export const Auth = () => {
    const [username, setUsername] = useState('')
    const [searchParams] = useSearchParams()
    const existChat = searchParams.get('chat');
    const [chatId, setChatId] = useState(existChat || "")
    const [showForm, setShowForm] = useState(false)
    const navigate = useNavigate()

    const createChat = (e) => {


        e.preventDefault();
        const chatName = Math.random().toString(36).slice(-8);
        // navigate({ pathname: "chat", search: createSearchParams({ chat: chatName, username }).toString() }, { replace: true,relative:false })
        navigate(`/chat?${createSearchParams({ chat: chatName, username }).toString()}`)
    }

    const enterChat = (e) => {
        e.preventDefault();

        navigate(`/chat?${createSearchParams({ chat: chatId, username }).toString()}`)
    }

    return (
        <div className='auth-page'>
            <h1>Welcome!</h1>
            {!existChat && <form>
                <h2>Create chat</h2>
                <div className='form-row'>
                    <label htmlFor="username">username:</label><input value={username} onChange={(e) => setUsername(e.target.value)} id='username' type="text" />
                </div>
                <button onClick={createChat}>create chat</button>
                <p>or</p>
            </form>}
            <div className='show-form' onClick={() => setShowForm(!showForm)}>Enter to chat</div>
            {showForm && <form>
                <div className='form-row'><label htmlFor="username">username:</label><input value={username} onChange={(e) => setUsername(e.target.value)} id='username' type="text" /></div>
                <div className='form-row'><label htmlFor="chatid">chat name:</label><input value={chatId} onChange={(e) => setChatId(e.target.value)} id='chatid' type="text" /></div>
                <button onClick={enterChat}>Enter</button>
            </form>}
        </div>
    )
}

// function getQuery(q) {
//     let qstr = "?"
//     for (let k in q) {
//         qstr = `${qstr}${k}=${q[k]}&`
//     }
//     return qstr.slice(0, -1)
// }