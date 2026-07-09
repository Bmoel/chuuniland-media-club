import { AppBar, Avatar, Box, Button, Chip, Divider, IconButton, List, Link, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, type SxProps, type Theme, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useConfig from '../hooks/useConfig';
import useAnilistRedirect from '../hooks/useAnilistRedirect';
import { selectAvatarUrl, selectIsAuthenticated } from '../slices/AuthSlice';
import { AppRegistration, Home, GitHub, BarChart, Login } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function MenuBar() {
    const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);

    const { isMobile, screenWidth } = useConfig();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const avatarUrl = useSelector(selectAvatarUrl);
    const handleRedirect = useAnilistRedirect();

    const listCss: SxProps<Theme> = useMemo(() => {
        if (isMobile) {
            return { width: `${screenWidth * 0.7}px` };
        }
        return { width: `350px` };
    }, [isMobile, screenWidth]);

    const navigateAway = useCallback((location: string) => {
        setSideMenuOpen(false);
        navigate(location);
    }, [navigate]);

    return (
        <>
            <Box>
                <AppBar color='info' position='fixed'>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label={t('nav.menu_aria')}
                            sx={{ mr: 2 }}
                            onClick={() => setSideMenuOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {t('common.media_club')}
                        </Typography>
                        {isAuthenticated ? (
                            <Avatar src={avatarUrl} sx={{ width: 36, height: 36 }} />
                        ) : (
                            <Button
                                color="inherit"
                                startIcon={<Login />}
                                onClick={() => handleRedirect('login')}
                                sx={{ textTransform: 'none' }}
                            >
                                {t('auth.login')}
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
                <Toolbar />
            </Box>
            <SwipeableDrawer
                open={sideMenuOpen}
                onClose={() => setSideMenuOpen(false)}
                onOpen={() => { }}
                anchor="left"
                disableDiscovery
                disableSwipeToOpen
            >
                <List sx={listCss} aria-label="Navigation Menu">
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar alt="" src="/subaru.svg" />
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography fontWeight="bold">{t('common.media_club')}</Typography>
                        </ListItemText>
                    </ListItem>
                    <Divider sx={{ mx: 1 }} />

                    <ListItem disablePadding>
                        <ListItemButton
                            component="button"
                            onClick={() => navigateAway('/')}
                        >
                            <ListItemIcon>
                                <Home color='info' aria-hidden="true" />
                            </ListItemIcon>
                            <ListItemText primary={t('common.home')} />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton
                            component="button"
                            onClick={() => navigateAway('/stats')}
                        >
                            <ListItemIcon>
                                <BarChart color='success' aria-hidden="true" />
                            </ListItemIcon>
                            <ListItemText primary={t('nav.stats')} />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton
                            component="button"
                            onClick={() => navigateAway('/registration')}
                        >
                            <ListItemIcon>
                                <AppRegistration color='warning' aria-hidden="true" />
                            </ListItemIcon>
                            <ListItemText primary={t('nav.registration')} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Box display="flex" justifyContent="center" marginTop="auto" paddingBottom="5px">
                    <Chip
                        icon={<GitHub />}
                        component={Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/Bmoel/media-club"
                        label="Github"
                        color="primary"
                        variant="outlined"
                        aria-label={t('nav.github_aria')}
                        clickable
                    />
                </Box>
            </SwipeableDrawer>
        </>
    );
}
