import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store'; 

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export interface Amenity {
  id: string;
  name: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SyncAmenitiesRequest {
  hostelId: string;
  amenityIds: string[];
}

export const amenityApi = createApi({
  reducerPath: 'amenityApi',
  baseQuery: fetchBaseQuery({

    
    baseUrl: 'https://unihavenbackend-cbg9b5gbdce6fug7.southafricanorth-01.azurewebsites.net/api/amenities/',
    // Matches your HostelApi pattern using RootState
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token; 

      if (token) {
        // We strip extra quotes if the token was stored as a stringified JSON
        const cleanToken = token.replace(/"/g, '');
        headers.set('authorization', `Bearer ${cleanToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Amenity', 'HostelAmenity'],
  endpoints: (builder) => ({
    
    // 🌍 Get All Global Amenities (Catalog)
    getAllGlobalAmenities: builder.query<Amenity[], void>({
      query: () => 'AllAmenities',
      providesTags: ['Amenity'],
    }),

    // 🔍 Get Amenities for a Specific Hostel
    listAmenitiesByHostel: builder.query<Amenity[], string>({
      query: (hostelId) => `HostelAmenities/${hostelId}`,
      providesTags: (result, error, hostelId) => [{ type: 'HostelAmenity', id: hostelId }],
    }),

    // 🏗️ Create Global Amenity (Admin Only)
    createAmenity: builder.mutation<Amenity, Partial<Amenity>>({
      query: (body) => ({
        url: 'CreateAmenity',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Amenity'],
    }),

    // ✏️ Update Global Amenity (Admin Only)
    updateAmenity: builder.mutation<Amenity, { id: string; body: Partial<Amenity> }>({
      query: ({ id, body }) => ({
        url: `UpdateAmenity/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Amenity', id },
        'Amenity',
        'HostelAmenity'
      ],
    }),

    // 🗑️ Delete Global Amenity (Admin Only)
    deleteAmenity: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `DeleteAmenity/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Amenity', 'HostelAmenity'],
    }),

    // 🔄 Bulk Sync Hostel Amenities (Management)
    syncHostelAmenities: builder.mutation<void, SyncAmenitiesRequest>({
      query: ({ hostelId, amenityIds }) => ({
        url: `SyncHostelAmenities/${hostelId}`,
        method: 'PUT',
        body: { amenityIds },
      }),
      invalidatesTags: (result, error, { hostelId }) => [
        { type: 'HostelAmenity', id: hostelId }
      ],
    }),

    // 🔗 Link a Single Amenity (Optional Single Add)
    addHostelAmenity: builder.mutation<void, { hostelId: string; amenityId: string }>({
      query: ({ hostelId, amenityId }) => ({
        url: `AddHostelAmenity/${hostelId}/${amenityId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { hostelId }) => [
        { type: 'HostelAmenity', id: hostelId }
      ],
    }),

    // 🔓 Unlink a Single Amenity (Optional Single Remove)
    removeHostelAmenity: builder.mutation<void, { hostelId: string; amenityId: string }>({
      query: ({ hostelId, amenityId }) => ({
        url: `RemoveHostelAmenity/${hostelId}/${amenityId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { hostelId }) => [
        { type: 'HostelAmenity', id: hostelId }
      ],
    }),
  }),
});

export const {
  useGetAllGlobalAmenitiesQuery,
  useListAmenitiesByHostelQuery,
  useCreateAmenityMutation,
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
  useSyncHostelAmenitiesMutation,
  useAddHostelAmenityMutation,
  useRemoveHostelAmenityMutation,
} = amenityApi;
