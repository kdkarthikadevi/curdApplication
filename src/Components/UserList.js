import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser, setUsers } from '../features/userSlice';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';

const UserList = ({ setUserToEdit }) => {
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const users = useSelector((state) => state.users);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:3000/users');
            const data = await response.json();
            dispatch(setUsers(data)); 
        };

        fetchUsers();
    }, [dispatch]);

    const handleClick = (userId) => {
        setUserIdToDelete(userId);
        setShowModal(true);
    };
    

    const handleDelete = async () => {
        if (userIdToDelete) {
            try {
                const response = await fetch(`http://localhost:3000/users/${userIdToDelete}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    dispatch(deleteUser(userIdToDelete));
                    toast.success('User deleted successfully!');
                } else {
                    console.error('Failed to delete user:', response.status);
                    toast.error('Failed to delete user.');
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error('Error deleting user.'); 
            } finally {
                setShowModal(false); 
            }
        }
    };

    return (
        <div className="table-responsive p-3">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Employee ID</th>
                        <th>Mobile</th>
                        <th>Job Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.employeeId}</td>
                            <td>{user.mobile}</td>
                            <td>{user.jobRole}</td>
                            <td className='d-flex gap-4'>
                                <div onClick={() => setUserToEdit(user)}>
                                    <FaEdit style={{ color: 'black', fontSize: '20px' }} />
                                </div>
                                <div onClick={() => handleClick(user.id)}>
                                    <MdDeleteForever style={{ color: 'black', fontSize: '22px' }} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Modal Delete */}
            {showModal && (
                <div className="modal" style={{ display: "block" }}>
                    <div className="content">
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete this user?</p>
                        <button className="btn btn-primary me-3" onClick={handleDelete}>Yes, delete</button>
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default UserList;
