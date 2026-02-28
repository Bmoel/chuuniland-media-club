// components/GlobalErrorFallback.tsx
import { Box, Typography, Button, Container } from '@mui/material';
import type { FallbackProps } from 'react-error-boundary';

export function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
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
                    Oops! Something went wrong.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {error instanceof Error
                        ? error.message
                        : (typeof error === 'string' ? error : "An unexpected error occurred.")}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={resetErrorBoundary}
                    sx={{ mt: 2 }}
                >
                    Try Again
                </Button>
            </Box>
        </Container>
    );
}