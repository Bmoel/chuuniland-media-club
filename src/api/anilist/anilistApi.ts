import { baseApi } from "../BaseApi";
import { MEDIA_INFO_TAG } from "./anilistApi.tags";
import type { ANILIST_REQUEST, MEDIA_INFO_RESPONSE } from "./anilistApi.types";

const BASE_URL: string = 'https://graphql.anilist.co';

const anilistApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        mediaInfo: build.query<MEDIA_INFO_RESPONSE, ANILIST_REQUEST>({
            query: (body) => ({
                url: BASE_URL,
                body: JSON.stringify(body),
                method: 'POST',
            }),
            providesTags: () => [MEDIA_INFO_TAG],
        }),
    })
});

export const {useMediaInfoQuery} = anilistApi;