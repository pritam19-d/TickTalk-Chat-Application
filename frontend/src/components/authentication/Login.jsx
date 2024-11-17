import React, { useEffect, useState } from "react";
import {
	FormControl,
	FormLabel,
	Input,
	InputRightElement,
	VStack,
	Button,
	InputGroup,
	Text,
	useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../slicers/usersApiSlice";
import { setCredentials } from "../../slicers/authSlice";

const Login = () => {
	const [show, setShow] = useState(true);

	const [email, setEmail] = useState();
	const [password, setPassword] = useState();

	const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation()

	const { userInfo } = useSelector((state) => state.auth)

	const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get("redirect") || "/chats"

	useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

	const toast = useToast()
	const showToast = (title, description = "", status)=>{
		return toast({
			title: title,
			description: description,
			status: status,
			duration: description==="success" ? 3000 : 5000,
			isClosable: true,
			variant : "subtle"
		})
	}

	const loginSubmitHandler = async (e)=>{
    e.preventDefault()
		try {
			const res = await login({ email, password }).unwrap()
			dispatch(setCredentials({ ...res }))
      navigate(redirect)
		} catch (err) {
			showToast("Unable to Log you in!", err?.data?.message || err.error, "error")
		}
  }


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
			<Button colorScheme="blue" w="60%" mt="15" onClick={loginSubmitHandler} isLoading={isLoading}>
				Sign In
			</Button>
		</VStack>
	);
};

export default Login;
