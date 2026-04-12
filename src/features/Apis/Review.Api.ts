import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store'; 

// --- INTERFACES ---
export interface Review {
  id: string;
  userId: string;
  hostelId: string;
  title: string | null;
  rating: number;
  comment: string;
  ownerReply: string | null;
  repliedAt: string | null;
  isVerified: boolean;
  helpfulCount: number;
  isFlagged: boolean;      
  reportReason: string | null; 
  createdAt: string;
  updatedAt: string;
}

/**
 * Enhanced Stats Interface 
 * Now includes peakHour for the activity clock on the dashboard
 */
export interface ReviewStats {
  totalReviews: number;
  totalHelpful: number;
  reportedCount: number;
  peakHour: number | null; 
}

export interface HostelReviewsResponse {
  stats: {
    totalReviews: number;
    averageRating?: number;
  };
  distribution?: { rating: number; count: number }[]; 
  reviews: Review[];
}

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/reviews',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth?.token; 

      if (token) {
        // Cleaning potential JSON stringification quotes from localStorage
        const cleanToken = token.toString().trim().replace(/^"|"$/g, '');
        headers.set('authorization', `Bearer ${cleanToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    
    // 🌍 GET: Fetch All Reviews (Admin/Moderator View)
    getAllReviews: builder.query<HostelReviewsResponse, void>({
      query: () => '/all',
      providesTags: (result) => 
        result 
          ? [
              ...result.reviews.map(({ id }) => ({ type: 'Review' as const, id })), 
              { type: 'Review', id: 'LIST' }
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),

    // 👤 GET: Fetch Personal Reviews (The "My Reviews" Vault)
    getMyReviews: builder.query<HostelReviewsResponse, void>({
      query: () => '/me',
      providesTags: (result) => 
        result 
          ? [
              ...result.reviews.map(({ id }) => ({ type: 'Review' as const, id })), 
              { type: 'Review', id: 'PERSONAL_LIST' }
            ]
          : [{ type: 'Review', id: 'PERSONAL_LIST' }],
    }),

    // 📊 GET: User Review Stats (For the Analytics Hub)
    // Synchronized with the updated controller that returns peakHour
    getUserReviewStats: builder.query<{ message: string; stats: ReviewStats }, void>({
      query: () => '/stats/me',
      providesTags: ['Review'], // Will refetch when any review mutation occurs
    }),

    // 🏠 GET: Reviews for a specific hostel
    getHostelReviews: builder.query<HostelReviewsResponse, string>({
      query: (hostelId) => `/hostel/${hostelId}`,
      providesTags: (result, error, hostelId) => [{ type: 'Review', id: hostelId }],
    }),

    // ✍️ POST: Create a Review
    createReview: builder.mutation<Review, Partial<Review>>({
      query: (newReview) => ({
        url: '/',
        method: 'POST',
        body: newReview,
      }),
      invalidatesTags: [
        { type: 'Review', id: 'LIST' },
        { type: 'Review', id: 'PERSONAL_LIST' }
      ],
    }),

    // ✏️ PATCH: Update Own Review
    updateReview: builder.mutation<Review, { id: string; title?: string; rating?: number; comment?: string }>({
      query: ({ id, ...patch }) => ({
        url: `/${id}`, 
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Review', id }, 
        { type: 'Review', id: 'LIST' },
        { type: 'Review', id: 'PERSONAL_LIST' }
      ],
    }),

    // 👍 PATCH: Mark Helpful (Like)
    markHelpful: builder.mutation<Review, string>({
      query: (id) => ({
        url: `/${id}/helpful`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Review', id },
        { type: 'Review', id: 'PERSONAL_LIST' } // Force refresh to update totalHelpful count
      ],
    }),

    // 💬 PATCH: Management Reply
    replyToReview: builder.mutation<Review, { id: string; ownerReply: string }>({
      query: ({ id, ownerReply }) => ({
        url: `/reply/${id}`,
        method: 'PATCH',
        body: { ownerReply },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Review', id }, 
        { type: 'Review', id: 'LIST' },
        { type: 'Review', id: 'PERSONAL_LIST' }
      ],
    }),

    // 🚩 POST: Report Review
    reportReview: builder.mutation<Review, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/${id}/report`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Review', id },
        { type: 'Review', id: 'LIST' }
      ],
    }),

    // 🗑️ DELETE: Remove Review
    deleteReview: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Review', id: 'LIST' },
        { type: 'Review', id: 'PERSONAL_LIST' }
      ],
    }),

  }),
});

export const {
  useGetAllReviewsQuery,
  useGetMyReviewsQuery,
  useGetUserReviewStatsQuery, 
  useGetHostelReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useMarkHelpfulMutation,
  useReplyToReviewMutation,
  useReportReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;