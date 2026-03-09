export type MediaClubApiResponse<T> = {
    success: boolean,
    data: T | null,
    error?: {
        message: string,
        code: string,
    }
}

//////////////////////////////////////////////////////////////////

export type WatchStatus = "completed" | "watching";

export type MediaClubMedia = {
    id: number,
    date_started: string,
    date_finished: string,
    status: WatchStatus,
}

export type PaginatedMediaData = {
    items: MediaClubMedia[];
    total_count: number;
    page: number;
    per_page: number;
    total_pages: number;
};

export type MediaClubMediaResponse = MediaClubApiResponse<PaginatedMediaData>;

export type MediaClubUser = {
    user_id: number,
    created_at: string,
}

export type MediaClubUsersResponse = MediaClubApiResponse<Array<MediaClubUser>>;

//////////////////////////////////////////////////////////////////

export type AuthAnilistUserRequest = { code: string };

export type AuthAnilistUserResponse = MediaClubApiResponse<null>;

//////////////////////////////////////////////////////////////////

export type UserFavorites = {
    user_id: number,
    media_id: number,
    character_ids: number[],
}

export type UserFavoritesResponse = MediaClubApiResponse<UserFavorites>;

//////////////////////////////////////////////////////////////////