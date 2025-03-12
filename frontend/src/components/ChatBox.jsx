import { Box } from "@chakra-ui/react";
import React from 'react'
import SingleChat from "./SingleChat";

const ChatBox = ({currentChat, setCurrentChatFunc, refetch}) => {
  
  return (
    <Box 
    display={{base : currentChat ? "flex" : "none", md: "flex"}}
    flexDir="column"
    bg="white"
    width={{base : "100%", md: "68%"}}
    alignItems="center"
    color="black"
    p={2}
    borderRadius="lg"
    borderWidth="1px"
    >
      <SingleChat selectedChat={currentChat} setCurrChat={setCurrentChatFunc} refresh={refetch} />
    </Box>
  )
}

export default ChatBox
