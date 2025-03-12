import { CHATS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const chatsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createChat: builder.mutation({
			query: (userId) => ({
				url: `${CHATS_URL}`,
				method: "POST",
				body: userId,
			}),
			providesTags: ["Chats"],
			keepUnusedDataFor: 5,
		}),
		getAllChats: builder.query({
			query: () => ({
				url: `${CHATS_URL}`,
				method: "GET",
			}),
			providesTags: ["Chats"],
			keepUnusedDataFor: 5,
		}),
		createGroupChat: builder.mutation({
			query: (data) => ({
				url: `${CHATS_URL}/group`,
				method: "POST",
				body: data,
			}),
		}),
		updateGroupName: builder.mutation({
			query: (data) => ({
				url: `${CHATS_URL}/group`,
				method: "PUT",
				body: data,
			}),
		}),
		addUserIntoGroup: builder.mutation({
			query: (data) => ({
				url: `${CHATS_URL}/groupadd`,
				method: "PUT",
				body: data,
			}),
		}),
		removeUserFromGroup: builder.mutation({
			query: (data) => ({
				url: `${CHATS_URL}/groupremove`,
				method: "PUT",
				body: data,
			}),
		}),
	}),
});

export const {
	useCreateChatMutation,
	useGetAllChatsQuery,
	useCreateGroupChatMutation,
	useUpdateGroupNameMutation,
	useAddUserIntoGroupMutation,
	useRemoveUserFromGroupMutation,
} = chatsApiSlice;
