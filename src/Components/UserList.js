import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser, setUsers } from '../features/userSlice';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const UserList = ({ setUserToEdit }) => {
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
    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                dispatch(deleteUser(userId)); 
            } else {
                console.error('Failed to delete user:', response.status);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
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
                                <div onClick={() => handleDelete(user.id)}>
                                    <MdDeleteForever style={{ color: 'black', fontSize: '22px' }} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
