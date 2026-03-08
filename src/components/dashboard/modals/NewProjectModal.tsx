import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';

export interface NewProjectModalProps {
    showNewProject: boolean;
    isTeam: boolean;
    closeModals: () => void;
    newProjectName: string;
    setNewProjectName: (name: string) => void;
    newProjectClientEmail: string;
    setNewProjectClientEmail: (email: string) => void;
    handleAddProject: () => void;
}

export function NewProjectModal({
    showNewProject,
    isTeam,
    closeModals,
    newProjectName,
    setNewProjectName,
    newProjectClientEmail,
    setNewProjectClientEmail,
    handleAddProject,
}: NewProjectModalProps) {
    if (!isTeam || !showNewProject) return null;

    return (
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
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            The exact email address the client uses to log into ReverionTech.
                        </p>
                    </div>
                </div>
                <div className="dashboard__modal-footer">
                    <Button variant="ghost" size="sm" onClick={closeModals}>Cancel</Button>
                    <Button
                        size="sm"
                        onClick={handleAddProject}
                        disabled={!newProjectName.trim() || !newProjectClientEmail.trim()}
                    >
                        Create Project
                    </Button>
                </div>
            </div>
        </>
    );
}
