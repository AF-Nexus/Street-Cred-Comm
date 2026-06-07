import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { getAdminToken } from "@/lib/auth";
import { UserAuthProvider, useUserAuth } from "@/contexts/UserAuthContext";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import StoreHome from "@/pages/store-home";
import Shop from "@/pages/shop";
import ProductDetail from "@/pages/product";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import Login from "@/pages/login";
import Register from "@/pages/register";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

setBaseUrl(null);
setAuthTokenGetter(getAdminToken);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

/** Root "/" shows different page depending on login state */
function RootPage() {
  const { isLoggedIn } = useUserAuth();
  return isLoggedIn ? <StoreHome /> : <Home />;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <PublicLayout><RootPage /></PublicLayout>
      </Route>
      <Route path="/shop">
        <PublicLayout><Shop /></PublicLayout>
      </Route>
      <Route path="/product/:id">
        <PublicLayout><ProductDetail /></PublicLayout>
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route>
        <PublicLayout><NotFound /></PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserAuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </UserAuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
