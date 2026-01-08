import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store'; 

// Define types for the Review data based on your response structure
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
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface HostelReviewsResponse {
  stats: ReviewStats;
  reviews: Review[];
}

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://unihaven-hostel-finder-backnd.onrender.com/reviews/',
    prepareHeaders: (headers, { getState }) => {
      // Pulling token from your AuthSlice
      const token = (getState() as RootState).auth.token; 
      if (token) {
        // Cleaning token of quotes if necessary and setting Bearer header
        const cleanToken = token.replace(/"/g, '');
        headers.set('authorization', `Bearer ${cleanToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    
    // 🌍 GET: List reviews and stats for a specific hostel (Public)
    // Matches: GET /api/reviews/hostel/:hostelId
    getHostelReviews: builder.query<HostelReviewsResponse, string>({
      query: (hostelId) => `hostel/${hostelId}`,
      providesTags: (result, error, hostelId) => [{ type: 'Review', id: hostelId }],
    }),

    // ✍️ POST: Create a new review (Student/Logged-in)
    // Matches: POST /api/reviews/
    createReview: builder.mutation<Review, Partial<Review>>({
      query: (newReview) => ({
        url: '',
        method: 'POST',
        body: newReview,
      }),
      // Invalidate the specific hostel tag to refresh the list
      invalidatesTags: (result, error, { hostelId }) => [
        { type: 'Review', id: hostelId }
      ],
    }),

    // ✏️ PATCH: Update own review (Student)
    // Matches: PATCH /api/reviews/:id
    updateReview: builder.mutation<Review, { id: string; title?: string; rating?: number; comment?: string }>({
      query: ({ id, ...patch }) => ({
        url: `${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Review'],
    }),

    // 💬 PATCH: Management reply to review (Owner/Caretaker)
    // Matches: PATCH /api/reviews/reply/:id
    replyToReview: builder.mutation<Review, { id: string; ownerReply: string }>({
      query: ({ id, ownerReply }) => ({
        url: `reply/${id}`,
        method: 'PATCH',
        body: { ownerReply },
      }),
      invalidatesTags: ['Review'],
    }),

    // 🗑️ DELETE: Remove a review (Student or Admin)
    // Matches: DELETE /api/reviews/:id
    deleteReview: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),

  }),
});

// ✅ Export hooks for components
export const {
  useGetHostelReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useReplyToReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;