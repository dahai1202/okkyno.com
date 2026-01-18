import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import LoginPage from "@/pages/LoginPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import FAQPage from "@/pages/FAQPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import ShippingPolicyPage from "@/pages/ShippingPolicyPage";
import ReturnPolicyPage from "@/pages/ReturnPolicyPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminProductsPage from "@/pages/AdminProductsPage";
import AdminProductsListPage from "@/pages/AdminProductsListPage";
import AdminBlogsPage from "@/pages/AdminBlogsPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import AdminCustomersPage from "@/pages/AdminCustomersPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import AdminDataManagerPage from "./pages/AdminDataManagerPage";
import AdminContentPage from "@/pages/AdminContentPage";
import AccountPage from "@/pages/AccountPage";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PromotionalPopup from "@/components/PromotionalPopup";
import { useAuth } from "@/context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";
import { useLocation } from "wouter";

// Component to handle scroll to top on route changes
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  const { user } = useAuth();
  const isAdmin = user && user.role === "admin";

  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/category/:slug" component={ProductsPage} />
      <Route path="/category/:slug" component={ProductsPage} />
      <Route path="/products/:slug" component={ProductDetailPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route path="/shipping-policy" component={ShippingPolicyPage} />
      <Route path="/return-policy" component={ReturnPolicyPage} />

      {/* Admin routes - AdminLayout handles access control */}
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/admin/products" component={AdminProductsListPage} />
      <Route path="/admin/products/add" component={AdminProductsPage} />
      <Route path="/admin/products/edit/:id" component={AdminProductsPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/customers" component={AdminCustomersPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route path="/admin/data-manager" component={AdminDataManagerPage} />
      <Route path="/admin/blog" component={AdminBlogsPage} />
      <Route path="/admin/blog/new" component={AdminBlogsPage} />
      <Route path="/admin/blog/edit/:id" component={AdminBlogsPage} />
      <Route path="/admin/content" component={AdminContentPage} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

// This App function is not used directly anymore - see main.tsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <SearchProvider>
            <Header />
            <Router />
            <Footer />
            <PromotionalPopup />
            <Toaster />
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;