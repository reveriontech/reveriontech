import { Icon } from '../../ui/Icon';
import type { DashboardProject } from '../../../types';

export interface ProjectsTabProps {
    projects: DashboardProject[];
    avgProgress: number;
    isTeam: boolean;
    selectedProjectId: string;
    handleProjectSelectChange: (value: string) => void;
    selectedProject: DashboardProject | null;
    openUpdateModal: (p: DashboardProject) => void;
    openEditModal: (p: DashboardProject) => void;
}

export function ProjectsTab({
    projects,
    avgProgress,
    isTeam,
    selectedProjectId,
    handleProjectSelectChange,
    selectedProject,
    openUpdateModal,
    openEditModal,
}: ProjectsTabProps) {
    return (
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
    );
}
