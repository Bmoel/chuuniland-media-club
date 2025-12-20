import type { IGraphQLResponseError } from "../../types/graphql.types";

export type ANILIST_RESPONSE<T> = {
    data: {
        Page: {
            media: T[]
        }
    };
    errors: Array<IGraphQLResponseError>;
}

export type MEDIA_INFO_REQUEST = {
    idIn: number|string[];
    sort: string;
}

export type MEDIA_INFO = {
    id: number;
    idMal: number;
    title: {
        english: string,
        native: string,
    };
    coverImage: {
        extraLarge: string;
    };
    bannerImage: string;
    averageScore: number;
    siteUrl: string;
    studios: {
        nodes: {name: string}[];
    };
    startDate: {
        month: number,
        year: number,
    };
};

export type MEDIA_INFO_RESPONSE = ANILIST_RESPONSE<MEDIA_INFO>;