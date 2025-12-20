import { useMediaInfoQuery } from "../api/anilist/anilistApi";
import { MEDIA } from "../constants/media";

function useAnilistMediaQuery() {
    return useMediaInfoQuery({
        idIn: Object.keys(MEDIA),
        sort: 'TITLE_ENGLISH',
    });
}

export default useAnilistMediaQuery;