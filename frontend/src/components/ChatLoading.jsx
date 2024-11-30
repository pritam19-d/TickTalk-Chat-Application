import { Skeleton, Stack } from "@chakra-ui/react"
import React from 'react'

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="5%"/>
      <Skeleton height="5%"/>
      <Skeleton height="5%"/>
      <Skeleton height="5%"/>
      <Skeleton height="5%"/>
      <Skeleton height="5%"/>
      <Skeleton height="5%"/>
      <Skeleton height="5%"/>
      <Skeleton height="5%"/>
      <Skeleton height="5%"/>
    </Stack>
  )
}

export default ChatLoading
