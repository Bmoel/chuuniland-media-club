import type { IGraphQLResponseError } from "../../types/graphql.types";

export type AnilistResponse<T> = {
    data: T,
    errors: Array<IGraphQLResponseError>;
}

//////////////////////////////////////////////////////////////////

export type AnilistDate = {
    month?: number,
    year?: number,
    day?: number,
}

export type AnilistMediaType = "ANIME" | "MANGA";

export type AnilistMediaInfo = {
    id: number;
    title: {
        english?: string,
        native?: string,
        romaji?: string,
        userPreferred?: string,
    };
    coverImage: {
        extraLarge?: string;
    };
    bannerImage?: string;
    averageScore?: number;
    siteUrl?: string;
    studios: {
        nodes?: {name: string}[];
    };
    startDate: AnilistDate;
    type: AnilistMediaType;
};

export type AnilistMediaInfoResponseData = {
    Page: {
        media: AnilistMediaInfo[]
    }
}

export type AnilistMediaInfoRequest = {
    idIn: string[];
    sort: string;
}

export type AnilistMediaInfoResponse = AnilistResponse<AnilistMediaInfoResponseData>;

//////////////////////////////////////////////////////////////////

export type MediaAnilistUser = {
    score?: number;
    notes?: string;
    user: {
        avatar: {
            medium?: string;
        };
        name?: string;
        siteUrl?: string;
        id: number;
    }
}

export type AnilistUsersInfoResponseData = {
    Page: {
        mediaList: Record<string, MediaAnilistUser>
    }
}

export type AnilistUserInfoRequest = {
    idIn: number[];
    mediaId: number;
    format: "POINT_100"
}

export type AnilistUserInfoResponse = AnilistResponse<AnilistUsersInfoResponseData>;

//////////////////////////////////////////////////////////////////

export type AnilistCharacterInfo = {
    id: number;
    favourites: number;
    image: {
        medium?: string;
    };
    name: {
        userPreferred?: string;
    };
};

export type AnilistCharactersRequest = {
    idIn: number[];
};

export type AnilistCharactersResponseData = {
    Page: {
        characters: AnilistCharacterInfo[];
    };
};

export type AnilistCharactersResponse = AnilistResponse<AnilistCharactersResponseData>;

//////////////////////////////////////////////////////////////////