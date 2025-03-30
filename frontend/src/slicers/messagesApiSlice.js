import { MESSAGE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder)=>({
    sendMessage : builder.mutation({
      query : (data) => ({
        url : `${MESSAGE_URL}`,
        method : "POST",
        body : data
      })
    }),
    getChatMessage : builder.query({
      query : (chatId = "null")=>({
        url : `${MESSAGE_URL}/${chatId}`
      })
    })
  })
})

export const { useSendMessageMutation, useGetChatMessageQuery } = messagesApiSlice