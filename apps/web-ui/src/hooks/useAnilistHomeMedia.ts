import { useMemo } from "react";
import { useAnilistMediaInfoQuery } from "../api/anilist/anilistApi";
import { useMediaClubMediaInfoQuery } from "../api/mediaClub/mediaClubApi";
import type { Media } from "../types/media.types";
import type { AnilistRateLimitError } from "../api/anilist/anilistApi.types";

function useAnilistHomeMedia(): {
    mediaList: Media[] | undefined;
    mediaListIsLoading: boolean;
    anilistRateLimitError: AnilistRateLimitError | null;
    refetchAnilist: () => void;
} {
    const {data: mediaClubMediaInfo, isLoading} = useMediaClubMediaInfoQuery(undefined);

    const {data: anilistMediaInfo, error: anilistError, refetch: refetchAnilist} = useAnilistMediaInfoQuery(
        {
            idIn: mediaClubMediaInfo?.map(mediaEntry => mediaEntry.id.toString()) ?? [],
            sort: 'TITLE_ENGLISH',
        },
        {
            skip: !mediaClubMediaInfo
        }
    );

    const anilistRateLimitError: AnilistRateLimitError | null =
        (anilistError && typeof anilistError === 'object' && 'isRateLimited' in anilistError)
            ? anilistError as AnilistRateLimitError
            : null;

    const mediaClubMediaMap = useMemo(() => {
        if (!mediaClubMediaInfo) return undefined;
        return new Map(mediaClubMediaInfo.map(m => [m.id, m]));
    }, [mediaClubMediaInfo]);

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

    return {mediaList, mediaListIsLoading: isLoading, anilistRateLimitError, refetchAnilist};
}

export default useAnilistHomeMedia;