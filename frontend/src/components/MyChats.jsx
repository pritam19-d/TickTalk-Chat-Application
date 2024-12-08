import React, { useState } from "react";
import { Avatar, Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useGetAllChatsQuery } from "../slicers/chatsApiSlice";
import ChatLoading from "./ChatLoading";
import { getSenderName } from "../config/ChatLogic";
import { useSelector } from "react-redux";

const MyChats = () => {
	const [selectedChat, setSelectedChat] = useState("");
	const { userInfo } = useSelector((state) => state.auth);

	const { data: allChats, refetch, isLoading, error } = useGetAllChatsQuery();

	return (
		<Box
			display="flex"
			flexDir="column"
			alignItems="center"
			p="0.8% 1.5%"
			bg="white"
			w={{ base: "100%", md: "30%" }}
			borderRadius="lg"
			borderWidth="1px"
		>
			<Box
				padding="0 3 3"
				fontSize={{ base: "28px", md: "30px" }}
				display="flex"
				width="100%"
				alignItems="center"
				justifyContent="space-between"
			>
				My chats
				<Button
					display="flex"
					fontSize={{ base: "17px", md: "10px", lg: "17px" }}
					rightIcon={<AddIcon />}
				>
					New Group Chat
				</Button>
			</Box>
			<Box display="flex" flexDir="column" width="100%">
				{isLoading ? (
					<ChatLoading style={{ borderWidth: "2px" }} />
				) : (
					<Stack overflowY="scroll">
						{allChats.map((chat) => (
							<Box
								key={chat._id}
								onClick={() => setSelectedChat(chat._id)}
								bg={selectedChat === chat._id ? "#FFFBC4" : "whitesmoke"}
								cursor="pointer"
								_hover={{
									background: "#FCFFE1",
								}}
								display="flex"
								alignContent="center"
								color="black"
								padding="5% 4%"
								borderRadius="lg"
							>
								<Avatar
									mr={2}
									size="sm"
									cursor="pointer"
									src={getSenderName(userInfo, chat.users).pic}
                  border="1px solid white"
								/>
								<Text>
									{chat.isGroupChat
										? chat.chatName
										: getSenderName(userInfo, chat.users).name}
								</Text>
							</Box>
						))}
					</Stack>
				)}
			</Box>
		</Box>
	);
};

export default MyChats;
