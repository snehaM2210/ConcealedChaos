import React from 'react';
import { Typography } from '@material-ui/core';

const Profile = ({ user }) => {
  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <Typography variant='h3'>User Profile</Typography>
      <div>
        <Typography variant='h5'>{user?.displayName}</Typography>
      </div>
    </div>
  );
};

export default Profile;
