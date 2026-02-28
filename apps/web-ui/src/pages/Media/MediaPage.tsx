import { useNavigate, useParams } from "react-router";
import useGetMedia from "../../hooks/useGetMedia";
import { Box, Container, Fade, Grid, Stack, Typography } from "@mui/material";
import useConfig from "../../hooks/useConfig";
import { useEffect, useMemo, useState } from "react";
import MediaPageBreadcrumbs from "./components/MediaPageBreadcrumbs";
import MediaScoreImageBox from "./components/MediaScoreImageBox";
import { type MediaAnilistUser } from "../../api/anilist/anilistApi.types";
import useAnilistUsersMediaInfo from "../../hooks/useAnilistUsersMediaInfo";
import UserList from "./components/UserList";
import MediaMemberInfoStack from "./components/MediaMemberInfoStack";
import AnilistChip from "../../components/AnilistChip";
import useDateFormat from "../../hooks/useDateFormat";
import SelectedUserInfo from "./components/SelectedUserInfo";

function MediaPage() {
    const [selectedUser, setSelectedUser] = useState<MediaAnilistUser | undefined>(undefined);

    const { id } = useParams();
    const { isMobile } = useConfig();
    const { media, mediaIsLoading } = useGetMedia(Number(id));
    const { data: anilistUsers, isFetching } = useAnilistUsersMediaInfo(
        Number(id),
        !(media?.media_club_status === 'completed')
    );
    const formatDate = useDateFormat();
    const navigate = useNavigate();

    const mediaClubAverageScore: string = useMemo(() => {
        if (anilistUsers === undefined || anilistUsers.length === 0) {
            return '-';
        }
        let total = 0;
        let totalUsers = 0;
        anilistUsers.forEach(user => {
            const score = user?.score;
            if (typeof score === 'number') {
                total += score;
                totalUsers += 1;
            }
        });
        return totalUsers === 0 ? '-' : Math.ceil(total / totalUsers).toString();
    }, [anilistUsers]);

    useEffect(() => {
        if (!mediaIsLoading && !media) {
            navigate('/');
        }
    }, [media, mediaIsLoading, navigate]);

    return (
        <Container maxWidth="lg">
            <Fade in timeout={800}>
                <Stack spacing={2}>
                    <MediaPageBreadcrumbs mediaInfo={media} />
                    <Box>
                        <AnilistChip
                            label="Anilist Page"
                            href={media?.siteUrl}
                            ariaLabel="Visit Anilist site for the currently selected media"
                        />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid size={isMobile ? 12 : 6}>
                            <MediaScoreImageBox
                                mediaSrc={media?.coverImage.extraLarge ?? ''}
                                titleText="Anilist Average Score"
                                scoreText={`${media?.averageScore?.toString() ?? '-'} / 100`}
                            />
                        </Grid>
                        <Grid size={isMobile ? 12 : 6}>
                            <MediaScoreImageBox
                                mediaSrc={'/yomogi.svg'}
                                titleText="Media Club Average Score"
                                scoreText={`${mediaClubAverageScore} / 100`}
                            />
                        </Grid>
                        <Grid size={isMobile ? 12 : 6}>
                            <MediaMemberInfoStack>
                                <Typography variant="overline" color="text.secondary">Media Club start date</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {media?.media_club_date_started ? formatDate(media.media_club_date_started) : '-'}
                                </Typography>
                            </MediaMemberInfoStack>
                        </Grid>
                        <Grid size={isMobile ? 12 : 6}>
                            <MediaMemberInfoStack>
                                <Typography variant="overline" color="text.secondary">Media Club end date</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {media?.media_club_date_finished ? formatDate(media.media_club_date_finished) : 'Currently watching (`･ω･´)'}
                                </Typography>
                            </MediaMemberInfoStack>
                        </Grid>
                        <Grid size={12}>
                            <UserList
                                anilistUsers={anilistUsers}
                                selectedUser={selectedUser}
                                setSelectedUser={setSelectedUser}
                                dataIsLoading={isFetching}
                            />
                        </Grid>
                        {(selectedUser !== undefined && media !== undefined) && (
                            <SelectedUserInfo selectedUser={selectedUser} />
                        )}
                    </Grid>
                </Stack>
            </Fade >
        </Container >
    );
}

export default MediaPage;