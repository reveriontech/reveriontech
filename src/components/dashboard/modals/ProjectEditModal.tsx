import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import type { DashboardProject } from '../../../types';

export interface ProjectEditModalProps {
    editingProject: string | null;
    editName: string;
    setEditName: (name: string) => void;
    editStatus: DashboardProject['status'];
    setEditStatus: (status: DashboardProject['status']) => void;
    closeModals: () => void;
    saveEdit: () => void;
}

export function ProjectEditModal({
    editingProject,
    editName,
    setEditName,
    editStatus,
    setEditStatus,
    closeModals,
    saveEdit,
}: ProjectEditModalProps) {
    if (!editingProject) return null;

    return (
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
    );
}
