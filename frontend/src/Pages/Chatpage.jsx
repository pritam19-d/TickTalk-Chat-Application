import { React, useState, useEffect } from "react"
import axios from "axios"

const Chatpage = () => {

  const [chats, setChats] = useState([])
  const fetchChats = async ()=>{
    const { data } = await axios.get("/api/chats")
    setChats(data)
  }

  useEffect(()=>{
    fetchChats()
  }, [])
  return (
    <>
    {chats.map(chat=>(
      <div key={chat._id}>
        {chat.chatName}
      </div>
    ))}
    </> 
  )
}

export default Chatpage
