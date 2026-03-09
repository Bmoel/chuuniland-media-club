import { useMemo } from "react";
import useAnilistHomeMedia from "./useAnilistHomeMedia.ts";
import type { Media } from "../types/media.types.ts";
import type { AnilistRateLimitError } from "../api/anilist/anilistApi.types.ts";

export type ScoredMedia = Media & { averageScore: number };

export type ClubStats = {
    animeCount: number;
    mangaCount: number;
    completedCount: number;
    watchingCount: number;
    timeline: Media[];
    scoreRankings: ScoredMedia[];
    genreFrequency: { genre: string; count: number }[];
    isLoading: boolean;
    anilistRateLimitError: AnilistRateLimitError | null;
    refetchAnilist: () => void;
    totalPages: number;
    totalCount: number;
};

function useClubStats(page = 1): ClubStats {
    const { mediaList, mediaListIsLoading, anilistRateLimitError, refetchAnilist, totalPages, totalCount } = useAnilistHomeMedia(page);

    const animeCount = useMemo(
        () => mediaList?.filter(m => m.type === "ANIME").length ?? 0,
        [mediaList]
    );

    const mangaCount = useMemo(
        () => mediaList?.filter(m => m.type === "MANGA").length ?? 0,
        [mediaList]
    );

    const completedCount = useMemo(
        () => mediaList?.filter(m => m.media_club_status === "completed").length ?? 0,
        [mediaList]
    );

    const watchingCount = useMemo(
        () => mediaList?.filter(m => m.media_club_status === "watching").length ?? 0,
        [mediaList]
    );

    // Chronological order by club start date, most recent first. Media without a start date goes to the end.
    const timeline = useMemo(() => {
        if (!mediaList) return [];
        return [...mediaList].sort((a, b) => {
            if (!a.media_club_date_started && !b.media_club_date_started) return 0;
            if (!a.media_club_date_started) return 1;
            if (!b.media_club_date_started) return -1;
            return b.media_club_date_started.getTime() - a.media_club_date_started.getTime();
        });
    }, [mediaList]);

    // Only include media that has an AniList score, sorted highest first
    const scoreRankings = useMemo(() => {
        if (!mediaList) return [];
        return mediaList
            .filter((m): m is ScoredMedia => typeof m.averageScore === "number")
            .sort((a, b) => b.averageScore - a.averageScore);
    }, [mediaList]);

    // Count genre occurrences across all media, sorted by frequency
    const genreFrequency = useMemo(() => {
        if (!mediaList) return [];
        const counts = new Map<string, number>();
        for (const m of mediaList) {
            for (const genre of m.genres ?? []) {
                counts.set(genre, (counts.get(genre) ?? 0) + 1);
            }
        }
        return [...counts.entries()]
            .map(([genre, count]) => ({ genre, count }))
            .sort((a, b) => b.count - a.count);
    }, [mediaList]);

    return {
        animeCount,
        mangaCount,
        completedCount,
        watchingCount,
        timeline,
        scoreRankings,
        genreFrequency,
        isLoading: mediaListIsLoading,
        anilistRateLimitError,
        refetchAnilist,
        totalPages,
        totalCount,
    };
}

export default useClubStats;
