import { Grid, Typography } from "@mui/material";
import AnilistChip from "../../../components/AnilistChip";
import type { MediaAnilistUser } from "../../../api/anilist/anilistApi.types";
import useConfig from "../../../hooks/useConfig";
import MediaMemberInfoStack from "./MediaMemberInfoStack";

interface SelectUserInfoProps {
    selectedUser: MediaAnilistUser,
}

function SelectedUserInfo({ selectedUser }: SelectUserInfoProps) {
    const { isMobile } = useConfig();

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
        </>
    );
}

export default SelectedUserInfo;