// components/GlobalErrorFallback.tsx
import { Box, Typography, Button, Container } from '@mui/material';
import type { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

export function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    const { t } = useTranslation();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    textAlign: 'center',
                    gap: 2
                }}
            >
                <Typography variant="h3" color="error" gutterBottom>
                    {t('error.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {error instanceof Error
                        ? error.message
                        : (typeof error === 'string' ? error : t('error.unexpected'))}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={resetErrorBoundary}
                    sx={{ mt: 2 }}
                >
                    {t('error.try_again')}
                </Button>
            </Box>
        </Container>
    );
}