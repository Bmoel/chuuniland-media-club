import {Avatar, Box, CircularProgress, Grid, Link, Stack, Tooltip, Typography} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
                    {t('selected_user.rate_limit', { seconds: secondsLeft ?? rateLimitError.retryAfterSeconds })}
                </Typography>
            );
        }
        if (characters.length === 0) {
            return (
                <Typography variant="body1" fontStyle="italic" color="text.secondary">
                    {t('selected_user.no_favorites')}
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
    }, [characters, isLoading, rateLimitError, secondsLeft, t]);

    return (
        <>
            <Grid size={12}>
                <AnilistChip
                    label={t('selected_user.user_profile_label')}
                    href={selectedUser.user.siteUrl}
                    ariaLabel={t('selected_user.user_profile_aria')}
                />
            </Grid>
            <Grid size={isMobile ? 12 : 6}>
                <MediaMemberInfoStack>
                    <Typography variant="overline" color="text.secondary">{t('selected_user.user_score')}</Typography>
                    <Typography variant="h2" color="primary">{selectedUser.score ?? '-'}</Typography>
                </MediaMemberInfoStack>
            </Grid>
            <Grid size={isMobile ? 12 : 6}>
                <MediaMemberInfoStack>
                    <Typography variant="overline" color="text.secondary">{t('selected_user.review_notes')}</Typography>
                    <Typography
                        variant="body1"
                        fontStyle="italic"
                        alignItems="center"
                        textAlign="center"
                    >
                        {selectedUser.notes ?? t('selected_user.no_notes')}
                    </Typography>
                </MediaMemberInfoStack>
            </Grid>
            <Grid size={12}>
                <MediaMemberInfoStack>
                    <Stack direction="row" alignItems="center" gap={0.5}>
                        <Typography variant="overline" color="text.secondary">{t('selected_user.favorite_characters')}</Typography>
                        <Tooltip
                            title={t('selected_user.favorites_tooltip')}
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
