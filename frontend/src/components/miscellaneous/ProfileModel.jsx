import { ViewIcon } from "@chakra-ui/icons"
import { Avatar, Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import React from 'react'

const ProfileModel = ({userInfo, children}) => {
  const overlay = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="blur(10px)"
    />
  )

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
    {children ? (<span onClick={onOpen}>{children}</span>)
      : <IconButton display={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen} />
    }
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="lg">
        {overlay}
        <ModalContent>
          <ModalHeader display="flex" justifyContent="center"><b>{userInfo.name}</b></ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            <Avatar 
              boxSize="35%"
              src={userInfo.pic}
              alt={userInfo.name}
            />
            <Text fontSize={{base: "28px", md: "30px"}}>Email: {userInfo.email}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModel
