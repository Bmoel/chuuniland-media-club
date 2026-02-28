import { Avatar, Box, Breadcrumbs, Tooltip, Typography } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import type { Media } from "../../../types/media.types";
import useConfig from "../../../hooks/useConfig";
import HomeBreadcrumb from "../../../components/HomeBreadcrumb";
import usePreferredMediaName from "../../../hooks/usePreferredMediaName";

interface MediaPageBreadcrumbsProps {
    mediaInfo?: Media,
}

function MediaPageBreadcrumbs({ mediaInfo }: MediaPageBreadcrumbsProps) {
    const { isMobile } = useConfig();
    const getPreferredName = usePreferredMediaName();

    return (
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumbs">
            <HomeBreadcrumb />
            <Box display="flex" alignItems="center">
                <Avatar
                    alt='chuuniland logo'
                    src={mediaInfo?.coverImage.extraLarge ?? '/subaru.svg'}
                    sx={{ width: 22, height: 22, mr: 0.5 }}
                />
                {mediaInfo && (
                    <Tooltip title={getPreferredName(mediaInfo.title)} enterDelay={500} enterTouchDelay={0} arrow>
                        <Typography
                            noWrap
                            sx={{
                                maxWidth: isMobile ? '150px' : 'none',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                            color="text.primary"
                        >
                            {getPreferredName(mediaInfo.title)}
                        </Typography>
                    </Tooltip>
                )}
            </Box>
        </Breadcrumbs>
    );
}

export default MediaPageBreadcrumbs;