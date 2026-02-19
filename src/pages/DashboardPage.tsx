import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { dashboardProjects, onboardingChecklist, analyticsData } from '../data/dashboardData';
import '../styles/dashboard.css';

type Tab = 'projects' | 'analytics' | 'settings';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && closeSidebar();
    if (sidebarOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const [settingsName, setSettingsName] = useState(user?.name || '');
  const [settingsEmail, setSettingsEmail] = useState(user?.email || '');
  const [settingsCompany, setSettingsCompany] = useState(user?.company || '');
  const [settingsPhone, setSettingsPhone] = useState(user?.phone ?? '');
  const [settingsRole, setSettingsRole] = useState(user?.role ?? '');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyProjects, setNotifyProjects] = useState(true);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const hasIncomplete = onboardingChecklist.some((item) => !item.done);

  const lineChartData = useMemo(
    () => [
      {
        id: 'Total Tasks',
        data: analyticsData.map((d) => ({ x: d.month, y: d.tasks })),
      },
      {
        id: 'Completed',
        data: analyticsData.map((d) => ({ x: d.month, y: d.completed })),
      },
    ],
    []
  );

  const totalTasks = analyticsData.reduce((a, d) => a + d.tasks, 0);
  const totalCompleted = analyticsData.reduce((a, d) => a + d.completed, 0);
  const avgProgress = dashboardProjects.length
    ? dashboardProjects.reduce((a, p) => a + p.progress, 0) / dashboardProjects.length
    : 0;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const tabTitles: Record<Tab, string> = {
    projects: 'Projects',
    analytics: 'Analytics',
    settings: 'Settings',
  };

  return (
    <div className="dashboard">
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
            <button
              className={`dashboard__nav-btn ${activeTab === 'analytics' ? 'dashboard__nav-btn--active' : ''}`}
              onClick={() => { setActiveTab('analytics'); closeSidebar(); }}
            >
              <Icon name="chart" size={18} />
              Analytics
            </button>
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

      {/* Main */}
      <main className="dashboard__main">
        <header className="dashboard__page-header">
          <div>
            <h1 className="dashboard__page-title">{tabTitles[activeTab]}</h1>
            <p className="dashboard__page-subtitle">
              {activeTab === 'projects' && 'Track and manage your active projects'}
              {activeTab === 'analytics' && 'View performance metrics and trends'}
              {activeTab === 'settings' && 'Update your profile and preferences'}
            </p>
          </div>
        </header>

        {/* Onboarding */}
        {hasIncomplete && activeTab === 'projects' && (
          <div className="dashboard__onboarding">
            <div className="dashboard__onboarding-header">
              <h3>Onboarding Checklist</h3>
              <span className="dashboard__onboarding-progress">
                {onboardingChecklist.filter((i) => i.done).length}/{onboardingChecklist.length} complete
              </span>
            </div>
            <div className="dashboard__onboarding-bar">
              <div
                className="dashboard__onboarding-bar-fill"
                style={{ width: `${(onboardingChecklist.filter((i) => i.done).length / onboardingChecklist.length) * 100}%` }}
              />
            </div>
            <ul className="dashboard__checklist">
              {onboardingChecklist.map((item) => (
                <li
                  key={item.step}
                  className={`dashboard__checklist-item ${item.done ? 'dashboard__checklist-item--done' : ''}`}
                >
                  <div className={`dashboard__check-box ${item.done ? 'dashboard__check-box--done' : ''}`}>
                    {item.done && <Icon name="check" size={12} />}
                  </div>
                  {item.step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="dashboard__content">
            <div className="dashboard__kpi-grid">
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{dashboardProjects.length}</span>
                <span className="dashboard__kpi-label">Active Projects</span>
              </div>
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{Math.round(avgProgress)}%</span>
                <span className="dashboard__kpi-label">Avg. Progress</span>
              </div>
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{dashboardProjects.filter((p) => p.status === 'review').length}</span>
                <span className="dashboard__kpi-label">In Review</span>
              </div>
            </div>
            <div className="dashboard__projects">
              {dashboardProjects.map((project) => (
                <div key={project.id} className="dashboard__project">
                  <div className="dashboard__project-header">
                    <h3>{project.name}</h3>
                    <span className={`dashboard__status-badge dashboard__status-badge--${project.status}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="dashboard__progress">
                    <div className="dashboard__progress-header">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="dashboard__progress-bar">
                      <div
                        className="dashboard__progress-fill"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="dashboard__milestones">
                    <h4>Milestones</h4>
                    <div className="dashboard__timeline">
                      {project.milestones.map((ms) => (
                        <div
                          key={ms.label}
                          className={`dashboard__milestone ${ms.done ? 'dashboard__milestone--done' : ''}`}
                        >
                          <span className="dashboard__milestone-label">{ms.label}</span>
                          <span className="dashboard__milestone-date">{ms.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="dashboard__deliverables">
                    <h4>Deliverables</h4>
                    {project.deliverables.map((d) => (
                      <div key={d.name} className="dashboard__deliverable">
                        <span>{d.name}</span>
                        <span
                          className={`dashboard__deliverable-status dashboard__deliverable-status--${d.status.toLowerCase().replace(' ', '-')}`}
                        >
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="dashboard__content">
            <div className="dashboard__kpi-grid">
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{totalTasks}</span>
                <span className="dashboard__kpi-label">Total Tasks</span>
              </div>
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{totalCompleted}</span>
                <span className="dashboard__kpi-label">Completed</span>
              </div>
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{totalTasks ? Math.round((totalCompleted / totalTasks) * 100) : 0}%</span>
                <span className="dashboard__kpi-label">Completion Rate</span>
              </div>
            </div>
            <div className="dashboard__analytics">
              <h3 className="dashboard__section-title">Monthly Overview</h3>
              <div className="dashboard__chart-line">
                <ResponsiveLine
                  data={lineChartData}
                  margin={{ top: 20, right: 20, bottom: 70, left: 50 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false }}
                  curve="monotoneX"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 0,
                    tickPadding: 10,
                    tickRotation: 0,
                    legendOffset: 36,
                  }}
                  axisLeft={{
                    tickSize: 0,
                    tickPadding: 10,
                    tickRotation: 0,
                    legendOffset: -40,
                  }}
                  colors={['var(--color-border-hover)', 'var(--color-accent)']}
                  lineWidth={2}
                  pointSize={8}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  pointLabelYOffset={-12}
                  enableArea={true}
                  areaOpacity={0.15}
                  useMesh={true}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 48,
                      itemsSpacing: 0,
                      itemDirection: 'left-to-right',
                      itemWidth: 100,
                      itemHeight: 20,
                      itemOpacity: 1,
                      symbolSize: 10,
                      symbolShape: 'circle',
                    },
                  ]}
                  theme={{
                    text: { fill: 'var(--color-text-muted)', fontSize: 12 },
                    axis: { ticks: { text: { fill: 'var(--color-text-muted)' } } },
                    grid: { line: { stroke: 'var(--color-border)', strokeWidth: 1 } },
                    legends: { text: { fill: 'var(--color-text-muted)' } },
                    crosshair: { line: { stroke: 'var(--color-accent)' } },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="dashboard__content dashboard__content--settings">
            <form
              className="dashboard__settings-form"
              onSubmit={(e) => {
                e.preventDefault();
                showToast();
              }}
            >
              {/* Profile */}
              <div className="dashboard__settings-card">
                <h3 className="dashboard__section-title">Profile</h3>
                <div className="dashboard__settings-grid">
                  <div className="dashboard__settings-field">
                    <label htmlFor="settings-name">Full Name</label>
                    <input
                      id="settings-name"
                      type="text"
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="dashboard__settings-field">
                    <label htmlFor="settings-email">Email</label>
                    <input
                      id="settings-email"
                      type="email"
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      placeholder="john@company.com"
                    />
                  </div>
                  <div className="dashboard__settings-field">
                    <label htmlFor="settings-phone">Phone</label>
                    <input
                      id="settings-phone"
                      type="tel"
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="dashboard__settings-field">
                    <label htmlFor="settings-company">
                      Company
                      {settingsCompany === 'Reverion Technologies' && (
                        <span className="dashboard__status-badge dashboard__status-badge--pending" style={{ marginLeft: '8px', fontSize: '0.6rem' }}>
                          Pending Approval
                        </span>
                      )}
                    </label>
                    <select
                      id="settings-company"
                      value={settingsCompany}
                      onChange={(e) => setSettingsCompany(e.target.value)}
                    >
                      <option value="" disabled>Select your company</option>
                      <option value="Reverion Technologies">Reverion Technologies</option>
                    </select>
                  </div>
                  <div className="dashboard__settings-field">
                    <label htmlFor="settings-role">Job Title / Role</label>
                    <input
                      id="settings-role"
                      type="text"
                      value={settingsRole}
                      onChange={(e) => setSettingsRole(e.target.value)}
                      placeholder="Project Manager"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="dashboard__settings-card">
                <h3 className="dashboard__section-title">Preferences</h3>
                <div className="dashboard__settings-row">
                  <div>
                    <span className="dashboard__settings-row-label">Theme</span>
                    <span className="dashboard__settings-row-desc">Choose light or dark mode</span>
                  </div>
                  <button
                    type="button"
                    className={`dashboard__settings-switch ${theme === 'dark' ? 'dashboard__settings-switch--on' : ''}`}
                    onClick={toggleTheme}
                    aria-pressed={theme === 'dark'}
                    aria-label="Toggle theme"
                    role="switch"
                  />
                </div>
              </div>

              {/* Notifications */}
              <div className="dashboard__settings-card">
                <h3 className="dashboard__section-title">Notifications</h3>
                <div className="dashboard__settings-row">
                  <div>
                    <span className="dashboard__settings-row-label">Email notifications</span>
                    <span className="dashboard__settings-row-desc">Receive updates and announcements</span>
                  </div>
                  <button
                    type="button"
                    className={`dashboard__settings-switch ${notifyEmail ? 'dashboard__settings-switch--on' : ''}`}
                    onClick={() => setNotifyEmail(!notifyEmail)}
                    aria-pressed={notifyEmail}
                    role="switch"
                  />
                </div>
                <div className="dashboard__settings-row">
                  <div>
                    <span className="dashboard__settings-row-label">Project updates</span>
                    <span className="dashboard__settings-row-desc">Get notified when project status changes</span>
                  </div>
                  <button
                    type="button"
                    className={`dashboard__settings-switch ${notifyProjects ? 'dashboard__settings-switch--on' : ''}`}
                    onClick={() => setNotifyProjects(!notifyProjects)}
                    aria-pressed={notifyProjects}
                    role="switch"
                  />
                </div>
              </div>

              {/* Security */}
              <div className="dashboard__settings-card">
                <h3 className="dashboard__section-title">Security</h3>
                <div className="dashboard__settings-row dashboard__settings-row--action">
                  <div>
                    <span className="dashboard__settings-row-label">Password</span>
                    <span className="dashboard__settings-row-desc">Last changed 30 days ago</span>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={showToast}>
                    Change password
                  </Button>
                </div>
              </div>

              <Button type="submit">Save Changes</Button>
            </form>
          </div>
        )}
      </main>

      {toast && (
        <div className="dashboard__toast" role="status">
          <Icon name="check" size={18} />
          Settings saved successfully!
        </div>
      )}
    </div>
  );
}
