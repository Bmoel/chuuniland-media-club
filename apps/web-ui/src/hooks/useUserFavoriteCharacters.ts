import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetUserFavoritesQuery } from "../api/mediaClub/mediaClubApi.ts";
import { useAnilistCharactersQuery } from "../api/anilist/anilistApi.ts";
import { isRateLimitError, type AnilistCharacterInfo, type AnilistRateLimitError } from "../api/anilist/anilistApi.types.ts";

interface Params {
    userId: number;
    mediaId: number;
}

interface Result {
    characters: AnilistCharacterInfo[];
    isLoading: boolean;
    rateLimitError: AnilistRateLimitError | null;
}

function useUserFavoriteCharacters({ userId, mediaId }: Params): Result {
    const { data: favorites, isFetching: favoritesFetching, isLoading: favoritesLoading } =
        useGetUserFavoritesQuery({ userId, mediaId });

    const favIdsLoading = favoritesFetching || favoritesLoading;
    const characterIds = favorites?.character_ids ?? [];

    // skipToken guarantees the hook returns undefined (no stale data from a previous user)
    // whenever favorites are still loading or there are no character IDs to fetch.
    const charactersArg = favIdsLoading || characterIds.length === 0
        ? skipToken
        : { idIn: characterIds };

    const {
        data: characters = [],
        isFetching: charactersFetching,
        isLoading: charactersLoading,
        isError: isCharactersError,
        error: charactersError,
    } = useAnilistCharactersQuery(charactersArg);

    const rateLimitError = isCharactersError && isRateLimitError(charactersError)
        ? charactersError
        : null;

    if (characterIds.length === 0) {
        return { characters: [], isLoading: favIdsLoading, rateLimitError: null };
    }

    return {
        characters,
        isLoading: favIdsLoading || charactersLoading || charactersFetching,
        rateLimitError,
    };
}

export default useUserFavoriteCharacters;
