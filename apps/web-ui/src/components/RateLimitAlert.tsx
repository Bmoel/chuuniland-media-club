import { useEffect, useState } from "react";
import { Alert, Button, Typography } from "@mui/material";
import type { AnilistRateLimitError } from "../api/anilist/anilistApi.types";
import { useTranslation } from "react-i18next";

interface RateLimitAlertProps {
    error: AnilistRateLimitError;
    onRetry: () => void;
}

function RateLimitAlert({ error, onRetry }: RateLimitAlertProps) {
    const { t } = useTranslation();
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
                    {t('rate_limit.retry_now')}
                </Button>
            }
        >
            <Typography variant="body2">
                {t('rate_limit.retrying_in')} <strong>{secondsLeft}s</strong>
            </Typography>
        </Alert>
    );
}

export default RateLimitAlert;