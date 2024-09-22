import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

const SignUp = () => {
	const [show, setShow] = useState(false);

	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [confirmPassword, setConfirmPassword] = useState();
	const [pic, setPic] = useState();

  const postDetails = (pics)=>{
  }
  
  // const submitHandler = (e)=>{
  //   e.preventDefault
  //   console.log("form submitted!");
  // }

	return (
		<VStack spacing="5px">
			<FormControl id="name" isRequired>
				<FormLabel>Name</FormLabel>
				<Input
					type="text"
					placeholder="Enter Your Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</FormControl>
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
			<FormControl isRequired>
				<FormLabel>Confirm Password</FormLabel>
				<Input
					type="password"
					placeholder="Confirm Your Password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
				<FormLabel id="displayPic" isRequired>
					Display picture
				</FormLabel>
				<Input
					type="file"
					p={1.5}
					accept="image/*"
					value={pic}
					onChange={(e) => postDetails(e.target.files[0])}
				/>
			</FormControl>
			<Text color="red">* Marked fields are the mandatory field.</Text>
      <Button colorScheme="blue" w="80%" mt="15">
        Sign Up
      </Button>
		</VStack>
	);
};

export default SignUp;
