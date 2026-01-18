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
  owner?: HostelOwner; // This matches your new backend structure
}

export const hostelApi = createApi({
  reducerPath: 'hostelApi',
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
  tagTypes: ['Hostel'],
  endpoints: (builder) => ({
    
    // 🌍 Get All Hostels
    getAllHostels: builder.query<Hostel[], any>({
      query: (params) => ({
        url: 'hostels',
        method: 'GET',
        params: params,
      }),
      providesTags: ['Hostel'],
    }),

    // 🔍 Get Single Hostel Details (Now with Owner)
    getHostelById: builder.query<Hostel, string>({
      query: (id) => `hostels/${id}`,
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