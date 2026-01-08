import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "../features/Auth/Auth.slice";

// Import your Auth API
import { authApi } from "../features/Apis/Auth.Api"; 

import { hostelApi } from "../features/Apis/Hostel.Api";
import { roomApi } from "../features/Apis/Rooms.Api";
import { mediaApi } from "../features/Apis/Media.Api";
import { amenityApi } from "../features/Apis/Amenities.Api";
import { reviewApi } from "../features/Apis/Review.Api";
import { usersApi } from "../features/Apis/Users.Api";

const authPersistConfiguration = {
    key: 'auth',
    storage,
    whitelist: ['user', 'token', 'isAuthenticated', 'role']
};

const persistedAuthReducer = persistReducer(authPersistConfiguration, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        // Add authApi here
        [authApi.reducerPath]: authApi.reducer, 
        
        [hostelApi.reducerPath]: hostelApi.reducer,
        [roomApi.reducerPath]: roomApi.reducer,
        [mediaApi.reducerPath] : mediaApi.reducer,
        [amenityApi.reducerPath]: amenityApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(
            // Add authApi.middleware here
            authApi.middleware, 
            
            hostelApi.middleware,
            roomApi.middleware,
            mediaApi.middleware,
            amenityApi.middleware,
            reviewApi.middleware,
            usersApi.middleware,
        )
});

export const persister = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;