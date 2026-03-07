import { Box, Breadcrumbs, Typography } from "@mui/material";
import { AppRegistration, NavigateNext } from "@mui/icons-material";
import useConfig from "../../../hooks/useConfig";
import HomeBreadcrumb from "../../../components/HomeBreadcrumb";
import { useTranslation } from "react-i18next";

function RegistrationPageBreadcrumbs() {
    const { isMobile } = useConfig();
    const { t } = useTranslation();

    return (
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumbs">
            <HomeBreadcrumb />
            <Box display="flex" alignItems="center">
                <AppRegistration color='warning' sx={{ width: 22, height: 22, mr: 0.5 }} />
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
                    {t('nav.registration')}
                </Typography>
            </Box>
        </Breadcrumbs>
    );
}

export default RegistrationPageBreadcrumbs;