import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store'; 

// TypeScript interfaces for the Wishlist and Nested Hostel data
export interface WishlistItem {
  userId: string;
  hostelId: string;
  createdAt: string;
  hostel: {
    id: string;
    name: string;
    description: string;
    price: string;
    media: { url: string; type: string }[];
    communityTags: { tagName: string; count: number }[];
    amenities: { amenity: { name: string; icon?: string } }[];
    owner: { id: string };
  };
}

export interface WishlistStats {
  totalSaved: number;
  latestSave: string;
}

export const wishlistApi = createApi({
  reducerPath: 'wishlistApi',
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
  tagTypes: ['Wishlist', 'Popularity'],
  endpoints: (builder) => ({
    
    // ❤️ 1. Add to Wishlist (Save)
    addToWishlist: builder.mutation<void, { hostelId: string }>({
      query: (body) => ({
        url: 'wishlist',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wishlist', 'Popularity'],
    }),

    // 📋 2. List Student Wishlist (Detailed)
    listStudentWishlist: builder.query<WishlistItem[], void>({
      query: () => 'wishlist',
      providesTags: (result) =>
        result
          ? [...result.map(({ hostelId }) => ({ type: 'Wishlist' as const, id: hostelId })), { type: 'Wishlist', id: 'LIST' }]
          : [{ type: 'Wishlist', id: 'LIST' }],
    }),

    // 🔍 3. Check Favorite Status
    checkFavoriteStatus: builder.query<{ isFavorited: boolean }, string>({
      query: (hostelId) => `wishlist/status/${hostelId}`,
      providesTags: (result, error, hostelId) => [{ type: 'Wishlist', id: hostelId }],
    }),

    // 📊 4. Get Wishlist Stats
    getWishlistStats: builder.query<WishlistStats, void>({
      query: () => 'wishlist/stats',
      providesTags: ['Wishlist'],
    }),

    // 📈 5. Get Hostel Popularity (Social Proof)
    getHostelPopularity: builder.query<{ savedCount: number }, string>({
      query: (hostelId) => `wishlist/popularity/${hostelId}`,
      providesTags: (result, error, hostelId) => [{ type: 'Popularity', id: hostelId }],
    }),

    // 🗑️ 6. Remove from Wishlist (Unsave)
    removeFromWishlist: builder.mutation<void, string>({
      query: (hostelId) => ({
        url: `wishlist/${hostelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, hostelId) => [
        { type: 'Wishlist', id: hostelId },
        { type: 'Wishlist', id: 'LIST' },
        'Popularity'
      ],
    }),

    // 🧹 7. Clear All Wishlist
    clearWishlist: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: 'wishlist',
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),

  }),
});

// ✅ Export hooks for use in Student Dashboard and Hostel Cards
export const {
  useAddToWishlistMutation,
  useListStudentWishlistQuery,
  useCheckFavoriteStatusQuery,
  useGetWishlistStatsQuery,
  useGetHostelPopularityQuery,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;