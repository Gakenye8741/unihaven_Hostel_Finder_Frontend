import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export const authApi = createApi({
  reducerPath: 'authApi',
  // Base URL pointing to your Express Auth Router
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/auth/` }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    
    // 🟢 1. Register User
    registerUser: builder.mutation({
      query: (userRegisterPayload) => ({
        url: 'register',
        method: 'POST',
        body: userRegisterPayload, // { username, fullName, email, passwordHash }
      }),
    }),

    // 📩 Resend Verification (This one works for you)
resendVerification: builder.mutation({
  query: (emailPayload) => ({
    url: 'resend-verification',
    method: 'POST',
    body: emailPayload, // emailPayload is { email: "..." }
  }),
}),



    // ✅ 3. Verify Email (OTP)
    verifyEmail: builder.mutation({
      query: (verificationPayload) => ({
        url: 'verify-email',
        method: 'POST',
        body: verificationPayload, // { email, confirmationCode }
      }),
    }),

    // 🔑 4. Login User
    loginUser: builder.mutation({
      query: (userLoginCredentials) => ({
        url: 'login',
        method: 'POST',
        body: userLoginCredentials, // { email, passwordHash }
      }),
    }),

    // ❓ 5. Forgot Password (Request Reset Link)
  
      forgotPassword: builder.mutation({
        query: (emailPayload) => ({
          url: 'forgot-password',
          method: 'POST',
          body: emailPayload, // Ensure this is also passing { email: "..." }
        }),
      }),

    // 🔄 6. Reset Password (Using Token)
    resetPassword: builder.mutation({
      query: (resetPayload) => ({
        url: 'reset-password',
        method: 'POST',
        body: resetPayload, // { token, newPassword }
      }),
    }),

  }),
});

// ✅ Export auto-generated hooks for use in your components
export const {
  useRegisterUserMutation,
  useResendVerificationMutation,
  useVerifyEmailMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
