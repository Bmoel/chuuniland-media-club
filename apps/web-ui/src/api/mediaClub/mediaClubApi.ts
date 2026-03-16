import { baseApi } from "../baseApi";
import { MEDIA_CLUB_MEDIA_TAG, MEDIA_CLUB_USERS_TAG, MEDIA_CLUB_FAVORITES_TAG } from "./mediaClubApi.tags";
import type { MediaClubMediaResponse, AuthAnilistUserRequest, MediaClubUsersResponse, MediaClubUser, UserFavorites, UserFavoritesResponse } from "./mediaClubApi.types";

const BASE_URL = import.meta.env.VITE_MEDIA_CLUB_API_BASE_URL;

const mediaClubApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        mediaClubMediaInfo: build.query<MediaClubMediaResponse['data'], undefined>({
            query: () => ({
                url: `${BASE_URL}/media`,
                method: 'GET',
            }),
            providesTags: () => [MEDIA_CLUB_MEDIA_TAG],
            transformResponse: (response: MediaClubMediaResponse) => {
                return response.data ?? [];
            },
            transformErrorResponse: (response: {status: number, data: MediaClubMediaResponse}) => {
                const errorData = response.data;
                return errorData?.error?.message ?? "An unknown error occurred";
            }
        }),
        getUsers: build.query<MediaClubUser[], undefined>({
            query: () => ({
                url: `${BASE_URL}/users`,
                method: 'GET'
            }),
            providesTags: () => [MEDIA_CLUB_USERS_TAG],
            transformResponse: (response: MediaClubUsersResponse) => {
                return response.data ?? [];
            },
            transformErrorResponse: (response: {status: number, data: MediaClubUsersResponse}) => {
                const errorData = response.data;
                return errorData?.error?.message ?? "An unknown error occurred";
            }
        }),
        getUserFavorites: build.query<UserFavorites, { userId: number; mediaId: number }>({
            query: ({ userId, mediaId }) => ({
                url: `${BASE_URL}/users/${userId}/favorites/${mediaId}`,
                method: 'GET',
            }),
            providesTags: () => [MEDIA_CLUB_FAVORITES_TAG],
            transformResponse: (response: UserFavoritesResponse) => {
                return response.data ?? { user_id: 0, media_id: 0, character_ids: [] };
            },
        }),
        syncAnilistUser: build.mutation<boolean, AuthAnilistUserRequest>({
            query: ({ code }) => ({
                url: `${BASE_URL}/auth/sync`,
                method: 'POST',
                body: { code },
            }),
            invalidatesTags: () => [MEDIA_CLUB_USERS_TAG],
        }),
        removeAnilistUser: build.mutation<boolean, AuthAnilistUserRequest>({
            query: ({ code }) => ({
                url: `${BASE_URL}/auth/remove`,
                method: 'POST',
                body: { code },
            }),
            invalidatesTags: () => [MEDIA_CLUB_USERS_TAG],
        }),
        getAccessToken: build.query<string, unknown>({
            query: ({ code }) => ({
                url: `${BASE_URL}/auth/token`,
                method: 'POST',
                body: { code },
            })
        }),
    }),
});

export const {
    useMediaClubMediaInfoQuery,
    useGetUsersQuery,
    useGetUserFavoritesQuery,
    useSyncAnilistUserMutation,
    useRemoveAnilistUserMutation,
    useLazyGetAccessTokenQuery,
} = mediaClubApi;