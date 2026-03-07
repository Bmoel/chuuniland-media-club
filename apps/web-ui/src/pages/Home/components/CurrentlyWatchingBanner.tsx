import { Box, Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import type { Media } from "../../../types/media.types";
import usePreferredMediaName from "../../../hooks/usePreferredMediaName";

type Props = {
    media: Media;
};

function CurrentlyWatchingBanner({ media }: Props) {
    const navigate = useNavigate();
    const getPreferredName = usePreferredMediaName();

    const backgroundImage = media.bannerImage ?? media.coverImage.extraLarge;
    const label = media.type === "MANGA" ? "Currently Reading" : "Currently Watching";

    return (
        <Box
            onClick={() => navigate(`/media/${media.id}`)}
            sx={{
                position: "relative",
                width: "100%",
                height: { xs: 180, sm: 260, md: 320 },
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                mb: 3,
                "&:hover .banner-overlay": {
                    opacity: 0.55,
                },
            }}
        >
            {/* Background image */}
            <Box
                component="img"
                src={backgroundImage}
                alt={getPreferredName(media.title)}
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    display: "block",
                }}
            />

            {/* Dark gradient overlay */}
            <Box
                className="banner-overlay"
                sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.1) 100%)",
                    transition: "opacity 0.2s ease",
                }}
            />

            {/* Text content */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    p: { xs: 1.5, sm: 2.5 },
                }}
            >
                <Chip
                    label={label}
                    size="small"
                    sx={{
                        mb: 1,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                    }}
                />
                <Typography
                    variant="h5"
                    sx={{
                        color: "white",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                        fontSize: { xs: "1.1rem", sm: "1.5rem" },
                    }}
                >
                    {getPreferredName(media.title)}
                </Typography>
            </Box>
        </Box>
    );
}

export default CurrentlyWatchingBanner;