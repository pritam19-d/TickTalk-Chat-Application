import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useToast } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Avatar } from "@chakra-ui/avatar"
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../slicers/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slicers/authSlice";
import ProfileModel from "./ProfileModel";

const Navbar = () => {

  const { userInfo } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()

  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async()=>{
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate("/")
      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully!",
        status: "success",
        // duration: 9000,
        // isClosable: true,
      })
    } catch (err) {
      toast({
        title: "Error Occoured",
        description: `Unable to complete the log out due to the error below-\n${err}`,
        status: "error",
        // duration: 9000,
        // isClosable: true,
      })
    }
  }

	return (
		<Box
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			background="white"
			padding="1% 2%"
			borderWidth="2%"
		>
			<Tooltip label="Search for an user" hasArrow placement="bottom-end">
				<Button variant="ghost">
					<i
						className="fa-solid fa-magnifying-glass"
						style={{ color: "#74C0FC" }}
					/>
					<Text display={{ base: "none", md: "flex" }} my="auto" px={4}>
						Search User
					</Text>
				</Button>
			</Tooltip>
			<Text fontSize="2xl" my="auto" px={4}>
				<b>Tick-n-Talk</b>
			</Text>
			<div>
				<Menu>
					<MenuButton padding={1}>
            <BellIcon />
          </MenuButton>
				</Menu>
        <Menu>
					<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size="sm" cursor="pointer" name={userInfo.name} src={userInfo.pic} />
          </MenuButton>
          <MenuList>
            <ProfileModel userInfo={userInfo}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModel>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
				</Menu>
			</div>
		</Box>
	);
};

export default Navbar;
