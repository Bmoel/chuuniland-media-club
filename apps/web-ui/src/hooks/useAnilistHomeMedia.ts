import { useMemo } from "react";
import { useAnilistMediaInfoQuery } from "../api/anilist/anilistApi";
import { useMediaClubMediaInfoQuery } from "../api/mediaClub/mediaClubApi";
import type { Media } from "../types/media.types";
import { isRateLimitError, type AnilistRateLimitError } from "../api/anilist/anilistApi.types";

const PER_PAGE = 25;

function useAnilistHomeMedia(page = 1): {
    mediaList: Media[] | undefined;
    mediaListIsLoading: boolean;
    anilistRateLimitError: AnilistRateLimitError | null;
    refetchAnilist: () => void;
    totalPages: number;
    totalCount: number;
} {
    const {data: paginatedMedia, isLoading} = useMediaClubMediaInfoQuery({ page, perPage: PER_PAGE });

    const {data: anilistMediaInfo, error: anilistError, refetch: refetchAnilist} = useAnilistMediaInfoQuery(
        {
            idIn: paginatedMedia?.items.map(mediaEntry => mediaEntry.id.toString()) ?? [],
            sort: 'TITLE_ENGLISH',
            perPage: PER_PAGE,
        },
        {
            skip: !paginatedMedia
        }
    );

    const anilistRateLimitError: AnilistRateLimitError | null =
        isRateLimitError(anilistError) ? anilistError : null;

    const mediaClubMediaMap = useMemo(() => {
        if (!paginatedMedia) return undefined;
        return new Map(paginatedMedia.items.map(m => [m.id, m]));
    }, [paginatedMedia]);

    const mediaList = useMemo(() => {
        if (!anilistMediaInfo || !mediaClubMediaMap) return undefined;
        return anilistMediaInfo.map(info => {
            const mediaClubInfoObj = mediaClubMediaMap.get(info.id);
            const mClubStartDate = mediaClubInfoObj?.date_started;
            const mClubEndDate = mediaClubInfoObj?.date_finished;
            return {
                ...info,
                media_club_date_started: (typeof mClubStartDate === 'string' && mClubStartDate !== '') ? new Date(mClubStartDate) : undefined,
                media_club_date_finished: (typeof mClubEndDate === 'string' && mClubEndDate !== '') ? new Date(mClubEndDate) : undefined,
                media_club_status: mediaClubInfoObj?.status ?? 'completed',
            };
        });
    }, [anilistMediaInfo, mediaClubMediaMap]);

    return {
        mediaList,
        mediaListIsLoading: isLoading,
        anilistRateLimitError,
        refetchAnilist,
        totalPages: paginatedMedia?.total_pages ?? 1,
        totalCount: paginatedMedia?.total_count ?? 0,
    };
}

export default useAnilistHomeMedia;
