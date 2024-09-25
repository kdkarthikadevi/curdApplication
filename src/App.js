import React, { useState } from 'react';
import UserForm from './Components/UserForm';
import UserList from './Components/UserList';

const App = () => {
  const [userToEdit, setUserToEdit] = useState(null);

  return (
    <div className='p-3'>
      <h1 className='text-center'>CRUD Operation</h1>
      <UserForm userToEdit={userToEdit} setUserToEdit={setUserToEdit} />
      <UserList setUserToEdit={setUserToEdit} />
    </div>
  );
};

export default App;
 