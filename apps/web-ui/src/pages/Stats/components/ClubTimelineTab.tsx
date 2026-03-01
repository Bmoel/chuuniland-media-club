import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import usePreferredMediaName from "../../../hooks/usePreferredMediaName";
import useDateFormat from "../../../hooks/useDateFormat";
import type { Media } from "../../../types/media.types";

type TimelineRowProps = {
    media: Media;
    rank: number;
    active: boolean;
};

function TimelineRow({ media, rank, active }: TimelineRowProps) {
    const getPreferredName = usePreferredMediaName();
    const formatDate = useDateFormat();
    const navigate = useNavigate();

    const startLabel = media.media_club_date_started
        ? formatDate(media.media_club_date_started)
        : "Unknown date";

    const endLabel = media.media_club_date_finished
        ? formatDate(media.media_club_date_finished)
        : null;

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
                            <Typography variant="caption" color={media.media_club_status === "watching" ? "info.main" : "success.main"} fontWeight="bold" component="span">
                                {media.media_club_status === "watching" ? "Watching" : "Completed"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" component="span">
                                {endLabel ? `${startLabel} — ${endLabel}` : `Started ${startLabel}`}
                            </Typography>
                        </Box>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
}

type ClubTimelineTabProps = {
    timeline: Media[];
    selectedGenre: string | null;
};

function ClubTimelineTab({ timeline, selectedGenre }: ClubTimelineTabProps) {
    return (
        <List disablePadding>
            {timeline.map((media, i) => (
                <TimelineRow
                    key={media.id}
                    media={media}
                    rank={i + 1}
                    active={!selectedGenre || (media.genres ?? []).includes(selectedGenre)}
                />
            ))}
        </List>
    );
}

export default ClubTimelineTab;
