import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { useAuth } from '../../context/AuthContext';

export type Tab = 'projects' | 'analytics' | 'settings' | 'contact-requests' | 'team';

export interface DashboardSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    closeSidebar: () => void;
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
    isTeam: boolean;
    myTeamStatus: { status: string | null; is_admin: boolean; job_title?: string | null } | null;
}

export function DashboardSidebar({
    sidebarOpen,
    setSidebarOpen,
    closeSidebar,
    activeTab,
    setActiveTab,
    isTeam,
    myTeamStatus,
}: DashboardSidebarProps) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <>
            {/* Hamburger - visible on mobile */}
            <button
                type="button"
                className="dashboard__menu-btn"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
            >
                <Icon name="menu" size={24} />
            </button>

            {/* Backdrop */}
            <div
                className={`dashboard__backdrop ${sidebarOpen ? 'dashboard__backdrop--open' : ''}`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <aside className={`dashboard__sidebar ${sidebarOpen ? 'dashboard__sidebar--open' : ''}`}>
                <button
                    type="button"
                    className="dashboard__sidebar-close"
                    onClick={closeSidebar}
                    aria-label="Close menu"
                >
                    <Icon name="close" size={20} />
                </button>
                <Link to="/" className="dashboard__brand">
                    <span className="dashboard__logo">ReverionTech</span>
                    <span className="dashboard__logo-badge">Dashboard</span>
                </Link>
                <div className="dashboard__profile">
                    <div className="dashboard__avatar">{initials}</div>
                    <div className="dashboard__profile-info">
                        <h3>{user?.name}</h3>
                        <p>{user?.email}</p>
                    </div>
                </div>

                <div className="dashboard__nav-scroll">
                    <nav className="dashboard__nav">
                        <button
                            className={`dashboard__nav-btn ${activeTab === 'projects' ? 'dashboard__nav-btn--active' : ''}`}
                            onClick={() => { setActiveTab('projects'); closeSidebar(); }}
                        >
                            <Icon name="dashboard" size={18} />
                            Projects
                        </button>
                        {isTeam && (
                            <>
                                <button
                                    className={`dashboard__nav-btn ${activeTab === 'analytics' ? 'dashboard__nav-btn--active' : ''}`}
                                    onClick={() => { setActiveTab('analytics'); closeSidebar(); }}
                                >
                                    <Icon name="chart" size={18} />
                                    Analytics
                                </button>
                                <button
                                    className={`dashboard__nav-btn ${activeTab === 'contact-requests' ? 'dashboard__nav-btn--active' : ''}`}
                                    onClick={() => { setActiveTab('contact-requests'); closeSidebar(); }}
                                >
                                    <Icon name="file" size={18} />
                                    Requests
                                </button>
                            </>
                        )}
                        {(myTeamStatus?.is_admin || myTeamStatus?.status === 'active') && (
                            <button
                                className={`dashboard__nav-btn ${activeTab === 'team' ? 'dashboard__nav-btn--active' : ''}`}
                                onClick={() => { setActiveTab('team'); closeSidebar(); }}
                            >
                                <Icon name="users" size={18} />
                                Team
                            </button>
                        )}
                        <button
                            className={`dashboard__nav-btn ${activeTab === 'settings' ? 'dashboard__nav-btn--active' : ''}`}
                            onClick={() => { setActiveTab('settings'); closeSidebar(); }}
                        >
                            <Icon name="settings" size={18} />
                            Settings
                        </button>
                    </nav>
                </div>

                <button
                    type="button"
                    className="dashboard__nav-btn dashboard__nav-btn--logout"
                    onClick={() => {
                        logout();
                        navigate('/');
                        closeSidebar();
                    }}
                >
                    <Icon name="logout" size={18} />
                    <span className="dashboard__nav-btn-text">Log out</span>
                </button>
            </aside>
        </>
    );
}
