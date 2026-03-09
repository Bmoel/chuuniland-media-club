import { Box, Breadcrumbs, CircularProgress, Container, Divider, Fade, Pagination, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { BarChart, NavigateNext } from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import HomeBreadcrumb from "../../components/HomeBreadcrumb";
import RateLimitAlert from "../../components/RateLimitAlert";
import useClubStats from "../../hooks/useClubStats";
import StatSummaryCards from "./components/StatSummaryCards";
import GenreFilter from "./components/GenreFilter";
import ScoreRankingsTab from "./components/ScoreRankingsTab";
import ClubTimelineTab from "./components/ClubTimelineTab";

function StatsPage() {
    const [page, setPage] = useState(1);
    const {
        animeCount,
        mangaCount,
        completedCount,
        watchingCount,
        timeline,
        scoreRankings,
        genreFrequency,
        isLoading,
        anilistRateLimitError,
        refetchAnilist,
        totalPages,
    } = useClubStats(page);

    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<number>(0);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

    const handleTabChange = (_: unknown, newValue: number) => {
        setActiveTab(newValue);
        setSelectedGenre(null);
    };

    const handleGenreClick = (genre: string) => {
        setSelectedGenre(prev => prev === genre ? null : genre);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 25 }}>
                <CircularProgress size={80} sx={{ mb: 2 }} />
                <Typography variant="h6" align="center">{t('common.loading')}</Typography>
            </Box>
        );
    }

    if (anilistRateLimitError) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 25, px: 2 }}>
                <RateLimitAlert
                    key={anilistRateLimitError.retryAfterSeconds}
                    error={anilistRateLimitError}
                    onRetry={refetchAnilist}
                />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Fade in timeout={350}>
                <Stack spacing={3} pb={4}>
                    <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumbs">
                        <HomeBreadcrumb />
                        <Box display="flex" alignItems="center">
                            <BarChart color="success" sx={{ width: 22, height: 22, mr: 0.5 }} />
                            <Typography color="text.primary">{t('stats.page_title')}</Typography>
                        </Box>
                    </Breadcrumbs>

                    <StatSummaryCards
                        animeCount={animeCount}
                        mangaCount={mangaCount}
                        completedCount={completedCount}
                        watchingCount={watchingCount}
                    />

                    {genreFrequency.length > 0 && (
                        <GenreFilter
                            genreFrequency={genreFrequency}
                            selectedGenre={selectedGenre}
                            onGenreClick={handleGenreClick}
                        />
                    )}

                    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                        <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 1 }}>
                            <Tab label={t('stats.anilist_rankings_tab')} />
                            <Tab label={t('stats.timeline_tab')} />
                        </Tabs>
                        <Divider />
                        {activeTab === 0 && (
                            <ScoreRankingsTab
                                scoreRankings={scoreRankings}
                                selectedGenre={selectedGenre}
                            />
                        )}
                        {activeTab === 1 && (
                            <ClubTimelineTab timeline={timeline} selectedGenre={selectedGenre} />
                        )}
                    </Paper>

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, value) => {
                                    setPage(value);
                                    setSelectedGenre(null);
                                }}
                                color="primary"
                            />
                        </Box>
                    )}
                </Stack>
            </Fade>
        </Container>
    );
}

export default StatsPage;
