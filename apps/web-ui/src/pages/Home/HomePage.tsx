import { useState, useCallback } from "react";
import { Box, CircularProgress, Container, IconButton, ImageList, ImageListItem, ImageListItemBar, Typography, Zoom } from "@mui/material";
import { Info } from "@mui/icons-material";
import useConfig from "../../hooks/useConfig";
import MediaInfoDrawer from "./components/MediaInfoDrawer";
import type { MediaInfoDrawerType } from "../../types/drawers.types";
import useAnilistHomeMedia from "../../hooks/useAnilistHomeMedia";
import { useNavigate } from "react-router";
import usePreferredMediaName from "../../hooks/usePreferredMediaName";

function HomePage() {
    const [mediaInfoDrawer, setMediaInfoDrawer] = useState<MediaInfoDrawerType>({
        isOpen: false,
        id: undefined,
    });

    const { isMobile } = useConfig();
    const getPreferredName = usePreferredMediaName();
    const navigate = useNavigate();
    const { mediaList, mediaListIsLoading } = useAnilistHomeMedia();

    const closeDrawer = useCallback(() => setMediaInfoDrawer({ id: undefined, isOpen: false }), []);

    if (mediaListIsLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 25 }}>
                <CircularProgress size={80} sx={{ mb: 2 }} />
                <Typography variant="h6" align="center">Loading... (-■_■)</Typography>
            </Box>
        );
    }

    return (
        <>
            <Container maxWidth="lg">
                <Zoom in timeout={350}>
                    <ImageList
                        cols={isMobile ? 2 : 3}
                        gap={isMobile ? 8 : 16}
                    >
                        {mediaList?.map(media => {
                            return (
                                <ImageListItem key={media.id} className="element-slight-hover">
                                    <img
                                        src={media.coverImage.extraLarge}
                                        style={{ borderRadius: '10px', cursor: 'pointer' }}
                                        alt={`${getPreferredName(media.title)} cover image`}
                                        onClick={() => {
                                            if (isNaN(media.id)) {
                                                return;
                                            }
                                            navigate(`/media/${media.id}`);
                                        }}
                                    />
                                    <ImageListItemBar
                                        title={getPreferredName(media.title)}
                                        subtitle={typeof media.title.native === 'string' ? media.title.native : undefined}
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                aria-label={`An image for the anime "${getPreferredName(media.title)}"`}
                                                onClick={() => setMediaInfoDrawer({
                                                    isOpen: true,
                                                    id: media.id,
                                                })}
                                            >
                                                <Info />
                                            </IconButton>
                                        }
                                        style={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
                                    />
                                </ImageListItem>
                            );
                        }) ?? []}
                    </ImageList>
                </Zoom>
            </Container>
            <MediaInfoDrawer
                mediaInfoDrawer={mediaInfoDrawer}
                closeDrawer={closeDrawer}
            />
        </>
    );
}

export default HomePage;