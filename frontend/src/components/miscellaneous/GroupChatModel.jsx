import {
	Avatar,
	Box,
	Button,
	FormControl,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tag,
	TagLabel,
	TagLeftIcon,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useGetUsersQuery } from "../../slicers/usersApiSlice";
import { useSelector } from "react-redux";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useCreateGroupChatMutation } from "../../slicers/chatsApiSlice";

const GroupChatModel = ({ children, refresh }) => {
	const [search, setSearch] = useState("");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupName, setGroupName] = useState("");
	const [userList, setUserList] = useState([]);
	const toast = useToast();

	const { userInfo } = useSelector((state) => state.auth);
	const { data, isLoading, error } = useGetUsersQuery(search);
	const  [createGroupChat, {isLoading: loadingCreate}] = useCreateGroupChatMutation();

	const handleGroup = (userToAdd) => {
		setUserList(
			(prevList) =>
				prevList.some((user) => user._id === userToAdd._id)
					? prevList.filter((user) => user._id !== userToAdd._id) // Remove user by ID
					: [...prevList, userToAdd] // Add user if not already present
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault()
		const body = {
			name: groupName,
			users : JSON.stringify(userList.map(user => user._id))
		};
		try {
			const res = await createGroupChat(body).unwrap();
			toast({title: "Chat Created Successfully!", description: `Your new Group Chat named "${res.chatName}" has been created.`, status: "success" })
			refresh();
			onClose();
		} catch (err) {
			console.log(err);
			toast({ title: "Unable to create group", description: "Due to some internal error we're unable to create group.", status: "warning" })
		}
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize="2rem">Create Your Group</ModalHeader>
					<ModalCloseButton />
					<ModalBody display="flex" flexDirection="column" alignItems="center">
						<FormControl>
							<Input
								placeholder="Chat Name"
								mb={3}
								onChange={(e) => setGroupName(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Name of Users Whom You Wanna Add"
								mb={3}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</FormControl>
						<Text className="my-0" fontSize="0.8rem" color="tomato" hidden={userList.length >= 2}>
							You need to select more than one user to create a group
						</Text>
						<Box>
							{isLoading ? (
								<h5>Loading...</h5>
							) : error && search > 2 ? (
								toast({ title: "Something went Wrong", status: "error" })
							) : (
								<HStack spacing={4} display="flex" flexWrap="wrap">
									{data?.map((user) => (
										<Tag
											size="md"
											key={user._id}
											variant="subtle"
											colorScheme={userList.includes(user) ? "green" : "blue"}
											cursor="default"
										>
											<TagLeftIcon
												boxSize="12px"
												as={userList.includes(user) ? CloseIcon : AddIcon}
												cursor="pointer"
												onClick={() => handleGroup(user)}
											/>
											<TagLabel>
												<Avatar
													size="xs"
													name={user.name}
													src={user.pic}
													padding="3px"
												/>
											</TagLabel>
											<Tooltip label={user.email} aria-label="A tooltip">
												<TagLabel>{user.name}</TagLabel>
											</Tooltip>
										</Tag>
									))}
								</HStack>
							)}
						</Box>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleSubmit}
							isDisabled={userList.length <= 1 || !groupName || loadingCreate}
						>
							{loadingCreate? "Creating" : "Create"} Chat{loadingCreate && "..."}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModel;
