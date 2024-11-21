import { React, useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";
import Header from "../components/miscellaneous/Header";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const Chatpage = () => {
	const { userInfo } = useSelector((state) => state.auth);

	return (
		<div style={{ width: "100%" }}>
			{userInfo && <Header />}
			<Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="90vh"
        p="10px"
      >
				{userInfo && <MyChats />}
				{userInfo && <ChatBox />}
			</Box>
		</div>
	);
};

export default Chatpage;
