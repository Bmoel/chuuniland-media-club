import { Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
    useLazyGetAccessTokenQuery,
    useRemoveAnilistUserMutation,
    useSyncAnilistUserMutation
} from "../../api/mediaClub/mediaClubApi";
import { useTranslation } from "react-i18next";
import {jwtDecode} from "jwt-decode";
import {ANILIST_ACCESS_TOKEN_KEY} from "../../constants/storage.constants.ts";

export type AuthMode = 'sync' | 'remove' | 'login';

const isValidAuthMode = (mode: string | null): mode is AuthMode => {
    return mode === 'sync' || mode === 'remove';
};

function AuthCallbackPage() {
    const [loadingText, setLoadingText] = useState<string>('');

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const lastCallKey = useRef<string>("");
    const redirectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t('common.media_club');
    }, [t]);

    const [syncUser] = useSyncAnilistUserMutation();
    const [removeUser] = useRemoveAnilistUserMutation();
    const [fetchAccessToken] = useLazyGetAccessTokenQuery();

    const handleAuth = useCallback(async (code: string, mode: AuthMode) => {
        try {
            if (mode === 'remove') {
                await removeUser({ code }).unwrap();
                setLoadingText(t('auth.removed_success'));
            } else if (mode === 'sync') {
                await syncUser({ code }).unwrap();
                setLoadingText(t('auth.synced_success'));
            } else if (mode === 'login') {
                const token = await fetchAccessToken({ code }).unwrap();
                const decodedToken = jwtDecode(token);
                const expiration = decodedToken.exp ?? 180;
                localStorage.setItem(ANILIST_ACCESS_TOKEN_KEY, JSON.stringify({
                    value: token,
                    expiry: (new Date()).getTime() + (expiration * 1000),
                }));
                setLoadingText(t('auth.login_success'));
            }
        } catch {
            setLoadingText(t('auth.failed'));
        } finally {
            sessionStorage.removeItem('oauth_state');
            setTimeout(() => navigate('/'), 1500);
        }
    }, [removeUser, t, syncUser, fetchAccessToken, navigate]);

    useEffect(() => {
        if (redirectTimeout.current) {
            clearTimeout(redirectTimeout.current);
            redirectTimeout.current = null;
        }

        const code = searchParams.get('code');
        const stateParam = searchParams.get('state');
        const [mode, originalState] = stateParam?.split('_') || [];
        if (originalState !== sessionStorage.getItem('oauth_state') || !isValidAuthMode(mode)) {
            setLoadingText(t('auth.invalid_session'));
            redirectTimeout.current = setTimeout(() => navigate('/'), 1500);
            return;
        }
        if (!code) {
            setLoadingText(t('auth.auth_error'));
            redirectTimeout.current = setTimeout(() => navigate('/'), 1500);
            return;
        }
        const currentCallKey = `${mode}-${code}`;
        setLoadingText(mode === "remove" ? t('auth.removing') : t('auth.syncing'));
        if (lastCallKey.current !== currentCallKey) {
            lastCallKey.current = currentCallKey;
            void handleAuth(code, mode);
        }

        return () => {
            if (redirectTimeout.current) {
                clearTimeout(redirectTimeout.current);
            }
        };
    }, [handleAuth, navigate, searchParams, t]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" align="center">{loadingText}</Typography>
        </Box>
    );
}

export default AuthCallbackPage;