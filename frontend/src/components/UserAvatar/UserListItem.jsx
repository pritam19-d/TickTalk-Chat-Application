import { Avatar, Box, Text } from "@chakra-ui/react"
import React from 'react'
import { useCreateChatMutation } from "../../slicers/chatsApiSlice";

const UserListItem = ({ user }) => {

  const [ createChat, isLoading, error ] = useCreateChatMutation();


  const handleClick = async ()=>{
    console.log(`Clicked userID is---> ${user._id}`);
    try {
      const chatData = await createChat({"userId": user._id}).unwrap()
      console.log(chatData);
    } catch (err) {
      console.log(`Error--> ${err?.data?.message || err.error}`);
    }
  }

  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      bg="whitesmoke"
      _hover={{
        background: "#FCFFE1"
      }}
      width="100%"
      display="flex"
      alignItems="center"
      color="black"
      padding="5% 4%"
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        src={user.pic}
        name={user.name}
      />
      <Box>
        <Text mb={0}><b>{user.name}</b></Text>
        <Text fontSize="xs" mb={0}>
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  )
}

export default UserListItem
