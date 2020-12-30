import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button, makeStyles } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import LoginBody from "./LoginBody";
import { auth } from "./firebase";

const useStyles = makeStyles((theme) => ({
  nav__button: {
    color: "white",
    transition: "all 0.35s linear",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  profile__button: {
    marginRight: "1rem",
  },
}));

export default function Login({ user, setUser }) {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSignIn, setOpenSignIn] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const unsibscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);

        if (authUser.displayName) {
          // don't update username
        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(false);
      }
    });

    return () => {
      unsibscribe();
    };
  }, [setUser, username]);

  const handleClose = () => {
    setOpen(false);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      {user ? (
        <>
          <Button
            type="button"
            as="a"
            href="https://concealedchaosgame.netlify.app/"
            className={classes.nav__button}
          >
            game
          </Button>
          <Button type="button" as="a" href="" className={classes.nav__button}>
            quotes
          </Button>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
            onClick={handleClickMenu}
            className={classes.profile__button}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            style={{ marginTop: "2rem" }}
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                history.push("/myprofile");
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                history.push("/myposts");
              }}
            >
              My Posts
            </MenuItem>
          </Menu>
          <Button
            type="button"
            className={classes.nav__button}
            onClick={() => auth.signOut()}
          >
            Logout
          </Button>
        </>
      ) : user === false ? (
        <>
          <Button
            type="button"
            className={classes.nav__button}
            onClick={() => {
              setOpen(true);
              setOpenSignIn(false);
            }}
          >
            Sign Up
          </Button>
          <Button
            type="button"
            className={classes.nav__button}
            onClick={() => {
              setOpen(true);
              setOpenSignIn(true);
            }}
          >
            Log In
          </Button>
        </>
      ) : null}

      <Modal className="modal" open={open} onClose={handleClose}>
        <div>
          <LoginBody
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            openSignIn={openSignIn}
            setOpen={setOpen}
          />
        </div>
      </Modal>
    </div>
  );
}
