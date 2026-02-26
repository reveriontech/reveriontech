import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { analyticsData } from '../data/dashboardData';
import type { DashboardProject, TeamMember } from '../types';
import { fetchProjects, createProject, postProjectUpdate } from '../lib/project';
import {
  fetchContactRequests,
  updateRequestStatus,
  clearAllContactRequests,
} from '../lib/contactRequests';
import { fetchTeamMembers, updateTeamMemberStatus, removeTeamMember } from '../lib/team';
import type { ContactRequest } from '../types';
import { updateProfile } from '../lib/profile';
import '../styles/dashboard.css';

type Tab = 'projects' | 'analytics' | 'settings' | 'contact-requests' | 'team';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('Settings saved successfully!');
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');

  // My Team Status
  const [myTeamStatus, setMyTeamStatus] = useState<{ status: string | null; is_admin: boolean; job_title?: string | null } | null>(null);

  useEffect(() => {
    import('../lib/team').then(m => {
      m.fetchMyTeamStatus().then((status) => {
        setMyTeamStatus(status);
        if (status.status) {
          setSettingsCompany('Reverion Technologies');
        }
        if (status.job_title) {
          setSettingsRole(status.job_title);
        }
      });
    });
  }, []);

  // Team
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState('');

  // Project data
  const [projects, setProjects] = useState<DashboardProject[]>([]);

  const loadProjects = useCallback(async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectId((prev) => prev || data[0].id);
      }
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'projects') {
      loadProjects();
    }
  }, [activeTab, loadProjects]);

  // Edit modal
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState<DashboardProject['status']>('active');

  // Update modal
  const [updatingProject, setUpdatingProject] = useState<string | null>(null);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [updateMilestones, setUpdateMilestones] = useState<{ label: string; date: string; done: boolean }[]>([]);
  const [updateDeliverables, setUpdateDeliverables] = useState<{ name: string; status: 'Delivered' | 'In Progress' | 'Pending' }[]>([]);
  const updateTextRef = useRef<HTMLTextAreaElement>(null);

  // Activity Center: selected project
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;

  // New project modal
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectClientEmail, setNewProjectClientEmail] = useState('');

  // Permissions: Reverion team vs client
  const isTeam = user?.role === 'team' || myTeamStatus?.status === 'active' || !!myTeamStatus?.is_admin;

  const openEditModal = (p: DashboardProject) => {
    setEditName(p.name);
    setEditStatus(p.status);
    setEditingProject(p.id);
  };

  const saveEdit = () => {
    if (!editingProject) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingProject ? { ...p, name: editName, status: editStatus } : p
      )
    );
    setEditingProject(null);
    setToastMsg('Project updated successfully!');
    showToast();
  };

  const openUpdateModal = (p: DashboardProject) => {
    setUpdateText('');
    setUpdateMilestones(p.milestones.map((m) => ({ ...m })));
    setUpdateDeliverables(p.deliverables.map((d) => ({ ...d })));
    setUpdatingProject(p.id);
    setTimeout(() => updateTextRef.current?.focus(), 50);
  };

  const saveUpdate = async () => {
    if (!updatingProject || !updateText.trim() || isSubmittingUpdate) return;
    setIsSubmittingUpdate(true);

    try {
      const msDone = updateMilestones.filter((m) => m.done).length;
      const msTotal = updateMilestones.length || 1;
      const dlDone = updateDeliverables.filter((d) => d.status === 'Delivered').length;
      const dlInProgress = updateDeliverables.filter((d) => d.status === 'In Progress').length;
      const dlTotal = updateDeliverables.length || 1;
      const autoProgress = Math.round(
        ((msDone / msTotal) * 50) + (((dlDone + dlInProgress * 0.5) / dlTotal) * 50)
      );

      await postProjectUpdate(updatingProject, {
        date: new Date().toISOString().slice(0, 10),
        phase_id: 1,
        content: updateText.trim(),
        author: isTeam ? 'developer' : 'client',
        author_name: user?.name || undefined,
        ...(isTeam && {
          milestones: updateMilestones,
          deliverables: updateDeliverables,
          progress: autoProgress
        })
      });

      // Reload projects to get the hydrated list from backend
      await loadProjects();

      setUpdatingProject(null);
      setToastMsg('Status update posted!');
      showToast();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to post update');
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  const closeModals = () => {
    setEditingProject(null);
    setUpdatingProject(null);
    setIsSubmittingUpdate(false);
    setShowNewProject(false);
  };

  const handleAddProject = async () => {
    if (!newProjectName.trim() || !newProjectClientEmail.trim()) return;
    try {
      const created = await createProject(newProjectName.trim(), newProjectClientEmail.trim());
      setProjects((prev) => [...prev, created]);
      setSelectedProjectId(created.id);

      setNewProjectName('');
      setNewProjectClientEmail('');
      setShowNewProject(false);

      setToastMsg('New project created!');
      showToast();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create project. Ensure email exists.');
    }
  };

  const handleProjectSelectChange = (value: string) => {
    if (value === '__new__') {
      setNewProjectName('');
      setShowNewProject(true);
    } else {
      setSelectedProjectId(value);
    }
  };

  const loadTeam = useCallback(async () => {
    setTeamLoading(true);
    setTeamError('');
    try {
      const data = await fetchTeamMembers();
      setTeam(data);
    } catch (err) {
      setTeamError(err instanceof Error ? err.message : 'Failed to load team data.');
    } finally {
      setTeamLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'team') {
      loadTeam();
    }
  }, [activeTab, loadTeam]);

  const approveApplicant = async (id: string) => {
    try {
      await updateTeamMemberStatus(id, 'active');
      setTeam((prev) => prev.map((m) => m.id === id ? { ...m, status: 'active' as const } : m));
      setToastMsg('Applicant approved!');
      showToast();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve');
    }
  };

  const rejectApplicant = async (id: string) => {
    try {
      await removeTeamMember(id);
      setTeam((prev) => prev.filter((m) => m.id !== id));
      setToastMsg('Applicant removed.');
      showToast();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject applicant');
    }
  };

  const deactivateMember = async (id: string) => {
    try {
      await updateTeamMemberStatus(id, 'inactive');
      setTeam((prev) => prev.map((m) => m.id === id ? { ...m, status: 'inactive' as const } : m));
      setToastMsg('Member deactivated.');
      showToast();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to deactivate member');
    }
  };

  const activateMember = async (id: string) => {
    try {
      await updateTeamMemberStatus(id, 'active');
      setTeam((prev) => prev.map((m) => m.id === id ? { ...m, status: 'active' as const } : m));
      setToastMsg('Member activated!');
      showToast();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to activate member');
    }
  };

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

  const loadRequests = useCallback(async () => {
    setRequestsLoading(true);
    setRequestsError('');
    try {
      const data = await fetchContactRequests();
      setContactRequests(data);
    } catch (err) {
      setRequestsError(err instanceof Error ? err.message : 'Failed to load requests.');
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'contact-requests') {
      loadRequests();
    }
  }, [activeTab, loadRequests]);

  const handleClearRequests = async () => {
    if (!confirm('Are you sure you want to clear all requests?')) return;
    try {
      await clearAllContactRequests();
      setContactRequests([]);
    } catch (err) {
      setRequestsError(err instanceof Error ? err.message : 'Failed to clear requests.');
    }
  };

  const handleStatusChange = async (id: string, status: ContactRequest['status']) => {
    try {
      await updateRequestStatus(id, status);
      setContactRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      setRequestsError(err instanceof Error ? err.message : 'Failed to update status.');
    }
  };

  const [settingsName, setSettingsName] = useState(user?.name || '');
  const [settingsEmail, setSettingsEmail] = useState(user?.email || '');
  const [settingsCompany, setSettingsCompany] = useState(user?.company || '');
  const [settingsPhone, setSettingsPhone] = useState(user?.phone ?? '');
  const [settingsRole, setSettingsRole] = useState(user?.role ?? '');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyProjects, setNotifyProjects] = useState(true);

  const showToast = useCallback(() => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }, []);



  // Close modals on Escape
  useEffect(() => {
    const handleModalEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModals();
    };
    if (editingProject || updatingProject) {
      document.addEventListener('keydown', handleModalEsc);
    }
    return () => document.removeEventListener('keydown', handleModalEsc);
  }, [editingProject, updatingProject]);

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
  const avgProgress = projects.length
    ? projects.reduce((a, p) => a + p.progress, 0) / projects.length
    : 0;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const tabTitles: Record<Tab, string> = {
    projects: 'Projects',
    analytics: 'Analytics',
    settings: 'Settings',
    'contact-requests': 'Contact Requests',
    team: 'Team',
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

      {/* Main */}
      <main className="dashboard__main">
        <header className="dashboard__page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <h1 className="dashboard__page-title">{tabTitles[activeTab]}</h1>
              <p className="dashboard__page-subtitle">
                {activeTab === 'projects' && 'Track and manage your active projects'}
                {activeTab === 'analytics' && 'View performance metrics and trends'}
                {activeTab === 'settings' && 'Update your profile and preferences'}
                {activeTab === 'contact-requests' && 'View submitted contact forms'}
                {activeTab === 'team' && 'Manage your team and review applicants'}
              </p>
            </div>
            {activeTab === 'contact-requests' && contactRequests.length > 0 && myTeamStatus?.is_admin && (
              <Button variant="outline" size="sm" onClick={handleClearRequests}>
                Clear All
              </Button>
            )}
          </div>
        </header>



        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="dashboard__content">
            <div className="dashboard__kpi-grid">
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{projects.length}</span>
                <span className="dashboard__kpi-label">Active Projects</span>
              </div>
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{Math.round(avgProgress)}%</span>
                <span className="dashboard__kpi-label">Avg. Progress</span>
              </div>
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{projects.filter((p) => p.status === 'review').length}</span>
                <span className="dashboard__kpi-label">In Review</span>
              </div>
            </div>

            {/* Project Selector – team only */}
            {isTeam && (
              <div className="dashboard__project-selector">
                <label htmlFor="project-select" className="dashboard__project-selector-label">Select Project</label>
                <select
                  id="project-select"
                  className="dashboard__activity-select"
                  value={selectedProjectId}
                  onChange={(e) => handleProjectSelectChange(e.target.value)}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                  <option value="__new__">+ Add New Project</option>
                </select>
              </div>
            )}

            {/* Selected Project Details */}
            {selectedProject && (
              <>
                <div className="dashboard__project">
                  <div className="dashboard__project-header">
                    <h3>{selectedProject.name}</h3>
                    <span className={`dashboard__status-badge dashboard__status-badge--${selectedProject.status}`}>
                      {selectedProject.status}
                    </span>
                  </div>
                  <div className="dashboard__progress">
                    <div className="dashboard__progress-header">
                      <span>Progress</span>
                      <span>{selectedProject.progress}%</span>
                    </div>
                    <div className="dashboard__progress-bar">
                      <div
                        className="dashboard__progress-fill"
                        style={{ width: `${selectedProject.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="dashboard__milestones">
                    <h4>Milestones</h4>
                    <div className="dashboard__timeline">
                      {selectedProject.milestones.map((ms) => (
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
                    {selectedProject.deliverables.map((d) => (
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

                {/* Actions & Activity */}
                <div className="dashboard__activity-center">
                  <div className="dashboard__activity-header">
                    <h3 className="dashboard__section-title">Activity</h3>
                    <div className="dashboard__activity-actions">
                      {isTeam ? (
                        <>
                          <button
                            type="button"
                            className="dashboard__activity-action-btn"
                            onClick={() => openUpdateModal(selectedProject)}
                          >
                            <Icon name="refresh" size={16} />
                            Post Update
                          </button>
                          <button
                            type="button"
                            className="dashboard__activity-action-btn"
                            onClick={() => openEditModal(selectedProject)}
                          >
                            <Icon name="edit" size={16} />
                            Edit Project
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="dashboard__activity-action-btn"
                          onClick={() => openUpdateModal(selectedProject)}
                        >
                          <Icon name="refresh" size={16} />
                          Send Feedback
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="dashboard__activity-feed">
                    {selectedProject.dailyUpdates && selectedProject.dailyUpdates.length > 0 ? (
                      selectedProject.dailyUpdates
                        .slice()
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((update) => (
                          <div key={update.id} className="dashboard__activity-item">
                            <div className="dashboard__activity-item-header">
                              <span className={`dashboard__activity-author dashboard__activity-author--${update.author}`}>
                                {update.author === 'developer'
                                  ? `${update.authorName || 'Reverion Team'} (Dev)`
                                  : `${update.authorName || 'Client'} (Client)`}
                              </span>
                              <span className="dashboard__activity-date">
                                {new Date(update.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <p className="dashboard__activity-content">{update.content}</p>
                          </div>
                        ))
                    ) : (
                      <p className="dashboard__empty">No activity yet for this project.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Contact Requests Tab */}
        {activeTab === 'contact-requests' && (
          <div className="dashboard__content">
            <div className="dashboard__section">
              {requestsLoading ? (
                <p className="dashboard__empty">Loading requests…</p>
              ) : requestsError ? (
                <p className="dashboard__empty dashboard__empty--error">{requestsError}</p>
              ) : contactRequests.length === 0 ? (
                <p className="dashboard__empty">No contact requests yet.</p>
              ) : (
                <div className="dashboard__table-wrapper">
                  <table className="dashboard__table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Service Interest</th>
                        <th>Budget Range</th>
                        <th>Timeline</th>
                        <th>Project Description</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactRequests.map((req) => (
                        <tr key={req.id}>
                          <td>
                            <strong>{req.name}</strong>
                          </td>
                          <td>{req.email}</td>
                          <td>
                            <span className={`dashboard__table-company ${!req.company ? 'empty' : ''}`}>
                              {req.company || '-'}
                            </span>
                          </td>
                          <td>{req.service}</td>
                          <td>{req.budget}</td>
                          <td>{req.timeline}</td>
                          <td>
                            <p className="dashboard__table-desc">
                              {req.description}
                            </p>
                          </td>
                          <td className="dashboard__table-date">
                            {new Date(req.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td>
                            <select
                              className={`dashboard__status-select dashboard__status-select--${req.status}`}
                              value={req.status}
                              onChange={(e) =>
                                handleStatusChange(req.id, e.target.value as ContactRequest['status'])
                              }
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="contacted">Contacted</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="dashboard__content">
            <div className="dashboard__kpi-grid">
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{team.filter((m) => m.status === 'active').length}</span>
                <span className="dashboard__kpi-label">Active Members</span>
              </div>
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{team.filter((m) => m.status === 'applicant').length}</span>
                <span className="dashboard__kpi-label">Pending Applicants</span>
              </div>
              <div className="dashboard__kpi">
                <span className="dashboard__kpi-value">{team.length}</span>
                <span className="dashboard__kpi-label">Total</span>
              </div>
            </div>

            {teamLoading ? (
              <div className="dashboard__section">
                <p className="dashboard__empty">Loading team members…</p>
              </div>
            ) : teamError ? (
              <div className="dashboard__section">
                <p className="dashboard__empty dashboard__empty--error">{teamError}</p>
              </div>
            ) : (
              <>
                {/* Applicants */}
                {myTeamStatus?.is_admin && team.filter((m) => m.status === 'applicant').length > 0 && (
                  <div className="dashboard__section">
                    <h3 className="dashboard__section-title">Pending Applicants</h3>
                    <div className="dashboard__table-wrapper">
                      <table className="dashboard__table">
                        <thead>
                          <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Job Title</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {team.filter((m) => m.status === 'applicant').map((member) => (
                            <tr key={member.id}>
                              <td><strong>{member.name}</strong></td>
                              <td>{member.email}</td>
                              <td>{member.jobTitle}</td>
                              <td>
                                <div className="dashboard__team-actions">
                                  <Button size="sm" onClick={() => approveApplicant(member.id)}>Approve</Button>
                                  <Button variant="ghost" size="sm" onClick={() => rejectApplicant(member.id)}>Reject</Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Employees */}
                <div className="dashboard__section">
                  <h3 className="dashboard__section-title">Employees</h3>
                  <div className="dashboard__table-wrapper">
                    <table className="dashboard__table">
                      <thead>
                        <tr>
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Job Title</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.filter((m) => m.status !== 'applicant').map((member) => (
                          <tr key={member.id}>
                            <td><strong>{member.name}</strong></td>
                            <td>{member.email}</td>
                            <td>{member.jobTitle}</td>
                            <td>
                              {myTeamStatus?.is_admin ? (
                                <div className="dashboard__team-status-cell">
                                  <span className={`dashboard__team-badge dashboard__team-badge--${member.status}`}>
                                    {member.status}
                                  </span>
                                  {member.status === 'active' ? (
                                    <button
                                      type="button"
                                      className="dashboard__team-toggle"
                                      title="Deactivate"
                                      onClick={() => deactivateMember(member.id)}
                                    >
                                      <Icon name="close" size={14} />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="dashboard__team-toggle dashboard__team-toggle--activate"
                                      title="Activate"
                                      onClick={() => activateMember(member.id)}
                                    >
                                      <Icon name="check" size={14} />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className={`dashboard__team-badge dashboard__team-badge--${member.status}`}>
                                  {member.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
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
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await updateProfile({
                    name: settingsName,
                    email: settingsEmail,
                    company: settingsCompany,
                    phone: settingsPhone,
                    role: settingsRole,
                  });
                  setToastMsg('Profile updated successfully!');
                  showToast();
                } catch (err) {
                  setToastMsg(err instanceof Error ? err.message : 'Failed to update profile');
                  showToast();
                }
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
                      {myTeamStatus?.status && (
                        <span className={`dashboard__team-badge dashboard__team-badge--${myTeamStatus.status}`} style={{ marginLeft: '8px', fontSize: '0.6rem' }}>
                          {myTeamStatus.status === 'active' ? 'Approved' : myTeamStatus.status === 'applicant' ? 'Pending Approval' : 'Inactive'}
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

              {/* Submit */}
              <Button type="submit">Save Changes</Button>
            </form>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingProject && (
        <>
          <div className="dashboard__modal-backdrop" onClick={closeModals} />
          <div className="dashboard__modal" role="dialog" aria-label="Edit project">
            <div className="dashboard__modal-header">
              <h3>Edit Project</h3>
              <button type="button" className="dashboard__modal-close" onClick={closeModals}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="dashboard__modal-body">
              <div className="dashboard__settings-field">
                <label htmlFor="edit-name">Project Name</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="dashboard__settings-field">
                <label htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as DashboardProject['status'])}
                >
                  <option value="active">Active</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="dashboard__modal-footer">
              <Button variant="ghost" size="sm" onClick={closeModals}>Cancel</Button>
              <Button size="sm" onClick={saveEdit}>Save Changes</Button>
            </div>
          </div>
        </>
      )}

      {/* Update Modal */}
      {updatingProject && (
        <>
          <div className="dashboard__modal-backdrop" onClick={closeModals} />
          <div className="dashboard__modal dashboard__modal--wide" role="dialog" aria-label="Post update">
            <div className="dashboard__modal-header">
              <h3>{isTeam ? 'Post Status Update' : 'Send Feedback'}</h3>
              <button type="button" className="dashboard__modal-close" onClick={closeModals}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="dashboard__modal-body">
              {/* Activity note */}
              <div className="dashboard__settings-field">
                <label htmlFor="update-text">{isTeam ? "What's the latest?" : 'Share your feedback'}</label>
                <textarea
                  ref={updateTextRef}
                  id="update-text"
                  rows={3}
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  placeholder={
                    isTeam
                      ? 'e.g. Completed homepage build. Moving to product pages…'
                      : 'e.g. Homepage looks great. Please adjust the hero text and CTA spacing.'
                  }
                />
              </div>

              {/* Milestones & Deliverables – only editable by team */}
              {isTeam && (
                <>
                  {/* Milestones */}
                  <div className="dashboard__update-section">
                    <h4 className="dashboard__update-section-title">Milestones</h4>
                    <div className="dashboard__update-checklist">
                      {updateMilestones.map((ms, i) => (
                        <label key={ms.label} className="dashboard__update-check-row">
                          <input
                            type="checkbox"
                            checked={ms.done}
                            onChange={() =>
                              setUpdateMilestones((prev) =>
                                prev.map((m, idx) => (idx === i ? { ...m, done: !m.done } : m))
                              )
                            }
                          />
                          <span className={ms.done ? 'dashboard__update-check-done' : ''}>{ms.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="dashboard__update-section">
                    <h4 className="dashboard__update-section-title">Deliverables</h4>
                    <div className="dashboard__update-deliverables">
                      {updateDeliverables.map((d, i) => (
                        <div key={d.name} className="dashboard__update-deliverable-row">
                          <span>{d.name}</span>
                          <select
                            value={d.status}
                            onChange={(e) =>
                              setUpdateDeliverables((prev) =>
                                prev.map((item, idx) =>
                                  idx === i ? { ...item, status: e.target.value as typeof d.status } : item
                                )
                              )
                            }
                            className="dashboard__update-deliverable-select"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="dashboard__modal-footer">
              <Button variant="ghost" size="sm" onClick={closeModals} disabled={isSubmittingUpdate}>Cancel</Button>
              <Button size="sm" onClick={saveUpdate} disabled={!updateText.trim() || isSubmittingUpdate}>
                {isSubmittingUpdate ? 'Sending...' : (isTeam ? 'Post Update' : 'Send Feedback')}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* New Project Modal – only for team users */}
      {isTeam && showNewProject && (
        <>
          <div className="dashboard__modal-backdrop" onClick={closeModals} />
          <div className="dashboard__modal" role="dialog" aria-label="Add new project">
            <div className="dashboard__modal-header">
              <h3>Add New Project</h3>
              <button type="button" className="dashboard__modal-close" onClick={closeModals}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="dashboard__modal-body">
              <div className="dashboard__settings-field">
                <label htmlFor="new-project-name">Project Name</label>
                <input
                  id="new-project-name"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Website Redesign"
                  autoFocus
                />
              </div>
              <div className="dashboard__settings-field" style={{ marginTop: '1rem' }}>
                <label htmlFor="new-project-client-email">Client Email Address</label>
                <input
                  id="new-project-client-email"
                  type="email"
                  value={newProjectClientEmail}
                  onChange={(e) => setNewProjectClientEmail(e.target.value)}
                  placeholder="client@client.com"
                />
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>The exact email address the client uses to log into ReverionTech.</p>
              </div>
            </div>
            <div className="dashboard__modal-footer">
              <Button variant="ghost" size="sm" onClick={closeModals}>Cancel</Button>
              <Button size="sm" onClick={handleAddProject} disabled={!newProjectName.trim() || !newProjectClientEmail.trim()}>Create Project</Button>
            </div>
          </div>
        </>
      )}

      {toast && (
        <div className="dashboard__toast" role="status">
          <Icon name="check" size={18} />
          {toastMsg}
        </div>
      )}
    </div>
  );
}
