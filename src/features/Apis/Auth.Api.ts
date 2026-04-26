import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store'; 

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://unihavenbackend-cbg9b5gbdce6fug7.southafricanorth-01.azurewebsites.net/api/auth/',
    prepareHeaders: (headers, { getState }) => {
      // Pull token from the auth state to authorize the change-password request
      const token = (getState() as RootState).auth.token; 
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    
    // 🟢 1. Register User
    registerUser: builder.mutation({
      query: (userRegisterPayload) => ({
        url: 'register',
        method: 'POST',
        body: userRegisterPayload,
      }),
    }),

    // 📩 2. Resend Verification
    resendVerification: builder.mutation({
      query: (emailPayload) => ({
        url: 'resend-verification',
        method: 'POST',
        body: emailPayload,
      }),
    }),

    // ✅ 3. Verify Email (OTP)
    verifyEmail: builder.mutation({
      query: (verificationPayload) => ({
        url: 'verify-email',
        method: 'POST',
        body: verificationPayload,
      }),
    }),

    // 🔑 4. Login User
    loginUser: builder.mutation({
      query: (userLoginCredentials) => ({
        url: 'login',
        method: 'POST',
        body: userLoginCredentials,
      }),
    }),

    // ❓ 5. Forgot Password
    forgotPassword: builder.mutation({
      query: (emailPayload) => ({
        url: 'forgot-password',
        method: 'POST',
        body: emailPayload,
      }),
    }),

    // 🔄 6. Reset Password (Using Token)
    resetPassword: builder.mutation({
      query: (resetPayload) => ({
        url: 'reset-password',
        method: 'POST',
        body: resetPayload,
      }),
    }),

    // 🔒 7. Change Password (Authenticated Profile Action)
    // Payload should be: { currentPassword: '...', newPassword: '...' }
    changePassword: builder.mutation({
      query: (passwordPayload) => ({
        url: 'change-password',
        method: 'PATCH',
        body: passwordPayload,
      }),
      // Optional: invalidates any cached user data if needed
      invalidatesTags: ['Auth'],
    }),

  }),
});

export const {
  useRegisterUserMutation,
  useResendVerificationMutation,
  useVerifyEmailMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation, // <-- Export the new hook
} = authApi;