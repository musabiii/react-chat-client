import { useState } from 'react'
import './App.css'
import { Sandbox } from './components/sandbox'

function App() {

// socket.on("message", (msg) => {

//   console.log({msg})

// })

  return (
    <div className="App">
      <Sandbox/>
    </div>
  )
}

export default App
