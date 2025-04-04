import { ArrowBackIcon, ArrowUpIcon } from "@chakra-ui/icons";
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
import Lottie from "react-lottie";
import axios from "axios";
import { io } from "socket.io-client";
import { getSenderFull, getSenderName } from "../config/ChatLogic";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import { useSendMessageMutation } from "../slicers/messagesApiSlice";
import ScrollableChat from "./ScrollableChat";
import { ENDPOINT, MESSAGE_URL } from "../constants";
import * as animationData from "../animation/TypingAnimation.json";

const SingleChat = ({ selectedChat, setCurrChat, refresh }) => {
	const TIMERLENGTH = 2000;
	const { userInfo } = useSelector((state) => state.auth);
	const [newMessages, setNewMessages] = useState("");
	const [messages, setMessages] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const socket = io(ENDPOINT);
	const toast = useToast();

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};

	const [sendMessage, { isLoading: loadingSend }] = useSendMessageMutation();

	const fetchAllMessage = async (selectedChat) => {
		if (selectedChat?._id) {
			try {
				setLoading(true);
				const res = await axios.get(`${MESSAGE_URL}/${selectedChat._id}`);
				setMessages(res.data);
			} catch (err) {
				console.log(err);
				toast({
					title: "Unable to fetch chats",
					description: `Unable to fetch your message due to error: "${
						err?.data?.message || err?.error
					}".`,
					status: "error",
				});
			} finally {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		fetchAllMessage(selectedChat);
	}, []);

	useEffect(() => {
		typing && setIsTyping(false)
		fetchAllMessage(selectedChat);
		socket.emit("setup", userInfo);
		socket.on("connected", () => setSocketConnected(true));
		socket.emit("join chat", selectedChat?._id);
		socket.on("typing",(userId, room) => (selectedChat?._id === room) && (userId !== userInfo._id) && setIsTyping(true));
		socket.on("stop typing",(userId, room) => (typing && selectedChat?._id) === (room && userId !== userInfo._id) && setIsTyping(false));
	}, [selectedChat, userInfo]);

	useEffect(() => {
		socket.on("message received", (newMessageReceived) => {
			if (selectedChat?._id !== newMessageReceived.chat._id) {
				// send notification
			} else {
				setMessages((prevMessage) => [...prevMessage, newMessageReceived]);
				// messages.push(newMessageReceived)
			}
		});
	});

	const typingHandler = (e) => {
		setNewMessages(e.target.value);

		if (!socketConnected) return;

		if (!typing) {
			setTyping(true);
			socket.emit("typing", selectedChat._id, userInfo._id);
		}
		const lastTypingTime = new Date().getTime();

		setTimeout(() => {
			const currentTime = new Date().getTime();
			if (typing && currentTime - lastTypingTime >= TIMERLENGTH) {
				socket.emit("stop typing", selectedChat._id, userInfo._id);
				setTyping(false);
			}
		}, TIMERLENGTH);
	};

	const handleSendMessage = async (e) => {
		const body = {
			content: newMessages,
			chatId: selectedChat._id,
		};
		if (newMessages && (e.type === "click" || e.key === "Enter")) {
			try {
				setNewMessages("");
				socket.emit("stop typing", selectedChat._id,userInfo._id);
				const lastMessage = await sendMessage(body).unwrap();
				socket.emit("new message", lastMessage);
				setMessages([...messages, lastMessage]);
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
								<ScrollableChat messages={messages} />
							</div>
						)}
						{isTyping && (
							<div>
								<Lottie
									options={defaultOptions}
									width={60}
									style={{ marginLeft: "36px" }}
								/>
							</div>
						)}
						<FormControl
							onKeyDown={handleSendMessage}
							isRequired
							mt={3}
							display="flex"
							alignItems="center"
						>
							<Input
								variant="filled"
								bg="#E0E0E0"
								placeholder="Enter a message..."
								autoComplete="off"
								onChange={(e) => typingHandler(e)}
								value={newMessages}
							/>
							{loadingSend ? (
								<Spinner size="lg" marginLeft={2} />
							) : (
								<ArrowUpIcon
									boxSize={6}
									marginLeft={2}
									onClick={handleSendMessage}
									cursor="pointer"
								/>
							)}
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
