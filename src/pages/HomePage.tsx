import { Avatar, Box, List, ListItem, ListItemAvatar, Stack, Typography } from "@mui/material";
import { MEDIA } from "../constants/media";

function HomePage() {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
        >
            <Stack>
                <Typography variant="h4" align="center">Chuuniland Media Club</Typography>
                <List>
                    {MEDIA.map(media => {
                        return (
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <Typography>{media.id}</Typography>
                            </ListItem>
                        );
                    })}
                </List>
            </Stack>
        </Box>
    );
}

export default HomePage;