import {
	Avatar,
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	VStack,
	useToast
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setCredentials } from "../../slicers/authSlice.js";
import { useRegisterMutation, useUploadUserDpMutation } from "../../slicers/usersApiSlice";

const SignUp = () => {
	const [show, setShow] = useState(true);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [pic, setPic] = useState("");

	const dispatch = useDispatch();
  const navigate = useNavigate();

  const [uploadUserDp, {isLoading: loadingUpload}] = useUploadUserDpMutation()
  const [register, { isLoading: loadingRegister }] = useRegisterMutation()

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

	const uploadFileHandler = async (e)=>{
    const formData = new FormData()
    formData.append("image", e.target.files[0]);
    try {
			const res = await uploadUserDp(formData).unwrap()
			setPic(res.secure_url)
			showToast("DP Uploaded successfully", res.message || "There might be some issue occour while showing your DP", "success" )
    } catch (err) {
			showToast("Error Occoured!", err?.data?.message || err.error, "error")
    }
  }
  
  const submitHandler = async (e)=>{
    e.preventDefault()
		if (password !== confirmPassword) {
      showToast("Check Password!", "Please retype the 'Confirm Password' correctly", "warning")
    } else if (password.length < 6){
			showToast("Check Password!", "Your password must contains atleast 6 characters", "warning")
    } else {
      try {
        const res = await register({ name, email, password, pic }).unwrap()
				showToast("Signed Up successfully!", `Cheers ${res.name}! your details have been saved successfully.`, "success" )
				// redirection to chats page needs to added
				dispatch(setCredentials({ ...res }))
        navigate(redirect)
      } catch (err) {
				showToast("Unable to Sign Up!", err?.data?.message || err.error, "error")
      }
    }
  }

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
				<FormLabel id="displayPic">
					Display picture
				</FormLabel>
				<InputGroup>
				<Input
				  width="91%"
					type="file"
					p={1.5}
					accept="image/*"
					onChange={uploadFileHandler}
					/>
					<InputRightElement width="4.5rem">
						<Avatar src={pic} />
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<Text color="red">* Marked fields are the mandatory field.</Text>
      <Button colorScheme="blue" w="80%" mt="15" onClick={submitHandler} isLoading={loadingUpload || loadingRegister}>
        Sign Up
      </Button>
		</VStack>
	);
};

export default SignUp;
