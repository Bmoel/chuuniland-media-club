import type { IGraphQLResponseError } from "../../types/graphql.types";

export type ANILIST_REQUEST = {
    query: string;
    variables: {[key: string]: unknown};
}

export type ANILIST_RESPONSE<T> = {
    data: T;
    errors: Array<IGraphQLResponseError>;
}

export type MEDIA_INFO_RESPONSE = ANILIST_RESPONSE<{
    title: {
        english: string,
        native: string,
        romaji: string,
        userPreferred: string,
    };
    bannerImage: string;
}>