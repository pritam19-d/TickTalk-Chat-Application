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
	const [isTyping, setIsTyping] = useState(false);
	const [typing, setTyping] = useState(false);

	const socket = io(ENDPOINT, {
		transports: ["polling", "websocket"],
		withCredentials: true
	});

	let currentTime;
	let lastTypingTime;
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
		socket.emit("setup", userInfo);
		socket.on("connected", () => setSocketConnected(true));
	}, [userInfo, socket]);

	useEffect(()=>{
		setIsTyping(false);
		socket.emit("join chat", selectedChat?._id);
		fetchAllMessage(selectedChat);
		socket.on("typingRecvd", (userData, room)=> {
			// console.log(userData, " started typing in ", room);
			userData !== userInfo._id && setIsTyping(true);
		})

		socket.on("stopTypingRecvd", (userData, room)=>{
			// console.log(userData, " stopped typing in ", room);
      userData !== userInfo._id && setIsTyping(false);
		})
		
    return () => {
      socket.off("typingRecvd");
      socket.off("stopTypingRecvd");
    };
	}, [selectedChat])

	useEffect(() => {
		socket.on("message received", (newMessageReceived) => {
			if (selectedChat?._id !== newMessageReceived.chat._id) {
				// send notification
			} else {
				newMessageReceived.sender._id !== userInfo._id && setMessages((prev)=> [...prev, newMessageReceived]);
			}
		});
		console.log(socket.rooms)
	});

	const typingHandler = (e) => {
		setNewMessages(e.target.value);

		if (!socketConnected) return;

		if (!typing) {
			setTyping(true)
			socket.emit("typingSent", selectedChat._id, userInfo._id);
		}
		lastTypingTime = new Date().getTime();

		setTimeout(() => {
			currentTime = new Date().getTime();
			if (currentTime - lastTypingTime >= TIMERLENGTH && typing) {
				setTyping(false)
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
				socket.emit("stopTypingSent", selectedChat._id, userInfo._id);
				const lastMessage = await sendMessage(body).unwrap();
				setNewMessages("");
				socket.emit("new message", lastMessage, userInfo._id);
				setMessages((prev)=> [...prev, lastMessage]);
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
