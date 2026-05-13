import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { TableOrdersProvider } from "@/lib/table-orders-context";
import Navbar from "@/components/Navbar";
import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Reservation from "@/pages/reservation";
import Orders from "@/pages/orders";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Cart from "@/pages/cart";
import Admin from "@/pages/admin";
import Waiter from "@/pages/waiter";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/reservation" component={Reservation} />
        <Route path="/orders" component={Orders} />
        <Route path="/profile" component={Profile} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/cart" component={Cart} />
        <Route path="/admin" component={Admin} />
        <Route path="/waiter" component={Waiter} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TableOrdersProvider>
          <CartProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </CartProvider>
        </TableOrdersProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
