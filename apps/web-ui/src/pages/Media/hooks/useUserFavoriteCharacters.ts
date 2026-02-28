import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetUserFavoritesQuery } from "../../../api/mediaClub/mediaClubApi";
import { useAnilistCharactersQuery } from "../../../api/anilist/anilistApi";
import type { AnilistCharacterInfo } from "../../../api/anilist/anilistApi.types";

interface Params {
    userId: number;
    mediaId: number;
}

interface Result {
    characters: AnilistCharacterInfo[];
    isLoading: boolean;
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

    const { data: characters = [], isFetching: charactersFetching, isLoading: charactersLoading } =
        useAnilistCharactersQuery(charactersArg);

    return {
        characters: characterIds.length === 0 ? [] : characters,
        isLoading: favIdsLoading || charactersLoading || charactersFetching,
    };
}

export default useUserFavoriteCharacters;
