import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchProvider } from './contexts/SearchContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { NotificationProvider } from './contexts/NotificationContext'; // <-- ADD THIS
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import FloatingThemeToggle from './components/common/FloatingThemeToggle';
import Toast from './components/common/Toast';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AreaGuides from './pages/AreaGuides';
import MarketInsights from './pages/MarketInsights';
import Contact from './pages/Contact';
import AgentProfile from './pages/AgentProfile';
import ListProperty from './pages/ListProperty';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import VerifyEmail from './pages/VerifyEmail';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// Toast wrapper component
const ToastWrapper = () => {
  const { toast, clearToast } = useAuth();
  if (!toast) return null;
  
  return (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={clearToast}
    />
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <NotificationProvider> {/* <-- ADD THIS */}
            <FavoritesProvider>
              <SearchProvider>
                <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                  <Navbar />
                  <ToastWrapper />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/properties" element={<Properties />} />
                      <Route path="/property/:id" element={<PropertyDetails />} />
                      <Route path="/area-guides" element={<AreaGuides />} />
                      <Route path="/market-insights" element={<MarketInsights />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/agent/:id" element={<AgentProfile />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/verify-email" element={<VerifyEmail />} />
                      <Route path="/list-property" element={<ListProperty />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                    </Routes>
                  </main>
                  <Footer />
                  <FloatingThemeToggle />
                </div>
              </SearchProvider>
            </FavoritesProvider>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;