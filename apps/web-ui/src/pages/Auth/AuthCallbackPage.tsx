import { Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
    useLazyGetLoginInfoQuery,
    useRemoveAnilistUserMutation,
    useSyncAnilistUserMutation
} from "../../api/mediaClub/mediaClubApi";
import { useTranslation } from "react-i18next";
import {useDispatch} from "react-redux";
import {setAuth} from "../../slices/AuthSlice";
export type AuthMode = 'sync' | 'remove' | 'login';

const isValidAuthMode = (mode: string | null): mode is AuthMode => {
    return mode === 'sync' || mode === 'remove' || mode === 'login';
};

function AuthCallbackPage() {
    const [loadingText, setLoadingText] = useState<string>('');

    const dispatch = useDispatch();
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
    const [fetchLoginInfo] = useLazyGetLoginInfoQuery();

    const handleAuth = useCallback(async (code: string, mode: AuthMode) => {
        try {
            if (mode === 'remove') {
                await removeUser({ code }).unwrap();
                setLoadingText(t('auth.removed_success'));
            } else if (mode === 'sync') {
                await syncUser({ code }).unwrap();
                setLoadingText(t('auth.synced_success'));
            } else if (mode === 'login') {
                const loginResponse = await fetchLoginInfo({ code }).unwrap();
                dispatch(setAuth({
                    jwtToken: loginResponse.access_token,
                    avatarUrl: loginResponse.avatar_url,
                    name: loginResponse.name,
                }));
                setLoadingText(t('auth.login_success'));
            }
        } catch {
            setLoadingText(t('auth.failed'));
        } finally {
            sessionStorage.removeItem('oauth_state');
            setTimeout(() => navigate('/'), 1500);
        }
    }, [removeUser, t, syncUser, fetchLoginInfo, navigate, dispatch]);

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