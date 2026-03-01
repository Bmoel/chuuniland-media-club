import {Avatar, Box, CircularProgress, Grid, Link, Stack, Tooltip, Typography} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AnilistChip from "../../../components/AnilistChip";
import type { MediaAnilistUser } from "../../../api/anilist/anilistApi.types";
import useConfig from "../../../hooks/useConfig";
import MediaMemberInfoStack from "./MediaMemberInfoStack";
import useUserFavoriteCharacters from "../../../hooks/useUserFavoriteCharacters.ts";
import { useEffect, useMemo, useState } from "react";

interface SelectUserInfoProps {
    selectedUser: MediaAnilistUser,
    mediaId: number,
}

function SelectedUserInfo({ selectedUser, mediaId }: SelectUserInfoProps) {
    const { isMobile } = useConfig();
    const { characters, isLoading, rateLimitError } = useUserFavoriteCharacters({
        userId: selectedUser.user.id,
        mediaId,
    });

    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!rateLimitError) return;

        let seconds = rateLimitError.retryAfterSeconds;

        const interval = setInterval(() => {
            seconds -= 1;
            setSecondsLeft(seconds);
            if (seconds <= 0) clearInterval(interval);
        }, 1000);

        return () => {
            clearInterval(interval);
            setSecondsLeft(null);
        };
    }, [rateLimitError]);

    const renderFavorites = useMemo(() => {
        if (isLoading) {
            return <CircularProgress size={24} />;
        }
        if (rateLimitError) {
            return (
                <Typography variant="body1" fontStyle="italic" color="warning.main">
                    AniList rate limit reached — retry in {secondsLeft ?? rateLimitError.retryAfterSeconds}s
                </Typography>
            );
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
                        <Typography variant="body2" fontWeight="bold" flex={1} color="primary" sx={{ textDecoration: 'underline' }}>
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
    }, [characters, isLoading, rateLimitError, secondsLeft]);

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
                    <Stack direction="row" alignItems="center" gap={0.5}>
                        <Typography variant="overline" color="text.secondary">FAVORITE CHARACTERS</Typography>
                        <Tooltip
                            title="Favorite characters are cached and refreshed every Friday at 11 PM PST — check back then for the latest picks!"
                            arrow
                            placement="top"
                            enterTouchDelay={0}
                        >
                            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help', mb: '-1px' }} />
                        </Tooltip>
                    </Stack>
                    {renderFavorites}
                </MediaMemberInfoStack>
            </Grid>
        </>
    );
}

export default SelectedUserInfo;
