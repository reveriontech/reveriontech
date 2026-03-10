import type { ContactRequest } from '../../../types';

export interface RequestsTabProps {
    requestsLoading: boolean;
    requestsError: string;
    contactRequests: ContactRequest[];
    handleStatusChange: (id: string, status: ContactRequest['status']) => void;
}

export function RequestsTab({
    requestsLoading,
    requestsError,
    contactRequests,
    handleStatusChange,
}: RequestsTabProps) {
    return (
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
    );
}
