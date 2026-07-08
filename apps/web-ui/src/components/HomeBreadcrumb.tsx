import { Home } from "@mui/icons-material";
import { Link } from "@mui/material";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

function HomeBreadcrumb() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Link
            component="button"
            onClick={() => navigate('/')}
            sx={{ display: 'flex', alignItems: 'center', cursor: "pointer" }}
            underline="hover"
            color="inherit"
        >
            <Home color='info' sx={{ mr: 0.5 }} fontSize="inherit" />
            {t('common.home')}
        </Link>
    );
}

export default HomeBreadcrumb;