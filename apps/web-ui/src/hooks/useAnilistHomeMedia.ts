import { useCallback, useMemo, useState } from "react";
import { useAnilistMediaInfoQuery } from "../api/anilist/anilistApi";
import { useMediaClubMediaInfoQuery } from "../api/mediaClub/mediaClubApi";
import type { Media } from "../types/media.types";
import { isRateLimitError, type AnilistRateLimitError } from "../api/anilist/anilistApi.types";

const PER_PAGE = 25;

function useAnilistHomeMedia(): {
    mediaList: Media[] | undefined;
    mediaListIsLoading: boolean;
    isLoadingMore: boolean;
    anilistRateLimitError: AnilistRateLimitError | null;
    refetchAnilist: () => void;
    loadMore: () => void;
    hasMore: boolean;
} {
    const [loadedPages, setLoadedPages] = useState(1);

    const { data: allMediaClubMedia, isLoading } = useMediaClubMediaInfoQuery(undefined);

    const accumulatedIds = useMemo(() => {
        if (!allMediaClubMedia) return undefined;
        return allMediaClubMedia.slice(0, loadedPages * PER_PAGE).map(m => m.id.toString());
    }, [allMediaClubMedia, loadedPages]);

    const {
        data: anilistMediaInfo,
        error: anilistError,
        refetch: refetchAnilist,
        isFetching: anilistIsFetching,
    } = useAnilistMediaInfoQuery(
        {
            idIn: accumulatedIds ?? [],
            sort: 'TITLE_ENGLISH',
            perPage: loadedPages * PER_PAGE,
        },
        { skip: !accumulatedIds }
    );

    const hasMore = (allMediaClubMedia?.length ?? 0) > loadedPages * PER_PAGE;

    const loadMore = useCallback(() => {
        if (hasMore) setLoadedPages(p => p + 1);
    }, [hasMore]);

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

    return {
        mediaList,
        mediaListIsLoading: isLoading || (anilistIsFetching && !anilistMediaInfo),
        isLoadingMore: anilistIsFetching && !!anilistMediaInfo,
        anilistRateLimitError,
        refetchAnilist,
        loadMore,
        hasMore,
    };
}

export default useAnilistHomeMedia;
