import React from 'react';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';

export interface Milestone {
    label: string;
    date: string;
    done: boolean;
}

export interface Deliverable {
    name: string;
    status: 'Delivered' | 'In Progress' | 'Pending';
}

export interface ProjectUpdateModalProps {
    updatingProject: string | null;
    isTeam: boolean;
    updateTextRef: React.RefObject<HTMLTextAreaElement | null>;
    updateText: string;
    setUpdateText: (text: string) => void;
    updateMilestones: Milestone[];
    setUpdateMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
    updateDeliverables: Deliverable[];
    setUpdateDeliverables: React.Dispatch<React.SetStateAction<Deliverable[]>>;
    isSubmittingUpdate: boolean;
    closeModals: () => void;
    saveUpdate: () => void;
}

export function ProjectUpdateModal({
    updatingProject,
    isTeam,
    updateTextRef,
    updateText,
    setUpdateText,
    updateMilestones,
    setUpdateMilestones,
    updateDeliverables,
    setUpdateDeliverables,
    isSubmittingUpdate,
    closeModals,
    saveUpdate,
}: ProjectUpdateModalProps) {
    if (!updatingProject) return null;

    return (
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
    );
}
