import { AddIcon, CloseIcon, ViewIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Box,
	Button,
	FormControl,
	HStack,
	IconButton,
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
	Tooltip,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useUpdateGroupNameMutation } from "../../slicers/chatsApiSlice";
import { useGetUsersQuery } from "../../slicers/usersApiSlice";

const UpdateGroupChatModel = ({ currChat, setCurrChat, refreshAllChat}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const toast = useToast();

	const [groupChatName, setGroupChatName] = useState(currChat?.chatName);
	const [usersInGroup, setUsersInGroup] = useState(currChat?.users);
	const [search, setSearch] = useState("");

	const { data, isLoading, error } = useGetUsersQuery(search);

	const [updateGroupName, { isLoading: loadingUpdate }] =
		useUpdateGroupNameMutation();

	useEffect(() => {
		// setGroupChatName(currChat.chatName);
		// setUsersInGroup(currChat.users);
	}, [usersInGroup]);
	
	const handleGroup = (userToAdd) => {
		setUsersInGroup(
			(prevList) =>
				prevList.some((user) => user._id === userToAdd._id)
					? prevList.filter((user) => user._id !== userToAdd._id) // Remove user by ID
					: [...prevList, userToAdd] // Add user if not already present
		);
	};
	

	const handleRename = async(e)=>{
		e.preventDefault();
		const body = {
			chatId: currChat._id,
			chatName: groupChatName
		}
		try {
			const res = await updateGroupName(body).unwrap();
			onClose()
			toast({title: "Group Name Updated Successfully!", description: `Your updated group name is "${res.chatName}".`, status: "success" })
			refreshAllChat()
			setCurrChat("")
		} catch (err) {
			toast({title: "Unable to update group name!", description: `Could not update the group name due to "${err?.data?.message || err?.error}".`, status: "error" })
		}
	}

	return (
		<>
			<IconButton
				display={{ base: "flex" }}
				icon={<ViewIcon />}
				onClick={onOpen}
			/>

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader display="flex" justifyContent="center" fontSize="150%">
						{currChat?.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl display="flex">
							<Input
								placeholder="Rename your group"
								mb={3}
								value={groupChatName}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
							<Button
								variant="solid"
								colorScheme="green"
								ml={1}
								isLoading={loadingUpdate}
								onClick={handleRename}
								isDisabled={currChat.chatName === groupChatName || loadingUpdate}
							>
								{loadingUpdate? "Updating..." : "Update"}
							</Button>
						</FormControl>
						<Box>
							<HStack spacing={2} display="flex" flexWrap="wrap">
								{usersInGroup?.map((user) => (
									<Tag
										size="md"
										key={user._id}
										variant="subtle"
										colorScheme={
											currChat.users.includes(user) ? "green" : "blue"
										}
										cursor="default"
									>
										<TagLeftIcon
											boxSize="12px"
											as={usersInGroup.includes(user) ? CloseIcon : AddIcon}
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
							<FormControl display="flex" mt={2}>
								<Input
									placeholder="Search for an user to add into the group"
									mb={3}
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</FormControl>
						</Box>
						<Box>
							{isLoading ? (
								<h5>Loading...</h5>
							) : error && search > 2 ? (
								toast({ title: "Something went Wrong", status: "error" })
							) : (
								<HStack spacing={4} display="flex" flexWrap="wrap">
									{data?.map((user) => (
										!usersInGroup.map(each=> each._id).includes(user._id) &&
										<Tag
											size="md"
											key={user._id}
											variant="subtle"
											colorScheme="blue"
											cursor="default"
										>
											<TagLeftIcon
												boxSize="12px"
												as={AddIcon}
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
						<Button colorScheme="red" onClick={onClose}>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModel;
