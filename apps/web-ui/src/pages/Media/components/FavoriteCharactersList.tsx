import { Avatar, Box, CircularProgress, Link, Stack, Tooltip, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "react-i18next";
import useUserFavoriteCharacters from "../../../hooks/useUserFavoriteCharacters";
import useCountdown from "../../../hooks/useCountdown";
import MediaMemberInfoStack from "./MediaMemberInfoStack";

interface FavoriteCharactersListProps {
    userId: number;
    mediaId: number;
}

function FavoriteCharactersList({ userId, mediaId }: FavoriteCharactersListProps) {
    const { t } = useTranslation();
    const { characters, isLoading, rateLimitError } = useUserFavoriteCharacters({ userId, mediaId });
    const secondsLeft = useCountdown(rateLimitError?.retryAfterSeconds ?? null);

    const renderContent = () => {
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
    };

    return (
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
            {renderContent()}
        </MediaMemberInfoStack>
    );
}

export default FavoriteCharactersList;