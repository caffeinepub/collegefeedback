import { useState, useEffect } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import ShareExperience from './pages/ShareExperience';
import PostDetail from './pages/PostDetail';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import YearSelectionModal from './components/YearSelectionModal';
import { useYearSelection } from './hooks/useYearSelection';
import { LanguageProvider } from './contexts/LanguageContext';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const shareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/share',
  component: ShareExperience,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post/$id',
  component: PostDetail,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  shareRoute,
  postDetailRoute,
  dashboardRoute,
  aboutRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppWithYearGate() {
  const { hasSelected } = useYearSelection();
  const [yearConfirmed, setYearConfirmed] = useState(hasSelected);

  useEffect(() => {
    const handler = () => setYearConfirmed(true);
    window.addEventListener('year-selected', handler);
    return () => window.removeEventListener('year-selected', handler);
  }, []);

  return (
    <>
      {!yearConfirmed && (
        <YearSelectionModal onYearSelected={() => setYearConfirmed(true)} />
      )}
      <RouterProvider router={router} />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppWithYearGate />
    </LanguageProvider>
  );
}
