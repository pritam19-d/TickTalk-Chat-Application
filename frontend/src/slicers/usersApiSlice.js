import { USERS_URL, UPLOAD_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder)=>({
    login : builder.mutation({
      query : (data)=> ({
        url : `${USERS_URL}/login`,
        method: "POST",
        body: data
      }),
      keepUnusedDataFor: 5
    }),
    register : builder.mutation({
      query : (data)=> ({
        url : USERS_URL,
        method: "POST",
        body: data
      }),
      keepUnusedDataFor: 2
    }),
    uploadUserDp: builder.mutation({
      query: (data)=>({
        url: UPLOAD_URL,
        method: "POST",
        body: data
      })
    }),
    logout : builder.mutation({
      query : ()=>({
        url: `${USERS_URL}/logout`,
        method: "POST"
      })
    }),
    profile : builder.mutation({
      query : (data)=>({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data
      })
    }),
    getUsers : builder.query({
      query: ({ search })=>({
        url: `${USERS_URL}/?keyword=${search}`,
        method: "GET",
        params: {search}
      }),
      providesTags: ["Users"],
      keepUnusedDataFor: 5
    }),
    // deleteAnUser: builder.mutation({
    //   query: (userId)=>({
    //     url: `${USERS_URL}/${userId}`,
    //     method: "DELETE"
    //   })
    // }),
    // getUserDetail: builder.query({
    //   query: (userId)=>({
    //     url: `${USERS_URL}/${userId}`
    //   }),
    //   keepUnusedDataFor: 5
    // }),
    updateUser: builder.mutation({
      query: (data)=>({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["User"]
    })
  })
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUploadUserDpMutation, useProfileMutation, useGetUsersQuery, useGetUserDetailQuery, useUpdateUserMutation } = usersApiSlice