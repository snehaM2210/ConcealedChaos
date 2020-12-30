import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import "../css/Header.css";
import Login from "./Login";
import Logo from "./Logo";

// import Logo from './Logo';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
}));

function Header({ user, setUser }) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.grow}>
      <AppBar
        position="fixed"
        style={{
          background: "linear-gradient(45deg, #360167, #6B0772, #AF1281);",
        }}
      >
        <Toolbar>
          <div style={{ cursor: "pointer" }} onClick={() => history.push("/")}>
            <Logo />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Login user={user} setUser={setUser} />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
