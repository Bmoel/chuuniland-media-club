import { useMemo } from "react";
import { Box, Button, IconButton, ImageList, ImageListItem, ImageListItemBar, Stack, Typography } from "@mui/material";
import { FilterList, Info } from "@mui/icons-material";
import { MEDIA } from "../constants/media";
import { useMediaInfoQuery } from "../api/anilist/anilistApi";
import type { MEDIA_INFO } from "../api/anilist/anilistApi.types";
import useConfig from "../hooks/useConfig";

function HomePage() {
    const { isMobile } = useConfig();

    const { data } = useMediaInfoQuery({
        idIn: Object.keys(MEDIA),
        sort: 'TITLE_ENGLISH',
    });

    const mediaList: MEDIA_INFO[] = useMemo(() => {
        return data?.data.Page.media ?? [];
    }, [data]);

    return (
        <Box
            sx={isMobile ? undefined : {
                display: 'flex', // Use flexbox for centering
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
            }}
        >
            <Stack spacing={2}>
                <Box display="flex" alignContent="center" justifyContent="space-between">
                    <Typography alignSelf="center" fontWeight="bold">{`${mediaList.length} anime`}</Typography>
                    <Button startIcon={<FilterList />}>
                        Filters
                    </Button>
                </Box>
                <ImageList cols={isMobile ? 2 : 3} gap={isMobile ? 8 : 16}>
                    {mediaList.map(media => {
                        return (
                            <ImageListItem key={media.id}>
                                <img src={media.coverImage.extraLarge} />
                                <ImageListItemBar
                                    title={media.title.english}
                                    subtitle={media.title.native}
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                            aria-label={`An image for the anime "${media.title.english}"`}
                                        >
                                            <Info />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        );
                    })}
                </ImageList>
            </Stack>
        </Box>
    );
}

export default HomePage;