import './i18n';
import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store.ts';
import MenuWrapper from './components/MenuWrapper.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { GlobalErrorFallback } from './components/GlobalErrorFallback.tsx';
import PageLoader from "./components/PageLoader.tsx";

// Font imports for material ui
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Main CSS import
import './css/app.css';

// Lazy-loaded page components for code splitting
const HomePage = lazy(() => import('./pages/Home/HomePage.tsx'));
const MediaPage = lazy(() => import('./pages/Media/MediaPage.tsx'));
const StatsPage = lazy(() => import('./pages/Stats/StatsPage.tsx'));
const RegistrationPage = lazy(() => import('./pages/Registration/RegistrationPage.tsx'));
const AuthCallbackPage = lazy(() => import('./pages/Auth/AuthCallbackPage.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={GlobalErrorFallback} onReset={() => window.location.href = '/'}>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/media/:id" element={<MenuWrapper><MediaPage /></MenuWrapper>} />
              <Route path="/stats" element={<MenuWrapper><StatsPage /></MenuWrapper>} />
              <Route path="/registration" element={<MenuWrapper><RegistrationPage /></MenuWrapper>} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="*" element={<MenuWrapper><HomePage /></MenuWrapper>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
);