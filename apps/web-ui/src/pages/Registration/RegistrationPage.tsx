import { Alert, AlertTitle, Avatar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Link, Stack, Typography } from "@mui/material";
import RegistrationPageBreadcrumbs from "./components/RegistrationPageBreadcrumbs";
import { useCallback, useEffect, useState } from "react";
import type { AuthMode } from "../Auth/AuthCallbackPage";
import useConfig from "../../hooks/useConfig";
import { Trans, useTranslation } from "react-i18next";

const CLIENT_ID = import.meta.env.VITE_ANILIST_APP_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_ANILIST_APP_REDIRECT_URI;

function RegistrationPage() {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);

    const { isMobile } = useConfig();
    const { t } = useTranslation();

    useEffect(() => {
        document.title = `${t('nav.registration')} | ${t('common.media_club')}`;
    }, [t]);

    const handleRedirect = useCallback((mode: AuthMode) => {
        const oauthState = crypto.randomUUID();
        sessionStorage.setItem('oauth_state', oauthState);
        const url = `https://anilist.co/api/v2/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${mode}_${oauthState}`;
        window.location.href = url;
    }, []);

    return (
        <Container maxWidth="lg">
            <Stack spacing={2}>
                <RegistrationPageBreadcrumbs />
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Box sx={{
                            height: isMobile ? 325 : 400,
                            borderRadius: 4,
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: isMobile ? 5 : 10,
                        }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundImage: `url(${'/yomogi.svg'})`,
                                    backgroundSize: 'cover',
                                    filter: 'brightness(0.6)'
                                }}
                            />
                            <Stack
                                justifyContent="center"
                                alignItems="center"
                                sx={{ height: '100%', position: 'relative', p: 4, textAlign: 'center' }}
                            >
                                <Typography variant="h3" color="white" fontWeight="900" sx={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                                    {t('registration.hero_title')}
                                </Typography>
                                <Typography variant="h6" color="rgba(255,255,255,0.8)">
                                    {t('registration.hero_subtitle')}
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {t('registration.link_title')}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                <Trans i18nKey="registration.link_description" components={{ strong: <strong /> }} />
                            </Typography>
                        </Box>
                        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                            <AlertTitle sx={{ fontWeight: 'bold' }}>{t('registration.transparency_title')}</AlertTitle>
                            <Trans i18nKey="registration.transparency_body" components={{ strong: <strong /> }} />
                        </Alert>
                        <Button
                            variant="contained"
                            startIcon={<Avatar src="/anilist.svg" />}
                            size="large"
                            onClick={() => handleRedirect('sync')}
                            fullWidth
                            sx={{
                                borderRadius: 8,
                                py: 1.5,
                                fontSize: "1.1rem",
                                textTransform: "none",
                                boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                                backgroundColor: "#2b2d42"
                            }}
                        >
                            {t('registration.connect_button')}
                        </Button>
                        <Link
                            component="button"
                            variant="body2"
                            color="error"
                            underline="always"
                            fontWeight="bold"
                            onClick={() => setConfirmationModalOpen(true)}
                        >
                            {t('registration.remove_link')}
                        </Link>
                    </Stack>
                </Grid>
            </Stack>
            <Dialog
                open={confirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                aria-labelledby="Removal Confirmation"
                aria-describedby="Modal to confirm removal of user"
                slotProps={{ paper: { sx: { borderRadius: 2, p: 1 } } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {t('registration.dialog_title')}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        {t('registration.dialog_body')}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1, px: 3, pb: 2 }}>
                    <Button onClick={() => setConfirmationModalOpen(false)} sx={{ color: 'grey.600' }}>
                        {t('registration.cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none', bgcolor: 'error.dark' } }}
                        onClick={() => handleRedirect('remove')}
                    >
                        {t('registration.confirm_removal')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container >
    );
}

export default RegistrationPage;