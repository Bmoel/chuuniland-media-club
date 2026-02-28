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
    AnilistRateLimitError,
} from "./anilistApi.types";
import { MediaInfoQuery, MediaListWithUsersQuery, CharactersQuery } from "./anilistApi.queries";

const BASE_URL: string = 'https://graphql.anilist.co';

function parseRateLimitError(
    response: { status: number | string },
    meta: { response?: Response } | undefined,
): AnilistRateLimitError | null {
    // AniList's 429 response lacks CORS headers, so browsers block it entirely
    // and RTK Query reports it as FETCH_ERROR instead of status 429.
    if (response.status !== 429 && response.status !== 'FETCH_ERROR') return null;
    const retryAfter = meta?.response?.headers.get('Retry-After');
    const resetAt = meta?.response?.headers.get('X-RateLimit-Reset');
    let retryAfterSeconds = 60;
    if (retryAfter && !isNaN(Number(retryAfter))) {
        retryAfterSeconds = Number(retryAfter);
    } else if (resetAt && !isNaN(Number(resetAt))) {
        retryAfterSeconds = Math.max(0, Number(resetAt) - Math.floor(Date.now() / 1000));
    }
    return { isRateLimited: true, retryAfterSeconds };
}

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
            transformErrorResponse: parseRateLimitError,
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
            transformErrorResponse: parseRateLimitError,
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
            transformErrorResponse: parseRateLimitError,
            providesTags: [ANILIST_CHARACTERS_TAG],
        }),
    })
});

export const {
    useAnilistMediaInfoQuery,
    useAnilistUsersMediaInfoQuery,
    useAnilistCharactersQuery,
} = anilistApi;
