import { React, useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";
import Header from "../components/miscellaneous/Header";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useGetAllChatsQuery } from "../slicers/chatsApiSlice";

const Chatpage = () => {
	const [selectedChat, setSelectedChat] = useState("");
	const { userInfo } = useSelector((state) => state.auth);

	const { data, refetch, isLoading } = useGetAllChatsQuery();

	return (
		<div style={{ width: "100%" }}>
			{userInfo && (
				<>
					<Header refreshChats={refetch} setSelectedChat={setSelectedChat} />
					<Box
						display="flex"
						justifyContent="space-between"
						w="100%"
						h="90vh"
						p="10px"
					>
						<MyChats
							currentChat={selectedChat}
							setCurrentChat={setSelectedChat}
							allChats={data}
							refetch={refetch}
							loading={isLoading}
						/>
						<ChatBox
							currentChat={selectedChat}
							setCurrentChatFunc={setSelectedChat}
							refetch={refetch}
						/>
					</Box>
				</>
			)}
		</div>
	);
};

export default Chatpage;
