import React, { useEffect, useState } from 'react'
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");


export const Sandbox = () => {

console.log("render")

const [count, setCount] = useState(0)
  // const socket = io("ws://localhost:3000");
  //   const socket = io("ws://localhost:3000", {
  //   reconnectionDelayMax: 10000,
  //   // auth: {
  //   //   token: "123"
  //   // },
  //   query: {
  //     "name": "musa",
  //     "room":"js"
  //   }
  // });
  // console.log({socket})
  // socket.emit('start');

  const emitServer = (msg) => {
    socket.emit("console",msg)
  }


  useEffect(()=>{
    console.log("usse effect")
    // const socket = io.connect("http://localhost:3000");
      socket.on("message",(message)=>{
        console.log(message)
      })

  },[])

  return (
    <>
    <div>sandbox</div>
    <div className="count">count</div>
    <button onClick={()=>setCount(prev=>prev+1)}>+</button>
    <button onClick={()=>emitServer("some emit")}>emit server</button>
    </>

  )
}
