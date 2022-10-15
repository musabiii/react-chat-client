import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App'
import './style.scss'
import { Auth } from './pages/auth'
import { Chat } from './pages/chat'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Routes>
      <Route path='/' element={<Navigate to="/auth" replace />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/chat' element={<Chat />} />
    </Routes>
  </HashRouter>
)
