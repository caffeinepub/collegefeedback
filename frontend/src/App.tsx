import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import ShareExperience from './pages/ShareExperience';
import PostDetail from './pages/PostDetail';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Wishlist from './pages/Wishlist';
import AvailableStudents from './pages/AvailableStudents';
import CommunityChat from './pages/CommunityChat';
import { ToastProvider } from './hooks/useToast';
import ToastContainer from './components/ToastContainer';
import { useEffect, useRef } from 'react';
import { playBubblePop } from './utils/sounds';

const queryClient = new QueryClient();

function RouteChangeSound() {
  const routerState = useRouterState();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = routerState.location.pathname;
    if (prevPathRef.current !== null && prevPathRef.current !== currentPath) {
      playBubblePop();
    }
    prevPathRef.current = currentPath;
  }, [routerState.location.pathname]);

  return null;
}

function AppShell() {
  return (
    <Layout>
      <RouteChangeSound />
      <Outlet />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: AppShell,
});

const homeRoute = createRoute({
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

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wishlist',
  component: Wishlist,
});

const availableStudentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/available-students',
  component: AvailableStudents,
});

const communityChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/community-chat',
  component: CommunityChat,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  shareRoute,
  postDetailRoute,
  dashboardRoute,
  aboutRoute,
  wishlistRoute,
  availableStudentsRoute,
  communityChatRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <RouterProvider router={router} />
          <ToastContainer />
          <Toaster />
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
