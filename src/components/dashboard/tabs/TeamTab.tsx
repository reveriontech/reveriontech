import React from 'react';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import type { TeamMember } from '../../../types';

export interface TeamTabProps {
    team: TeamMember[];
    teamLoading: boolean;
    teamError: string;
    myTeamStatus: { status: string | null; is_admin: boolean; job_title?: string | null } | null;
    approveApplicant: (id: string) => void;
    rejectApplicant: (id: string) => void;
    teamEmployees: TeamMember[];
    teamSliderPrev: () => void;
    teamSliderNext: () => void;
    teamSliderRef: React.RefObject<HTMLDivElement | null>;
    getTeamImage: (index: number) => string;
    teamSliderIndex: number;
    setTeamSliderIndex: (index: number) => void;
    deactivateMember: (id: string) => void;
    activateMember: (id: string) => void;
}

export function TeamTab({
    team,
    teamLoading,
    teamError,
    myTeamStatus,
    approveApplicant,
    rejectApplicant,
    teamEmployees,
    teamSliderPrev,
    teamSliderNext,
    teamSliderRef,
    getTeamImage,
    teamSliderIndex,
    setTeamSliderIndex,
    deactivateMember,
    activateMember,
}: TeamTabProps) {
    return (
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

                    {/* Employees – Modern Card Slider */}
                    <div className="dashboard__section">
                        <h3 className="dashboard__section-title">Our Team</h3>
                        {teamEmployees.length === 0 ? (
                            <p className="dashboard__empty">No team members yet.</p>
                        ) : (
                            <div className="dashboard__team-slider-wrap">
                                <button
                                    type="button"
                                    className="dashboard__team-slider-arrow dashboard__team-slider-arrow--left"
                                    onClick={teamSliderPrev}
                                    aria-label="Previous team member"
                                >
                                    <Icon name="arrowLeft" size={20} />
                                </button>
                                <div className="dashboard__team-slider" ref={teamSliderRef}>
                                    {teamEmployees.map((member, index) => (
                                        <article
                                            key={member.id}
                                            className={`dashboard__team-card ${index === teamSliderIndex ? 'dashboard__team-card--active' : ''}`}
                                        >
                                            <div className="dashboard__team-card-frame">
                                                <div className="dashboard__team-card-inner">
                                                    <div className="dashboard__team-card-image-wrap">
                                                        <img src={getTeamImage(index)} alt={member.name} className="dashboard__team-card-image" />
                                                    </div>
                                                    <div className="dashboard__team-card-content">
                                                        <h4 className="dashboard__team-card-name">{member.name}</h4>
                                                        <p className="dashboard__team-card-role">{member.jobTitle}</p>
                                                        <span className={`dashboard__team-badge dashboard__team-badge--${member.status}`}>
                                                            {member.status}
                                                        </span>
                                                        {myTeamStatus?.is_admin && (
                                                            <div className="dashboard__team-card-actions">
                                                                {member.status === 'active' ? (
                                                                    <Button variant="ghost" size="sm" onClick={() => deactivateMember(member.id)}>
                                                                        Deactivate
                                                                    </Button>
                                                                ) : (
                                                                    <Button variant="ghost" size="sm" onClick={() => activateMember(member.id)}>
                                                                        Activate
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    className="dashboard__team-slider-arrow dashboard__team-slider-arrow--right"
                                    onClick={teamSliderNext}
                                    aria-label="Next team member"
                                >
                                    <Icon name="arrow-right" size={20} />
                                </button>
                                <div className="dashboard__team-slider-dots">
                                    {teamEmployees.map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className={`dashboard__team-slider-dot ${i === teamSliderIndex ? 'dashboard__team-slider-dot--active' : ''}`}
                                            onClick={() => setTeamSliderIndex(i)}
                                            aria-label={`Show team member ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
