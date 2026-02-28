import { baseApi } from "../baseApi";
import { ANILIST_MEDIA_INFO_TAG, ANILIST_USERS_INFO_TAG, ANILIST_CHARACTERS_TAG } from "./anilistApi.tags";
import type {
    AnilistUserInfoRequest,
    AnilistUserInfoResponse,
    AnilistMediaInfo,
    AnilistMediaInfoRequest,
    AnilistMediaInfoResponse,
    MediaAnilistUser,
    AnilistCharacterInfo,
    AnilistCharactersRequest,
    AnilistCharactersResponse,
} from "./anilistApi.types";
import { MediaInfoQuery, MediaListWithUsersQuery, CharactersQuery } from "./anilistApi.queries";

const BASE_URL: string = 'https://graphql.anilist.co';

const anilistApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        anilistMediaInfo: build.query<AnilistMediaInfo[], AnilistMediaInfoRequest>({
            query: (vars) => ({
                url: BASE_URL,
                body: {
                    query: MediaInfoQuery,
                    variables: vars,
                },
                method: 'POST',
            }),
            transformResponse: (response: AnilistMediaInfoResponse) => {
                return response.data.Page.media ?? [];
            },
            transformErrorResponse: (response: {status: number, data: AnilistMediaInfoResponse}) => {
                return response.data.errors;
            },
            providesTags: () => [ANILIST_MEDIA_INFO_TAG],
        }),
        anilistUsersMediaInfo: build.query<MediaAnilistUser[], AnilistUserInfoRequest>({
            query: (vars) => ({
                url: BASE_URL,
                body: {
                    query: MediaListWithUsersQuery,
                    variables: vars,
                },
                method: 'POST',
            }),
            transformResponse: (response: AnilistUserInfoResponse) => {
                return Object.values(response.data.Page.mediaList);
            },
            transformErrorResponse: (response: {status: number, data: AnilistMediaInfoResponse}) => {
                return response.data.errors;
            },
            providesTags: [ANILIST_USERS_INFO_TAG],
        }),
        anilistCharacters: build.query<AnilistCharacterInfo[], AnilistCharactersRequest>({
            query: (vars) => ({
                url: BASE_URL,
                body: {
                    query: CharactersQuery,
                    variables: vars,
                },
                method: 'POST',
            }),
            transformResponse: (response: AnilistCharactersResponse) => {
                return response.data.Page.characters ?? [];
            },
            providesTags: [ANILIST_CHARACTERS_TAG],
        }),
    })
});

export const {
    useAnilistMediaInfoQuery,
    useAnilistUsersMediaInfoQuery,
    useAnilistCharactersQuery,
} = anilistApi;