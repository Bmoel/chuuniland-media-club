import { useCallback, useState } from "react";
import { useLazyGetUserFavoritesQuery } from "../api/mediaClub/mediaClubApi";
import type { AnilistCharacter } from "../api/mediaClub/mediaClubApi.types";

export type UserFavoritesError = {
    error: string;
}

function useUserFavorites() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [trigger] = useLazyGetUserFavoritesQuery();

    const getFavoritesCharacters = useCallback(async (userId: number, signal?: AbortSignal): Promise<AnilistCharacter[] | UserFavoritesError> => {
        setIsLoading(true);

        let allCharacters: AnilistCharacter[] | undefined = [];
        let currentPage = 1;
        let hasNextPage = true;
        const MAX_PAGES = 20;

        try {
            while (hasNextPage && currentPage <= MAX_PAGES) {
                if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

                const result = await trigger({ user_id: userId, page: currentPage }, true).unwrap();

                const newCharacters = result.characters;
                allCharacters = [...allCharacters, ...newCharacters];

                hasNextPage = result.has_next_page ?? false;
                currentPage++;
            }
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return [];
            }
            const defaultErr = 'Failed to get favorite characters, please try again later';
            if (typeof error === 'object'
                && error
                && 'data' in error
                && error.data
                && typeof error.data === 'object'
                && 'error' in error.data
                && error.data.error
                && typeof error.data.error === 'object'
                && 'message' in error.data.error
                && error.data.error.message
                && typeof error.data.error.message === 'string'
            ) {
                return { error: error?.data?.error?.message ?? defaultErr };
            }
            return {error: defaultErr};
        } finally {
            setIsLoading(false);
        }

        return allCharacters;
    }, [trigger]);

    return {
        charactersAreLoading: isLoading,
        getFavoritesCharacters,
    };
}

export default useUserFavorites;