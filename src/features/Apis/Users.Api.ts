import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store'; 

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://unihavenbackend-cbg9b5gbdce6fug7.southafricanorth-01.azurewebsites.net/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token; 
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  
  tagTypes: ['User', 'Staff', 'AdminQueue', 'Stats'],
  endpoints: (builder) => ({
    
    // ==========================================
    // 1. SELF-SERVICE ENDPOINTS
    // ==========================================

    getUserProfile: builder.query({
      query: (id) => `users/profile/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

   updateMyProfile: builder.mutation({
      query: (updateBody) => ({
        url: 'users/update-me',
        method: 'PATCH',
        body: updateBody,
      }),
      // This ensures the table refreshes after the update
      invalidatesTags: (result, error) => [{ type: 'User', id: 'LIST' }, 'User'],
    }),

    submitIdentityDocs: builder.mutation({
      query: (docs) => ({
        url: 'users/submit-id',
        method: 'POST',
        body: docs,
      }),
      invalidatesTags: ['AdminQueue'],
    }),

    // ==========================================
    // 2. MANAGEMENT ENDPOINTS (Owners)
    // ==========================================

    claimCaretaker: builder.mutation({
      query: (emailData) => ({
        url: 'users/claim-staff',
        method: 'POST',
        body: emailData,
      }),
      invalidatesTags: ['Staff'],
    }),

    getMyStaff: builder.query({
      query: () => 'users/my-staff',
      providesTags: ['Staff'],
    }),

    // ==========================================
    // 3. ADMIN ENDPOINTS (Super-Admins)
    // ==========================================

    /**
     * Admin Update Specific User Details
     */
   adminUpdateUser: builder.mutation({
  query: ({ id, ...updateBody }) => ({
    url: `users/admin/update-user/${id}`, // <--- This targets the specific user
    method: 'PATCH',
    body: updateBody,
  }),
  invalidatesTags: (result, error, { id }) => [
    { type: 'User', id }, 
    { type: 'User', id: 'LIST' }
  ],
}),

    /**
     * Admin Delete User
     */
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/admin/delete/${id}`,
        method: 'DELETE',
      }),
      // FIX: Ensure list is cleared on delete
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        'Stats', 
        'AdminQueue', 
        'Staff'
      ],
    }),

    getPendingVerifications: builder.query({
      query: () => 'users/admin/pending',
      providesTags: ['AdminQueue'],
    }),

    verifyUserIdentity: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `users/admin/verify-user/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id }, 
        { type: 'User', id: 'LIST' },
        'AdminQueue', 
        'Stats'
      ],
    }),

    /**
     * Admin Update Account Status (Ban/Suspend/Activate)
     */
    updateAccountStatus: builder.mutation({
      query: ({ userId, status }) => ({
        // Added 'users/' prefix and ensure userId is used
        url: `users/admin/account-status/${userId}`, 
        method: 'PATCH',
        body: { status },
      }),
      // Changed 'Users' tag to 'User' to match your tagTypes definition
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId }, 
        { type: 'User', id: 'LIST' }
      ],
    }),

    getAllUsers: builder.query({
      query: () => 'users/admin/all-users',
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }: any) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' }
            ] 
          : [{ type: 'User', id: 'LIST' }],
    }),

    getSystemUserStats: builder.query({
      query: () => 'users/admin/stats',
      providesTags: ['Stats'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateMyProfileMutation,
  useSubmitIdentityDocsMutation,
  useClaimCaretakerMutation,
  useGetMyStaffQuery,
  useGetPendingVerificationsQuery,
  useVerifyUserIdentityMutation,
  useUpdateAccountStatusMutation,
  useGetAllUsersQuery,
  useGetSystemUserStatsQuery,
  useAdminUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
