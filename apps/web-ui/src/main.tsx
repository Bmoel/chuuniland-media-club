import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import HomePage from './pages/Home/HomePage.tsx';
import MediaPage from './pages/Media/MediaPage.tsx';
import RegistrationPage from './pages/Registration/RegistrationPage.tsx';
import AuthCallbackPage from './pages/Auth/AuthCallbackPage.tsx';
import { Provider } from 'react-redux';
import { store } from './store.ts';
import MenuWrapper from './components/MenuWrapper.tsx';

// Font imports for material ui
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Main css import
import './css/app.css';
import { ErrorBoundary } from 'react-error-boundary';
import { GlobalErrorFallback } from './components/GlobalErrorFallback.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={GlobalErrorFallback} onReset={() => window.location.href = '/'}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<MenuWrapper><HomePage /></MenuWrapper>} />
            <Route path="/media/:id" element={<MenuWrapper><MediaPage /></MenuWrapper>} />
            <Route path="/registration" element={<MenuWrapper><RegistrationPage /></MenuWrapper>} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
);
