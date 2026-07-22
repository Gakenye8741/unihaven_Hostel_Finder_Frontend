import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store'; 

// --- TYPES FOR TYPE SAFETY ---
export interface HostelOwner {
  id: string;
  fullName: string;
  phone: string | null;
  whatsappPhone: string | null;
  email: string;
}

export interface Hostel {
  id: string;
  ownerId: string;
  name: string;
  campus: string;
  address: string;
  description: string;
  policy: "Mixed" | "Male Only" | "Female Only";
  isVerified: boolean;
  createdAt: string;
  owner?: HostelOwner; 
}

export const hostelApi = createApi({
  reducerPath: 'hostelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://unihaven-hostel-finder-backnd-1.onrender.com/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token; 
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Keep the cache for only 60 seconds to prevent "stale" data during development
  keepUnusedDataFor: 60,
  tagTypes: ['Hostel'],
  endpoints: (builder) => ({
    
    // 🌍 Get All Hostels
    getAllHostels: builder.query<Hostel[], any>({
      query: (params) => ({
        url: 'hostels',
        method: 'GET',
        params: params,
      }),
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }) => ({ type: 'Hostel' as const, id })), 'Hostel']
          : ['Hostel'],
    }),

    // 🔍 Get Single Hostel Details
    getHostelById: builder.query<Hostel, string>({
      query: (id) => `hostels/${id}`,
      // 1. IMPROVED TRANSFORM: 
      // This ensures we always get the raw hostel object even if wrapped in 'data'
      transformResponse: (response: any) => {
        const data = response?.data || response;
        console.log("RTK Query Transformed Data:", data); // Check your console!
        return data;
      },
      // 2. CACHE VALIDATION:
      providesTags: (result, error, id) => [{ type: 'Hostel', id }],
    }),

    // 🏗️ Create a New Hostel
    createHostel: builder.mutation<Hostel, Partial<Hostel>>({
      query: (newHostel) => ({
        url: 'hostels',
        method: 'POST',
        body: newHostel,
      }),
      invalidatesTags: ['Hostel'],
    }),

    // ✏️ Update Hostel Details
    updateHostel: builder.mutation<Hostel, { id: string } & Partial<Hostel>>({
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

    // 🗑️ Delete Hostel
    deleteHostel: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `hostels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hostel'],
    }),
  }),
});

export const {
  useGetAllHostelsQuery,
  useGetHostelByIdQuery,
  useCreateHostelMutation,
  useUpdateHostelMutation,
  useDeleteHostelMutation,
} = hostelApi;