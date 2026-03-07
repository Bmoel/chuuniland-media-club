import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { Movie, MenuBook, CheckCircle, Visibility } from "@mui/icons-material";
import type { ReactNode } from "react";
import useConfig from "../../../hooks/useConfig";
import { useTranslation } from "react-i18next";

type StatCardProps = {
    icon: ReactNode;
    label: string;
    value: number;
    color: string;
};

function StatCard({ icon, label, value, color }: StatCardProps) {
    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
            <Stack spacing={0.5} alignItems="center">
                <Box sx={{ color }}>{icon}</Box>
                <Typography variant="h4" fontWeight="bold" lineHeight={1.1}>
                    {value}
                </Typography>
                <Typography variant="overline" color="text.secondary" textAlign="center">
                    {label}
                </Typography>
            </Stack>
        </Paper>
    );
}

type StatSummaryCardsProps = {
    animeCount: number;
    mangaCount: number;
    completedCount: number;
    watchingCount: number;
};

function StatSummaryCards({ animeCount, mangaCount, completedCount, watchingCount }: StatSummaryCardsProps) {
    const { isMobile } = useConfig();
    const { t } = useTranslation();
    const cardSize = isMobile ? 6 : 3;

    return (
        <Box overflow="hidden">
            <Grid container spacing={2}>
                <Grid size={cardSize}>
                    <StatCard icon={<Movie fontSize="large" />} label={t('common.anime')} value={animeCount} color="primary.main" />
                </Grid>
                <Grid size={cardSize}>
                    <StatCard icon={<MenuBook fontSize="large" />} label={t('common.manga')} value={mangaCount} color="secondary.main" />
                </Grid>
                <Grid size={cardSize}>
                    <StatCard icon={<CheckCircle fontSize="large" />} label={t('stats.completed')} value={completedCount} color="success.main" />
                </Grid>
                <Grid size={cardSize}>
                    <StatCard icon={<Visibility fontSize="large" />} label={t('stats.watching')} value={watchingCount} color="info.main" />
                </Grid>
            </Grid>
        </Box>
    );
}

export default StatSummaryCards;
