import React, { useState } from "react";
import Header from "./js/Header";
import Posts from "./js/Posts";
import ImageUpload from "./js/ImageUpload";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Bubbles from "./img/bubbles.svg";

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

  const [sortBy, setSortBy] = React.useState("timestamp");

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };
  console.log(sortBy);
  return (
    <div className="app">
      <Header user={user} setUser={setUser} />
      <img
        src={Bubbles}
        style={{
          position: "fixed",
          height: "100%",
          width: "100%",
          opacity: 0.5,
        }}
        alt=""
      />

      <div className="sort__container">
        <FormControl
          style={{
            width: "25%",
            marginLeft: "auto",
            top: "70px",
            left: "200px",
          }}
        >
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
    </div>
  );
}

export default App;
