import { Alert, AlertTitle, Avatar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Link, Stack, Typography } from "@mui/material";
import RegistrationPageBreadcrumbs from "./components/RegistrationPageBreadcrumbs";
import { useCallback, useState } from "react";
import type { AuthMode } from "../Auth/AuthCallbackPage";
import useConfig from "../../hooks/useConfig";

const CLIENT_ID = import.meta.env.VITE_ANILIST_APP_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_ANILIST_APP_REDIRECT_URI;

function RegistrationPage() {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);

    const { isMobile } = useConfig();

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
                                    JOIN THE CLUB
                                </Typography>
                                <Typography variant="h6" color="rgba(255,255,255,0.8)">
                                    Your Anilist journey, shared with friends.
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Link your Anilist Account
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                By registering, we'll automatically fetch your <strong>scores and reviews</strong>
                                &nbsp;directly from Anilist. No manual entry required — just connect and then navigate to
                                any of the media in the home page to see how you compare to others.
                            </Typography>
                        </Box>
                        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                            <AlertTitle sx={{ fontWeight: 'bold' }}>Transparency Notice</AlertTitle>
                            We store your <strong>Anilist ID</strong> in our database to keep your profile synced.
                            This is publically accessible info, and is the only thing we store to fetch your data from Anilist.
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
                            Connect with Anilist
                        </Button>
                        <Link
                            component="button"
                            variant="body2"
                            color="error"
                            underline="always"
                            fontWeight="bold"
                            onClick={() => setConfirmationModalOpen(true)}
                        >
                            I want to remove myself from the media club
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
                    Removal Confirmation
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        Are you sure you want to remove yourself?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1, px: 3, pb: 2 }}>
                    <Button onClick={() => setConfirmationModalOpen(false)} sx={{ color: 'grey.600' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none', bgcolor: 'error.dark' } }}
                        onClick={() => handleRedirect('remove')}
                    >
                        Confirm Removal
                    </Button>
                </DialogActions>
            </Dialog>
        </Container >
    );
}

export default RegistrationPage;