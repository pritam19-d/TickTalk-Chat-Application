import { AddIcon, CloseIcon, SpinnerIcon, ViewIcon } from "@chakra-ui/icons";
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
import {
	useAddUserIntoGroupMutation,
	useRemoveUserFromGroupMutation,
	useUpdateGroupNameMutation,
} from "../../slicers/chatsApiSlice";
import { useGetUsersQuery } from "../../slicers/usersApiSlice";
import { useSelector } from "react-redux";

const UpdateGroupChatModel = ({ currChat, setCurrChat, refreshAllChat }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const toast = useToast();

	const [groupChatName, setGroupChatName] = useState(currChat?.chatName);
	const [usersInGroup, setUsersInGroup] = useState(currChat?.users);
	const [loadingUser, setLoadUser] = useState("");
	const [search, setSearch] = useState("");

	const { userInfo } = useSelector((state) => state.auth);

	const { data, isLoading, error } = useGetUsersQuery(search);

	const [updateGroupName, { isLoading: loadingUpdate }] =
		useUpdateGroupNameMutation();
	const [addUsers, { isLoading: loadingAdd }] = useAddUserIntoGroupMutation();
	const [removeUsers, { isLoading: loadingRemove }] =
		useRemoveUserFromGroupMutation();

	useEffect(() => {
		// setGroupChatName(currChat.chatName);
		// setUsersInGroup(currChat.users);
		const userModification = async () => {};

		userModification();
	}, [usersInGroup]);

	const handleGroup = async (user) => {
		const body = {
			chatId: currChat._id,
			userId: user._id,
		};
		setLoadUser(user._id)
		try {
			if (!usersInGroup?.map((user) => user._id).includes(user._id)) {
				//To check if the user is not present group
				await addUsers(body).unwrap();
				setUsersInGroup([...usersInGroup, user])
				toast({ title: "User Additon Successful!", status: "success" });
			} else if (usersInGroup.length >= 2) {
				await removeUsers(body).unwrap();
				setUsersInGroup(usersInGroup.filter((usr) => usr._id !== user._id));
				toast({ title: "User Removal Successful!", status: "success" });
			} else {
				toast({
					title: "Unable Remove!",
					description: `Cannot remove ${user.name}, as there must be at least 3 users to be kept for the group.`,
					status: "warning",
				});
			}
		} catch (err) {
			toast({
				title: "Unable to add/remove user!",
				description: `Could not Add / Remove the user into / from the group due to "${err?.data?.message || err?.error}".`,
				status: "error",
			});
		} finally {
			setLoadUser("");
		}
	};

	const handleRename = async (e) => {
		e.preventDefault();
		const body = {
			chatId: currChat._id,
			chatName: groupChatName,
		};
		try {
			const res = await updateGroupName(body).unwrap();
			onClose();
			toast({
				title: "Group Name Updated Successfully!",
				description: `Your updated group name is "${res.chatName}".`,
				status: "success",
			});
			refreshAllChat();
			setCurrChat("");
		} catch (err) {
			toast({
				title: "Unable to update group name!",
				description: `Could not update the group name due to "${
					err?.data?.message || err?.error
				}".`,
				status: "error",
			});
		}
	};

	const handleLeave = async (e) => {
		e.preventDefault();
		try {
			const res = await removeUsers({ chatId: currChat._id, userId: userInfo._id });
			onClose();
			toast({
				title: "Leave Successfully!",
				description: `You have been removed form '${res.data.chatName}' group.`,
				status: "success",
			});
			setCurrChat("");
			refreshAllChat();
		} catch (err) {
			toast({
				title: "Unable to leave!",
				description: `Could not Remove you from the group due to "${err?.data?.message || err?.error}".`,
				status: "error",
			});
		}
	};

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
								isDisabled={
									currChat.chatName === groupChatName.trim() || loadingUpdate
								}
							>
								{loadingUpdate ? "Updating..." : "Update"}
							</Button>
						</FormControl>
						<Box>
							<HStack spacing={2} display="flex" flexWrap="wrap">
								{usersInGroup?.map((user) => (
									<Tag
										size="md"
										key={user._id}
										variant={userInfo._id !== user._id ? "subtle" : "outline"}
										colorScheme={currChat.users.includes(user) ? "green" : "blue"}
										cursor="default"
									>
										{userInfo._id !== user._id && (
											<TagLeftIcon
												boxSize="12px"
												as={loadingRemove && loadingUser===user._id ? SpinnerIcon : CloseIcon}
												cursor="pointer"
												onClick={() => handleGroup(user)}
											/>
										)}
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
									{data?.map(
										(user) =>
											!usersInGroup
												.map((each) => each._id)
												.includes(user._id) && (
												<Tag
													size="md"
													key={user._id}
													variant="subtle"
													colorScheme="blue"
													cursor="default"
												>
													<TagLeftIcon
														boxSize="12px"
														as={loadingAdd && loadingUser===user._id ? SpinnerIcon : AddIcon }
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
											)
									)}
								</HStack>
							)}
						</Box>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="red" onClick={handleLeave}>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModel;
