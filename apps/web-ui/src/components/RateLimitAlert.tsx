import { useEffect, useState } from "react";
import { Alert, Button, Typography } from "@mui/material";
import type { AnilistRateLimitError } from "../api/anilist/anilistApi.types";

interface RateLimitAlertProps {
    error: AnilistRateLimitError;
    onRetry: () => void;
}

function RateLimitAlert({ error, onRetry }: RateLimitAlertProps) {
    const [secondsLeft, setSecondsLeft] = useState(error.retryAfterSeconds);

    useEffect(() => {
        if (secondsLeft <= 0) {
            onRetry();
            return;
        }
        const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
        return () => clearTimeout(id);
    }, [secondsLeft, onRetry]);

    return (
        <Alert
            severity="warning"
            action={
                <Button color="inherit" size="small" onClick={onRetry}>
                    Retry Now
                </Button>
            }
        >
            <Typography variant="body2">
                AniList rate limit reached — retrying in <strong>{secondsLeft}s</strong>
            </Typography>
        </Alert>
    );
}

export default RateLimitAlert;