import React from 'react';

const ApproveReject = ({ coordinators, handleApprove, handleReject, handleDisable, handleEnable }) => {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Username</th>
                        <th>Approval Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {coordinators.map(coordinator => (
                        <tr key={coordinator.user_id}>
                            <td>{coordinator.name}</td>
                            <td>{coordinator.email}</td>
                            <td>{coordinator.phone}</td>
                            <td>{coordinator.username}</td>
                            <td>{coordinator.is_approved ? 'Approved' : 'Pending'}</td>
                            <td>
                                {!coordinator.is_approved && (
                                    <>
                                        <button onClick={() => handleApprove(coordinator.user_id)}>Approve</button>
                                        <button onClick={() => handleReject(coordinator.user_id)}>Reject</button>
                                    </>
                                )}
                                {coordinator.is_approved && (
                                    <>
                                        <button onClick={() => coordinator.is_disabled ? handleEnable(coordinator.user_id) : handleDisable(coordinator.user_id)}>
                                            {coordinator.is_disabled ? 'Enable' : 'Disable'}
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApproveReject;
