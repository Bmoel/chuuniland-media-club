import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import usePreferredMediaName from "../../../hooks/usePreferredMediaName";
import type { ScoredMedia } from "../../../hooks/useClubStats";
import { useTranslation } from "react-i18next";

type ScoreRowProps = {
    media: ScoredMedia;
    rank: number;
    active: boolean;
};

function ScoreRow({ media, rank, active }: ScoreRowProps) {
    const getPreferredName = usePreferredMediaName();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <ListItem disablePadding divider sx={{ opacity: active ? 1 : 0.25, transition: "opacity 0.2s ease" }}>
            <ListItemButton onClick={() => navigate(`/media/${media.id}`)} sx={{ py: 1.5 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ width: 28, flexShrink: 0, fontWeight: "bold" }}
                >
                    {rank}.
                </Typography>
                <ListItemAvatar sx={{ minWidth: 52 }}>
                    <Avatar
                        src={media.coverImage.extraLarge}
                        alt={getPreferredName(media.title)}
                        variant="rounded"
                        sx={{ width: 36, height: 52 }}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography variant="body2" fontWeight="bold" noWrap>
                            {getPreferredName(media.title)}
                        </Typography>
                    }
                    secondary={
                        <Box component="span" display="flex" flexDirection="column">
                            <Typography
                                variant="caption"
                                color={media.averageScore >= 75 ? "success.main" : media.averageScore >= 60 ? "warning.main" : "error.main"}
                                fontWeight="bold"
                                component="span"
                            >
                                {media.averageScore} / 100
                            </Typography>
                            <Typography variant="caption" color="text.secondary" component="span">
                                {media.type === "ANIME" ? t('common.anime') : t('common.manga')}
                            </Typography>
                        </Box>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
}

type ScoreRankingsTabProps = {
    scoreRankings: ScoredMedia[];
    selectedGenre: string | null;
};

function ScoreRankingsTab({ scoreRankings, selectedGenre }: ScoreRankingsTabProps) {
    return (
        <List disablePadding>
            {scoreRankings.map((media, i) => (
                <ScoreRow
                    key={media.id}
                    media={media}
                    rank={i + 1}
                    active={!selectedGenre || (media.genres ?? []).includes(selectedGenre)}
                />
            ))}
        </List>
    );
}

export default ScoreRankingsTab;
