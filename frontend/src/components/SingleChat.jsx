import { ArrowBackIcon } from "@chakra-ui/icons";
import {
	Box,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSenderFull, getSenderName } from "../config/ChatLogic";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import {
	useSendMessageMutation,
	useGetChatMessageQuery,
} from "../slicers/messagesApiSlice";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ selectedChat, setCurrChat, refresh }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const [newMessages, setNewMessages] = useState("");
	const [messages, setMessages] = useState([]);

	const toast = useToast();

	const [sendMessage, { isLoading: loadingSend }] = useSendMessageMutation();
	const { data, isLoading, error } = useGetChatMessageQuery(selectedChat?._id);

	useEffect(()=>{
		setMessages(data)
	}, [data])
	
	const typingHandler = (e) => {
		setNewMessages(e.target.value);
	};

	const handleSendMessage = async (e) => {
		if (newMessages && e.key === "Enter") {
			const body = {
				content: newMessages,
				chatId: selectedChat._id,
			};
			try {
				setNewMessages("");
				const lastMessage = await sendMessage(body).unwrap();
				setMessages([...data, lastMessage])
			} catch (err) {
				toast({
					title: "Failed to send the message!",
					description: `Unable to send your message due to error: "${
						err?.data?.message || err?.error
					}".`,
					status: "error",
				});
			}
		}
	};

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "xl", md: "3xl" }}
						pb={3}
						px={2}
						width="100%"
						display="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center"
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setCurrChat("")}
						/>
						{!selectedChat.isGroupChat ? (
							<>
								{getSenderName(userInfo, selectedChat.users).name}
								<ProfileModel
									userInfo={getSenderFull(userInfo, selectedChat.users)}
								/>
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModel
									currChat={selectedChat}
									refreshAllChat={refresh}
									setCurrChat={setCurrChat}
								/>
							</>
						)}
					</Text>
					<Box
						display="flex"
						flexDirection="column"
						justifyContent="flex-end"
						p={3}
						background="whitesmoke"
						height="100%"
						width="100%"
						borderRadius="lg"
						overflowY="hidden"
					>
						{isLoading ? (
							<Spinner
								size="xl"
								width={20}
								height={20}
								alignSelf="center"
								margin="auto"
							/>
						) : (
							<div className="messages">
								<ScrollableChat messages={data || messages} />
							</div>
						)}
						<FormControl onKeyDown={handleSendMessage} isRequired mt={3}>
							<Input
								variant="filled"
								bg="#E0E0E0"
								placeholder="Enter a message..."
								autoComplete="off"
								onChange={(e) => typingHandler(e)}
								value={newMessages}
							/>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					height="100%"
				>
					<Text fontSize="3xl" pb={3}>
						Click on a user to start chatting
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
