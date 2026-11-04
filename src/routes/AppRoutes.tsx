import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { ChatProvider } from '../context/ChatContext';
import { GlobalChatOverlay } from '../components/Chatbot/GlobalChatOverlay';
import { LandingPage } from '../pages/LandingPage';
import { AuthPage } from '../pages/AuthPage';
import { AuthCallbackPage } from '../pages/AuthCallbackPage';
import { UpdatePasswordPage } from '../pages/UpdatePasswordPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ContactPage } from '../pages/ContactPage';
import { ServicesPage } from '../pages/ServicesPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { InsightsPage } from '../pages/InsightsPage';
import { OurTeamPage } from '../pages/OurTeamPage';
import { AboutPage } from '../pages/AboutPage';
import { PartnershipPage } from '../pages/PartnershipPage';
import { SolutionsPage } from '../pages/SolutionsPage';
import { TermsPage } from '../pages/TermsPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TeamPage } from '../pages/TeamPage';
import { CertificatePage } from '../pages/Certificate';

function AppRoutes() {
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';
    const isAuthCallback = location.pathname === '/auth/callback';

    return (
        <ThemeProvider>
            <AuthProvider>
                <ChatProvider>
                    <ScrollToTop />
                    {!isDashboard && !isAuthCallback && <Header />}
                    <main>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/auth/callback" element={<AuthCallbackPage />} />
                            <Route path="/update-password" element={<UpdatePasswordPage />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/services" element={<ServicesPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                            <Route path="/insights" element={<InsightsPage />} />
                            <Route path="/case-studies" element={<Navigate to="/projects" replace />} />
                            <Route path="/portfolio" element={<Navigate to="/projects" replace />} />
                            <Route path="/solutions" element={<SolutionsPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/our-team" element={<OurTeamPage />} />
                            <Route path="/partners" element={<PartnershipPage />} />
                            <Route path="/team" element={<TeamPage />} />
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="/privacy" element={<PrivacyPage />} />
                            <Route path="/cert/:certId" element={<CertificatePage />} />
                        </Routes>
                    </main>
                    <GlobalChatOverlay />
                    {!isDashboard && !isAuthCallback && <Footer />}
                </ChatProvider>
            </AuthProvider>
        </ThemeProvider >
    );
}

export default AppRoutes;
