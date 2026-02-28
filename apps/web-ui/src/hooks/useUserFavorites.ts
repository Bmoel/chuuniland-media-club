import { useCallback } from "react";
import { useAnilistUserFavoritesQuery } from "../api/anilist/anilistApi";
import type { Character } from "../types/characters.types";

function useUserFavorites(userId?: number) {
    const { data: userFavorites, isLoading: userFavoritesAreLoading } = useAnilistUserFavoritesQuery(
        { id: userId as number },
        { skip: typeof userId !== 'number' }
    );

    const isFavoriteAnime = useCallback((animeId: number | undefined): boolean => {
        if (userFavorites === undefined || animeId === undefined || userFavoritesAreLoading) {
            return false;
        }
        return userFavorites.favourites.anime.nodes.some(node => node.id === animeId);
    }, [userFavorites, userFavoritesAreLoading]);

    const getFavoritesCharacters = useCallback((animeId: number | undefined): Character[] => {
        if (userFavorites === undefined || animeId === undefined || userFavoritesAreLoading) {
            return [];
        }
        const characters: Character[] = [];
        userFavorites.favourites.characters.nodes.forEach(node => {
            const mediaCharacterAreIn = node.media.nodes;
            mediaCharacterAreIn.forEach(mediaObj => {
                if (mediaObj.id === animeId) {
                    characters.push({
                        id: node.id,
                        name: node.name.full ?? '',
                        image: node.image.medium ?? '',
                        siteUrl: node.siteUrl ?? '',
                    });
                }
            });
        });
        return characters;
    }, [userFavorites, userFavoritesAreLoading]);

    return {
        isFavoriteAnime,
        getFavoritesCharacters,
        userFavoritesAreLoading
    };
}

export default useUserFavorites;