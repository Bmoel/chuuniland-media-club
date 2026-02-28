import { Avatar, Box, CircularProgress, Grid, Link, Stack, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AnilistChip from "../../../components/AnilistChip";
import type { MediaAnilistUser } from "../../../api/anilist/anilistApi.types";
import useConfig from "../../../hooks/useConfig";
import MediaMemberInfoStack from "./MediaMemberInfoStack";
import useUserFavoriteCharacters from "../hooks/useUserFavoriteCharacters";
import {useMemo} from "react";

interface SelectUserInfoProps {
    selectedUser: MediaAnilistUser,
    mediaId: number,
}

function SelectedUserInfo({ selectedUser, mediaId }: SelectUserInfoProps) {
    const { isMobile } = useConfig();
    const { characters, isLoading } = useUserFavoriteCharacters({
        userId: selectedUser.user.id,
        mediaId,
    });

    const renderFavorites = useMemo(() => {
        if (isLoading) {
            return <CircularProgress size={24} />;
        }
        if (characters.length === 0) {
            return (
                <Typography variant="body1" fontStyle="italic" color="text.secondary">
                    No favorite characters found (´･_･`)
                </Typography>
            );
        }
        return (
            <Stack spacing={1} width="100%">
                {characters.map((character) => (
                    <Box
                        key={character.id}
                        component={Link}
                        href={`https://anilist.co/character/${character.id}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1,
                            borderRadius: 1,
                            textDecoration: 'none',
                            color: 'inherit',
                            '&:hover': { bgcolor: 'action.hover' },
                        }}
                    >
                        <Avatar
                            src={character.image.medium}
                            alt={character.name.userPreferred}
                            sx={{ width: 48, height: 48 }}
                        />
                        <Typography variant="body2" fontWeight="bold" flex={1}>
                            {character.name.userPreferred}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FavoriteIcon sx={{ fontSize: 14, color: 'error.main' }} />
                            <Typography variant="caption" color="text.secondary">
                                {character.favourites.toLocaleString()}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>
        );
    }, [characters, isLoading]);

    return (
        <>
            <Grid size={12}>
                <AnilistChip
                    label="User Profile"
                    href={selectedUser.user.siteUrl}
                    ariaLabel="Visit anilist profile for the selected user"
                />
            </Grid>
            <Grid size={isMobile ? 12 : 6}>
                <MediaMemberInfoStack>
                    <Typography variant="overline" color="text.secondary">USER SCORE</Typography>
                    <Typography variant="h2" color="primary">{selectedUser.score ?? '-'}</Typography>
                </MediaMemberInfoStack>
            </Grid>
            <Grid size={isMobile ? 12 : 6}>
                <MediaMemberInfoStack>
                    <Typography variant="overline" color="text.secondary">REVIEW & NOTES</Typography>
                    <Typography
                        variant="body1"
                        fontStyle="italic"
                        alignItems="center"
                        textAlign="center"
                    >
                        {selectedUser.notes ?? "No notes have been provided for this title"}
                    </Typography>
                </MediaMemberInfoStack>
            </Grid>
            <Grid size={12}>
                <MediaMemberInfoStack>
                    <Typography variant="overline" color="text.secondary">FAVORITE CHARACTERS</Typography>
                    {renderFavorites}
                </MediaMemberInfoStack>
            </Grid>
        </>
    );
}

export default SelectedUserInfo;
