import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { LandingPage } from '../pages/LandingPage';
import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ContactPage } from '../pages/ContactPage';
import { CaseStudiesPage } from '../pages/CaseStudiesPage';
import { PortfolioPage } from '../pages/PortfolioPage';
import { AboutPage } from '../pages/AboutPage';
import { PartnershipPage } from '../pages/PartnershipPage';
import { SolutionsPage } from '../pages/SolutionsPage';

function AppRoutes() {
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';

    return (
        <ThemeProvider>
            <AuthProvider>
                <ScrollToTop />
                {!isDashboard && <Header />}
                <main>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/case-studies" element={<CaseStudiesPage />} />
                        <Route path="/portfolio" element={<PortfolioPage />} />
                        <Route path="/solutions" element={<SolutionsPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/partners" element={<PartnershipPage />} />
                    </Routes>
                </main>
                {!isDashboard && <Footer />}
            </AuthProvider>
        </ThemeProvider>
    );
}

export default AppRoutes;
