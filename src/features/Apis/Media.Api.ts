import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store'; 

export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      // Accessing the token from your AuthSlice
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Media'],
  endpoints: (builder) => ({
    
    // 🌍 Get Hostel Gallery (Public)
    // Returns all images/videos for a specific hostel
    getHostelGallery: builder.query({
      query: (hostelId) => `media/${hostelId}`,
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }: any) => ({ type: 'Media' as const, id })), 'Media']
          : ['Media'],
    }),

    // 🏗️ Bulk Upload Media (Protected)
    // Scenario: Adding multiple photos and videos at once
    uploadMedia: builder.mutation({
      query: (payload) => ({
        url: 'media',
        method: 'POST',
        body: payload, // { hostelId: "...", mediaItems: [...] }
      }),
      invalidatesTags: ['Media'],
    }),

    // ✏️ Update Media (Protected)
    // Scenario: Swap Thumbnail (Cover Photo) or Replace URL
    updateMedia: builder.mutation({
      query: ({ mediaId, ...patch }) => ({
        url: `media/${mediaId}`,
        method: 'PATCH',
        body: patch, // { hostelId: "...", isThumbnail: true, url: "..." }
      }),
      invalidatesTags: (result, error, { mediaId }) => [
        { type: 'Media', id: mediaId },
        'Media'
      ],
    }),

    // 🗑️ Delete Media Item (Protected)
    deleteMedia: builder.mutation({
      query: ({ hostelId, mediaId }) => ({
        url: `media/${hostelId}/${mediaId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Media'],
    }),

  }),
});

// ✅ Export hooks for use in components
export const {
  useGetHostelGalleryQuery,
  useUploadMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;