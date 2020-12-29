import React from 'react';
import Logo from './Logo';
import { auth } from './firebase';
import { TextField, Button } from '@material-ui/core';

import '../css/App.css';

function LoginBody({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  openSignIn,
  setOpen,
}) {
  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
        setOpen(false);
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        setOpen(false);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className='modal__body'>
      <Logo />
      <div
        style={{ marginBottom: '1rem', marginTop: '1rem', color: '#1f1f1f' }}
      >
        {!openSignIn ? <h1>Sign Up</h1> : <h1>Login</h1>}
      </div>
      {!openSignIn ? (
        <TextField
          type='text'
          label='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          className='input'
          style={{ marginBottom: '1rem' }}
        />
      ) : null}
      <TextField
        type='text'
        label='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        type='password'
        label='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      {openSignIn ? (
        <Button
          onClick={signIn}
          color='primary'
          variant='contained'
          style={{ marginLeft: 'auto', marginTop: '1rem' }}
        >
          Log In
        </Button>
      ) : (
        <Button
          onClick={signUp}
          color='primary'
          variant='contained'
          style={{ marginLeft: 'auto', marginTop: '1rem' }}
        >
          Sign Up
        </Button>
      )}
    </div>
  );
}

export default LoginBody;
