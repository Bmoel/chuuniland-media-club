import { useCallback } from "react";
import type { AuthMode } from "../pages/Auth/AuthCallbackPage";

const CLIENT_ID = import.meta.env.VITE_ANILIST_APP_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_ANILIST_APP_REDIRECT_URI;

export default function useAnilistRedirect() {
    return useCallback((mode: AuthMode) => {
        const oauthState = crypto.randomUUID();
        sessionStorage.setItem('oauth_state', oauthState);
        const url = `https://anilist.co/api/v2/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${mode}_${oauthState}`;
        window.location.href = url;
    }, []);
}