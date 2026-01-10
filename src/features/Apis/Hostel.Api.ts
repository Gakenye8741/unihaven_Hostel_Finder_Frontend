import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store'; 
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const hostelApi = createApi({
  reducerPath: 'hostelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/`,
    // This prepareHeaders function automatically injects the token for PROTECTED routes
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token; // Adjust based on your AuthSlice
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Hostel'],
  endpoints: (builder) => ({
    
    // 🌍 Get All Hostels (Supports Search/Filters)
    // Usage: useGetAllHostelsQuery({ campus: 'Main', policy: 'Mixed' })
    getAllHostels: builder.query({
      query: (params) => ({
        url: 'hostels',
        method: 'GET',
        params: params, // Automatically turns {campus: 'Main'} into ?campus=Main
      }),
      providesTags: ['Hostel'],
    }),

    // 🔍 Get Single Hostel Details
    getHostelById: builder.query({
      query: (id) => `hostels/${id}`,
      providesTags: (result, error, id) => [{ type: 'Hostel', id }],
    }),

    // 🏗️ Create a New Hostel (Protected)
    createHostel: builder.mutation({
      query: (newHostel) => ({
        url: 'hostels',
        method: 'POST',
        body: newHostel,
      }),
      invalidatesTags: ['Hostel'], // Refreshes the list after creating
    }),

    // ✏️ Update Hostel Details (Protected)
    updateHostel: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `hostels/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Hostel', id },
        'Hostel'
      ],
    }),

    // 🗑️ Delete Hostel (Optional but useful)
    deleteHostel: builder.mutation({
      query: (id) => ({
        url: `hostels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hostel'],
    }),

  }),
});

// ✅ Export hooks for components
export const {
  useGetAllHostelsQuery,
  useGetHostelByIdQuery,
  useCreateHostelMutation,
  useUpdateHostelMutation,
  useDeleteHostelMutation,
} = hostelApi;
