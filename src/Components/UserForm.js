import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from '../features/userSlice';
import employeeData from "../db.json";

const UserForm = ({ userToEdit, setUserToEdit }) => {
    console.log(employeeData);
    const dispatch = useDispatch();
    const [newUser, setNewUser] = useState({
        id: Date.now(),
        name: '',
        email: '',
        employeeId: '',
        mobile: '',
        jobRole: '',
    });

    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (userToEdit) {
            setNewUser(userToEdit);
            setOpen(true);
        } else {
            resetForm();
        }
    }, [userToEdit]);

    const resetForm = () => {
        setNewUser({
            id: Date.now(),
            name: '',
            email: '',
            employeeId: '',
            mobile: '',
            jobRole: '',
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobilePattern = /^[0-9]{10}$/;

        if (newUser.name.length < 3 || newUser.name.length > 15) {
            newErrors.name = 'Name must be between 3 and 15 characters.';
        }

        if (!emailPattern.test(newUser.email)) {
            newErrors.email = 'Please enter a valid email.';
        }

        if (newUser.employeeId.length < 4) {
            newErrors.employeeId = 'Employee ID must be at least 4 characters.';
        }

        if (!mobilePattern.test(newUser.mobile)) {
            newErrors.mobile = 'Please enter a valid mobile number (10 digits).';
        }

        if (!newUser.jobRole) {
            newErrors.jobRole = 'Job Role is required.';
        }

        return newErrors;
    }; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        try {
            let updatedUser;
            if (userToEdit) {
                debugger
                const response = await fetch(`http://localhost:3000/users/${newUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser), 
                });
    
                if (response.ok) {
                    updatedUser = await response.json();
                    if (userToEdit) {
                        dispatch(updateUser(updatedUser));
                    } else {
                        dispatch(addUser(updatedUser));
                    }
                 
                    setOpen(false);
                }
            } else {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
    
                if (response.ok) {
                    updatedUser = await response.json();
                    dispatch(addUser(updatedUser)); 
                }
               
            }
        } catch (error) {
            console.error("Error saving user:", error);
        } finally {
            resetForm();
            setOpen(false);
        }
    };
    

    const closeModal = () => {
        setOpen(false);
        setUserToEdit(null);
        resetForm();
    };

    return (
        <>
            <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
                Add User
            </button>
            {open && (
                <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{userToEdit ? 'Edit User' : 'Add User'}</h5>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit} className="p-3 border rounded shadow">
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={newUser.name}
                                            onChange={handleChange}
                                            placeholder="Name"
                                            required
                                        />
                                        {errors.name && <small className="text-danger">{errors.name}</small>}
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={newUser.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            required
                                        />
                                        {errors.email && <small className="text-danger">{errors.email}</small>}
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="employeeId"
                                            value={newUser.employeeId}
                                            onChange={handleChange}
                                            placeholder="Employee ID"
                                            required
                                        />
                                        {errors.employeeId && <small className="text-danger">{errors.employeeId}</small>}
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="mobile"
                                            value={newUser.mobile}
                                            onChange={handleChange}
                                            placeholder="Mobile"
                                            required
                                        />
                                        {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            name="jobRole"
                                            value={newUser.jobRole}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Job Role</option>
                                            <option value="Developer">Developer</option>
                                            <option value="Designer">Designer</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Tester">Tester</option>
                                        </select>
                                        {errors.jobRole && <small className="text-danger">{errors.jobRole}</small>}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">
                                            {userToEdit ? 'Update User' : 'Add User'}
                                        </button>
                                        <button type="button" className="btn btn-secondary ms-2" onClick={closeModal}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserForm;
