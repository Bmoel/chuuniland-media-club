import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import AnilistChip from "../../../components/AnilistChip";
import type { MediaAnilistUser } from "../../../api/anilist/anilistApi.types";
import useConfig from "../../../hooks/useConfig";
import MediaMemberInfoStack from "./MediaMemberInfoStack";
import FavoriteCharactersList from "./FavoriteCharactersList";

interface SelectUserInfoProps {
    selectedUser: MediaAnilistUser,
    mediaId: number,
}

function SelectedUserInfo({ selectedUser, mediaId }: SelectUserInfoProps) {
    const { isMobile } = useConfig();
    const { t } = useTranslation();

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
                <FavoriteCharactersList userId={selectedUser.user.id} mediaId={mediaId} />
            </Grid>
        </>
    );
}

export default SelectedUserInfo;