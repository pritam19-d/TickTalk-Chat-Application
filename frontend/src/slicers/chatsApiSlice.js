import { CHATS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const chatsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder)=>({
    createChat : builder.mutation({
      query : (userId)=> ({
        url : `${CHATS_URL}`,
        method: "POST",
        body: userId
      }),
      providesTags: ["Chats"],
      keepUnusedDataFor: 5
    }),
    getAllChats : builder.query({
      query : ()=> ({
        url : `${CHATS_URL}`,
        method: "GET",
      }),
      providesTags: ["Chats"],
      keepUnusedDataFor: 5
    }),
    createGroupChat: builder.mutation({
      query : (data)=> ({
        url : `${CHATS_URL}/group`,
        method: "POST",
        body: data
      })
    })
  })
})

export const { useCreateChatMutation, useGetAllChatsQuery, useCreateGroupChatMutation } = chatsApiSlice