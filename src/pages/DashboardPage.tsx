import { useState, useMemo, useEffect, useCallback, useRef } from 'react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { analyticsData } from '../data/dashboardData';
import type { DashboardProject, TeamMember, ContactRequest } from '../types';
import { fetchProjects, createProject, postProjectUpdate } from '../lib/project';
import {
  fetchContactRequests,
  updateRequestStatus,
  clearAllContactRequests,
} from '../lib/contactRequests';
import { fetchTeamMembers, updateTeamMemberStatus, removeTeamMember } from '../lib/team';
import '../styles/dashboard.css';

import { DashboardSidebar, type Tab } from '../components/dashboard/DashboardSidebar';
import { ProjectsTab } from '../components/dashboard/tabs/ProjectsTab';
import { AnalyticsTab } from '../components/dashboard/tabs/AnalyticsTab';
import { RequestsTab } from '../components/dashboard/tabs/RequestsTab';
import { TeamTab } from '../components/dashboard/tabs/TeamTab';
import { SettingsTab } from '../components/dashboard/tabs/SettingsTab';
import { ProjectEditModal } from '../components/dashboard/modals/ProjectEditModal';
import { ProjectUpdateModal } from '../components/dashboard/modals/ProjectUpdateModal';
import { NewProjectModal } from '../components/dashboard/modals/NewProjectModal';

export function DashboardPage() {

  const { user } = useAuth();
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

  const teamImages = ['/team/team11.jpg', '/team/team22.jpg', '/team/team33.jpg', '/team/team44.jpg', '/team/team55.jpg', '/team/team66.jpg'];
  const getTeamImage = (index: number) => teamImages[index % teamImages.length];

  const [teamSliderIndex, setTeamSliderIndex] = useState(0);
  const teamSliderRef = useRef<HTMLDivElement>(null);
  const teamEmployees = team.filter((m) => m.status !== 'applicant');
  const teamSliderPrev = () => setTeamSliderIndex((i) => (i - 1 + teamEmployees.length) % Math.max(1, teamEmployees.length));
  const teamSliderNext = () => setTeamSliderIndex((i) => (i + 1) % Math.max(1, teamEmployees.length));

  useEffect(() => {
    setTeamSliderIndex((i) => (teamEmployees.length > 0 ? Math.min(i, teamEmployees.length - 1) : 0));
  }, [teamEmployees.length]);

  useEffect(() => {
    const el = teamSliderRef.current;
    if (!el || teamEmployees.length === 0) return;
    const card = el.children[teamSliderIndex] as HTMLElement;
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [teamSliderIndex, teamEmployees.length]);

  const tabTitles: Record<Tab, string> = {
    projects: 'Projects',
    analytics: 'Analytics',
    settings: 'Settings',
    'contact-requests': 'Contact Requests',
    team: 'Team',
  };

  return (
    <div className="dashboard">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        closeSidebar={closeSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isTeam={isTeam}
        myTeamStatus={myTeamStatus}
      />

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

        {activeTab === 'projects' && (
          <ProjectsTab
            projects={projects}
            avgProgress={avgProgress}
            isTeam={isTeam}
            selectedProjectId={selectedProjectId}
            handleProjectSelectChange={handleProjectSelectChange}
            selectedProject={selectedProject}
            openUpdateModal={openUpdateModal}
            openEditModal={openEditModal}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab
            totalTasks={totalTasks}
            totalCompleted={totalCompleted}
            lineChartData={lineChartData}
          />
        )}

        {activeTab === 'contact-requests' && (
          <RequestsTab
            requestsLoading={requestsLoading}
            requestsError={requestsError}
            contactRequests={contactRequests}
            handleStatusChange={handleStatusChange}
          />
        )}

        {activeTab === 'team' && (
          <TeamTab
            team={team}
            teamLoading={teamLoading}
            teamError={teamError}
            myTeamStatus={myTeamStatus}
            approveApplicant={approveApplicant}
            rejectApplicant={rejectApplicant}
            teamEmployees={teamEmployees}
            teamSliderPrev={teamSliderPrev}
            teamSliderNext={teamSliderNext}
            teamSliderRef={teamSliderRef}
            getTeamImage={getTeamImage}
            teamSliderIndex={teamSliderIndex}
            setTeamSliderIndex={setTeamSliderIndex}
            deactivateMember={deactivateMember}
            activateMember={activateMember}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            theme={theme}
            toggleTheme={toggleTheme}
            settingsName={settingsName}
            setSettingsName={setSettingsName}
            settingsEmail={settingsEmail}
            setSettingsEmail={setSettingsEmail}
            settingsCompany={settingsCompany}
            setSettingsCompany={setSettingsCompany}
            settingsPhone={settingsPhone}
            setSettingsPhone={setSettingsPhone}
            settingsRole={settingsRole}
            setSettingsRole={setSettingsRole}
            notifyEmail={notifyEmail}
            setNotifyEmail={setNotifyEmail}
            notifyProjects={notifyProjects}
            setNotifyProjects={setNotifyProjects}
            myTeamStatus={myTeamStatus}
            setToastMsg={setToastMsg}
            showToast={showToast}
          />
        )}
      </main>

      <ProjectEditModal
        editingProject={editingProject}
        editName={editName}
        setEditName={setEditName}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        closeModals={closeModals}
        saveEdit={saveEdit}
      />

      <ProjectUpdateModal
        updatingProject={updatingProject}
        isTeam={isTeam}
        updateTextRef={updateTextRef}
        updateText={updateText}
        setUpdateText={setUpdateText}
        updateMilestones={updateMilestones}
        setUpdateMilestones={setUpdateMilestones}
        updateDeliverables={updateDeliverables}
        setUpdateDeliverables={setUpdateDeliverables}
        isSubmittingUpdate={isSubmittingUpdate}
        closeModals={closeModals}
        saveUpdate={saveUpdate}
      />

      <NewProjectModal
        showNewProject={showNewProject}
        isTeam={isTeam}
        closeModals={closeModals}
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
        newProjectClientEmail={newProjectClientEmail}
        setNewProjectClientEmail={setNewProjectClientEmail}
        handleAddProject={handleAddProject}
      />

      {toast && (
        <div className="dashboard__toast" role="status">
          <Icon name="check" size={18} />
          {toastMsg}
        </div>
      )}
    </div>
  );
}
