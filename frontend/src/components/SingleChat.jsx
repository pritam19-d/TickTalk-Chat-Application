import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { getSenderFull, getSenderName } from "../config/ChatLogic";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";

const SingleChat = ({ selectedChat, setCurrChat, refresh}) => {
	const { userInfo } = useSelector((state) => state.auth);

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
                <ProfileModel userInfo={getSenderFull(userInfo, selectedChat.users)}/>
              </> 
            ) : (
              <>{selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel currChat={selectedChat} refreshAllChat={refresh} setCurrChat={setCurrChat}/>
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
				></Box>
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
