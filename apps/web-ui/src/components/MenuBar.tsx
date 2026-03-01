import { AppBar, Avatar, Box, Chip, Divider, IconButton, List, Link, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, type SxProps, type Theme, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useCallback, useMemo, useState } from 'react';
import useConfig from '../hooks/useConfig';
import { AppRegistration, Home, GitHub, BarChart } from '@mui/icons-material';
import { useNavigate } from 'react-router';

export default function MenuBar() {
    const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);

    const { isMobile, screenWidth } = useConfig();
    const navigate = useNavigate();

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
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => setSideMenuOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Media Club
                        </Typography>
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
                <List sx={listCss}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar alt='chuuniland logo' src="/subaru.svg" />
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography fontWeight="bold">Media Club</Typography>
                        </ListItemText>
                    </ListItem>
                    <Divider sx={{ mx: 1 }} />
                    <ListItem
                        onClick={() => navigateAway('/')}
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <Home color='info' />
                            </ListItemIcon>
                            <ListItemText primary={'Home'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem
                        onClick={() => navigateAway('/stats')}
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <BarChart color='success' />
                            </ListItemIcon>
                            <ListItemText primary="Stats" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem
                        onClick={() => navigateAway('/registration')}
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <AppRegistration color='warning' />
                            </ListItemIcon>
                            <ListItemText primary="Registration" />
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
                        aria-label="Visit github repository"
                        clickable
                    />
                </Box>
            </SwipeableDrawer>
        </>
    );
}
