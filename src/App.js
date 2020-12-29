import React, { useState } from 'react';
import Header from './js/Header';
import Posts from './js/Posts';
import ImageUpload from './js/ImageUpload';
import Button from '@material-ui/core/Button';
import './css/App.css';
import './css/elements.css';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import MyPosts from './js/MyPosts';
import Profile from './js/Profile';

function App() {
  const [user, setUser] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const paths = ['/'];
  console.log('location is ', location);
  return (
    <div className='app'>
      <Header user={user} setUser={setUser} />

      {!paths.includes(location.pathname) && (
        <div
          style={{ cursor: 'pointer', margin: '1rem' }}
          onClick={() => {
            console.log('clicked');
            history.goBack();
          }}
        >
          <Button variant='outlined' color='secondary'>
            go back
          </Button>
        </div>
      )}

      <Switch>
        <Route
          exact
          path='/'
          render={() => (
            <>
              {user && user?.displayName && (
                <ImageUpload username={user?.displayName} email={user?.email} />
              )}
              <Posts user={user} />
            </>
          )}
        />
        <Route
          exact
          path='/myposts'
          render={(routeProps) => <MyPosts {...routeProps} user={user} />}
        />
        <Route
          exact
          path='/myprofile'
          render={(routeProps) => <Profile {...routeProps} user={user} />}
        />
      </Switch>
    </div>
  );
}

export default App;
