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
    const {data: allMediaClubMedia, isLoading} = useMediaClubMediaInfoQuery(undefined);

    const pageIds = useMemo(() => {
        if (!allMediaClubMedia) return undefined;
        const start = (page - 1) * PER_PAGE;
        return allMediaClubMedia.slice(start, start + PER_PAGE).map(m => m.id.toString());
    }, [allMediaClubMedia, page]);

    const {data: anilistMediaInfo, error: anilistError, refetch: refetchAnilist} = useAnilistMediaInfoQuery(
        {
            idIn: pageIds ?? [],
            sort: 'TITLE_ENGLISH',
            perPage: PER_PAGE,
        },
        {
            skip: !pageIds
        }
    );

    const anilistRateLimitError: AnilistRateLimitError | null =
        isRateLimitError(anilistError) ? anilistError : null;

    const mediaClubMediaMap = useMemo(() => {
        if (!allMediaClubMedia) return undefined;
        return new Map(allMediaClubMedia.map(m => [m.id, m]));
    }, [allMediaClubMedia]);

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

    const totalCount = allMediaClubMedia?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

    return {
        mediaList,
        mediaListIsLoading: isLoading,
        anilistRateLimitError,
        refetchAnilist,
        totalPages,
        totalCount,
    };
}

export default useAnilistHomeMedia;
