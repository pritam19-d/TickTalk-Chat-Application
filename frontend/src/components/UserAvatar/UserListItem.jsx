import { Avatar, Box, Spinner, Text, useToast } from "@chakra-ui/react"
import React from 'react'
import { useCreateChatMutation } from "../../slicers/chatsApiSlice";

const UserListItem = ({ user }) => {

  const [ createChat, { isLoading }] = useCreateChatMutation();

	const toast = useToast();

  const handleClick = async ()=>{
    try {
      const chatData = await createChat({"userId": user._id}).unwrap()
      console.log(chatData._id);
    } catch (err) {
      toast({
        title: "Error Occoured",
				description: `Error : ${err?.data?.message || err.error}`,
				status: "error",
				isClosable: true
      })
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
    >{isLoading ? <Spinner size="lg" mr={2} color="blue.600" thickness="4px" /> 
      : <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        src={user.pic}
        name={user.name}
      />
      }
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
