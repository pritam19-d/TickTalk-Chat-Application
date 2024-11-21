import {
	Box,
	Container,
	Tab,
	TabList,
	TabPanels,
	TabPanel,
	Tabs,
	Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";

const Homepage = () => {
  const navigate = useNavigate();
	const { userInfo } = useSelector((state) => state.auth)

	const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get("redirect") || "/chats"

	useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

	return (
		<Container maxW="xl" centerContent>
			<Box
				d="flex"
				justifyContent="center"
				p={3}
				bg="whitesmoke"
				w="100%"
				m="40px 0 15px 0"
				borderRadius="lg"
				borderWidth="1px"
			>
				<Text
					textAlign="center"
					bgGradient="linear(to-l, #7928CA, #FF0080)"
					bgClip="text"
					fontSize="4xl"
					fontWeight="extrabold"
					fontFamily="Poppins"
				>
					<b>Tick-n-Talk</b>
				</Text>
			</Box>
			<Box
				d="flex"
				justifyContent="center"
				p={3}
				bg="whitesmoke"
				w="100%"
				m="40px 0 15px 0"
				borderRadius="lg"
				borderWidth="1px"
			>
				<Tabs isFitted variant="soft-rounded" >
					<TabList colorscheme="green">
						<Tab>Login</Tab>
						<Tab>Sign Up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login />
						</TabPanel>
						<TabPanel>
							<SignUp />
              </TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default Homepage;
