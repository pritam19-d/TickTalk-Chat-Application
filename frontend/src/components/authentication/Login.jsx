import React, { useState } from "react";
import {
	FormControl,
	FormLabel,
	Input,
	InputRightElement,
	VStack,
	Button,
	InputGroup,
	Text,
} from "@chakra-ui/react";

const Login = () => {
	const [show, setShow] = useState(false);

	const [email, setEmail] = useState();
	const [password, setPassword] = useState();

  // const submitHandler = (e)=>{
  //   e.preventDefault
  //   console.log("form submitted!");
  // }

	return (
		<VStack spacing="5px">
			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					type="email"
					placeholder="Enter Your Email Id"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						type={show ? "password" : "text"}
						placeholder="Type Your Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputRightElement width="4.5rem">
						<Button h="1.75" size="sm" onClick={() => setShow(!show)}>
							{show ? "Show" : "Hide"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<Text color="red">* Marked fields are the mandatory field.</Text>
			<Button colorScheme="blue" w="60%" mt="15">
				Sign Up
			</Button>
		</VStack>
	);
};

export default Login;
