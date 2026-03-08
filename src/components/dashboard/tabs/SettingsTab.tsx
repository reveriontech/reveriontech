
import { Button } from '../../ui/Button';
import { updateProfile } from '../../../lib/profile';

export interface SettingsTabProps {
    theme: string;
    toggleTheme: () => void;
    settingsName: string;
    setSettingsName: (name: string) => void;
    settingsEmail: string;
    setSettingsEmail: (email: string) => void;
    settingsCompany: string;
    setSettingsCompany: (company: string) => void;
    settingsPhone: string;
    setSettingsPhone: (phone: string) => void;
    settingsRole: string;
    setSettingsRole: (role: string) => void;
    notifyEmail: boolean;
    setNotifyEmail: (notify: boolean) => void;
    notifyProjects: boolean;
    setNotifyProjects: (notify: boolean) => void;
    myTeamStatus: { status: string | null; is_admin: boolean; job_title?: string | null } | null;
    setToastMsg: (msg: string) => void;
    showToast: () => void;
}

export function SettingsTab({
    theme,
    toggleTheme,
    settingsName,
    setSettingsName,
    settingsEmail,
    setSettingsEmail,
    settingsCompany,
    setSettingsCompany,
    settingsPhone,
    setSettingsPhone,
    settingsRole,
    setSettingsRole,
    notifyEmail,
    setNotifyEmail,
    notifyProjects,
    setNotifyProjects,
    myTeamStatus,
    setToastMsg,
    showToast,
}: SettingsTabProps) {
    return (
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
    );
}
