import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store'; 

export interface Room {
  amenities: never[];
  id: string;
  hostelId: string;
  label: string;
  floor?: string | null;
  block?: string | null;
  type: 'Single' | 'Bedsitter' | 'One Bedroom' | 'Two Bedroom';
  price: string;
  billingCycle: 'Per Month' | 'Per Semester';
  totalSlots: number;
  occupiedSlots: number;
  status: 'Available' | 'Full' | 'Maintenance';
  createdAt?: string;
}

export const roomApi = createApi({
  reducerPath: 'roomApi',
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
  tagTypes: ['Rooms', 'Stats'],
  endpoints: (builder) => ({
    createRoom: builder.mutation<Room, Partial<Room>>({
      query: (newRoom) => ({
        url: 'rooms',
        method: 'POST',
        body: newRoom,
      }),
      invalidatesTags: ['Rooms', 'Stats'],
    }),
    listRoomsByHostel: builder.query<Room[], string>({
      query: (hostelId) => `rooms/list/${hostelId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Rooms' as const, id })), { type: 'Rooms', id: 'LIST' }]
          : [{ type: 'Rooms', id: 'LIST' }],
    }),
    updateRoom: builder.mutation<Room, { hostelId: string; roomId: string; body: Partial<Room> }>({
      query: ({ hostelId, roomId, body }) => ({
        url: `rooms/update/${hostelId}/${roomId}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: (result, error, { roomId }) => [{ type: 'Rooms', id: roomId }, 'Rooms'],
    }),
    updateRoomStatus: builder.mutation<Room, { roomId: string; status: string }>({
      query: ({ roomId, status }) => ({
        url: `rooms/status/${roomId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { roomId }) => [{ type: 'Rooms', id: roomId }, 'Stats'],
    }),
    getHostelStats: builder.query<{ totalRooms: number; occupied: number; available: number }, string>({
      query: (hostelId) => `rooms/stats/${hostelId}`,
      providesTags: ['Stats'],
    }),
    deleteRoom: builder.mutation<{ success: boolean }, { hostelId: string; roomId: string }>({
      query: ({ hostelId, roomId }) => ({
        url: `rooms/delete/${hostelId}/${roomId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rooms', 'Stats'],
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useListRoomsByHostelQuery,
  useUpdateRoomMutation,
  useUpdateRoomStatusMutation,
  useGetHostelStatsQuery,
  useDeleteRoomMutation,
} = roomApi;