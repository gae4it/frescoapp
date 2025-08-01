import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/layout/Navbar";
import BottomNav from "./components/layout/BottomNav"; // Added import
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import NotFound from "./pages/not-found";

function Router() {
  const base = import.meta.env.BASE_URL;
  return (
    <Switch>
      <Route path={`${base}`} component={HomePage} />
      <Route path={`${base}category/:category`} component={CategoryPage} />
      <Route path={`${base}product/:category/:id`} component={ProductPage} />
      <Route path={`${base}cart`} component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/order-confirmation" component={OrderConfirmationPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8 pb-24">
            {" "}
            {/* Added pb-24 */}
            <Router />
          </main>
          <BottomNav /> {/* Added BottomNav */}
        </div>
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
