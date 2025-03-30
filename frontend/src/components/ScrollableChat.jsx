import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogic";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const ScrollableChat = ({ messages }) => {
	const { userInfo } = useSelector((state) => state.auth);

	return (
		<ScrollableFeed>
			{messages?.map((message, index) => (
				<div style={{ display: "flex" }} key={message._id}>
					{isSameSender(
            messages, message, index, userInfo._id) ||
						(isLastMessage(messages, index, userInfo._id) && (
							<Tooltip label={message.sender.name} placement="bottom-start" hasArrow>
								<Avatar
									mt="7px"
									mr={1}
									size="sm"
									cursor="pointer"
									name={message.sender.name}
									src={message.sender.pic}
								/>
							</Tooltip>
						))}
					<span
						style={{
							backgroundColor: `${
								message.sender._id === userInfo._id ? "#BEE3F8" : "#B9F5D0"
							}`,
							borderRadius: "20px",
							padding: "5px 15px",
							maxWidth: "75%",
              marginLeft : isSameSenderMargin(messages, message, index, userInfo._id),
              marginTop: isSameUser(messages, message, index, userInfo._id) ? 3 : 10
						}}
					>{message.content}</span>
				</div>
			))}
		</ScrollableFeed>
	);
};

export default ScrollableChat;
