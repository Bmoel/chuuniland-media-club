import { useMemo } from "react";
import { type MEDIA_INFO } from "../api/anilist/anilistApi.types";
import useAnilistMediaQuery from "./useAnilistMediaQuery";

function useGetMedia(id?: number) {
    const { data } = useAnilistMediaQuery();
    
    const mediaList: MEDIA_INFO[] = useMemo(() => {
            return data?.data.Page.media ?? [];
    }, [data]);

    const media: MEDIA_INFO | undefined = useMemo(() => {
        if (id === undefined) {
            return undefined;
        }
        return mediaList.find(val => val.id === id);
    }, [mediaList, id]);

    return media; 
}

export default useGetMedia;