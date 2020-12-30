import React, { useState } from "react";
import Header from "./js/Header";
import Posts from "./js/Posts";
import ImageUpload from "./js/ImageUpload";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ReactLogo from "./img/bubbles.svg";
// import Particles from "react-particles-js";

import "./css/App.css";
import "./css/elements.css";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import MyPosts from "./js/MyPosts";
import Profile from "./js/Profile";
import TaggedPosts from "./js/TaggedPosts";

function App() {
  const [user, setUser] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const paths = ["/"];
  const particlesOptions = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
    },
  };

  const [sortBy, setSortBy] = React.useState("timestamp");

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };
  console.log(sortBy);
  return (
    <div className="app">
      <Header user={user} setUser={setUser} />
      <div className="sort__container">
        <FormControl style={{ width: "25%", marginLeft: "auto" }}>
          <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortBy}
            defaultValue={sortBy}
            onChange={handleChange}
          >
            <MenuItem value="timestamp">Latest</MenuItem>
            <MenuItem value="likesCount">Likes</MenuItem>
            <MenuItem value="commentsCount">Comments</MenuItem>
          </Select>
        </FormControl>
      </div>
      {!paths.includes(location.pathname) && (
        <div
          style={{ cursor: "pointer", margin: "1rem" }}
          onClick={() => {
            console.log("clicked");
            history.goBack();
          }}
        >
          <Button variant="outlined" color="secondary">
            go back
          </Button>
        </div>
      )}
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <>
              {user && user?.displayName && (
                <ImageUpload username={user?.displayName} email={user?.email} />
              )}
              <Posts user={user} sortBy={sortBy} />
            </>
          )}
        />
        <Route
          exact
          path="/myposts"
          render={(routeProps) => <MyPosts {...routeProps} user={user} />}
        />
        <Route
          exact
          path="/myprofile"
          render={(routeProps) => <Profile {...routeProps} user={user} />}
        />
        <Route
          exact
          path="/posts/tags/:tag"
          render={(routeProps) => <TaggedPosts user={user} {...routeProps} />}
        />
      </Switch>
      <div
        style={{
          background: "pink",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: "100%",
          height: "100vh",
          opacity: 0.2,
        }}
      >
        <img
          style={{ width: "100%", height: "100%", zIndex: -1 }}
          src={ReactLogo}
          alt=""
        />
      </div>
    </div>
  );
}

export default App;
