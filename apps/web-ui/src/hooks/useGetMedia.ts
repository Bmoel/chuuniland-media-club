import { useMemo } from "react";
import useAnilistHomeMedia from "./useAnilistHomeMedia";
import type { Media } from "../types/media.types";

function useGetMedia(id?: number) {
    const {mediaList, mediaListIsLoading, anilistRateLimitError, refetchAnilist} = useAnilistHomeMedia();

    const media: Media | undefined = useMemo(() => {
        if (id === undefined || isNaN(id) || mediaList === undefined) {
            return undefined;
        }
        return mediaList.find(val => val.id === id);
    }, [mediaList, id]);

    return {media, mediaIsLoading: mediaListIsLoading, anilistRateLimitError, refetchAnilist};
}

export default useGetMedia;