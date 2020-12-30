import React from "react";
import AddComment from "./AddComment";
import Collapse from "@material-ui/core/Collapse";
import ChatIcon from "@material-ui/icons/Chat";
import firebase from "firebase";
import { Avatar, Icon, IconButton, makeStyles } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import Chip from "@material-ui/core/Chip";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
// import FavoriteIcon from "@material-ui/icons/Favorite";

import "../css/Post.css";
import { db } from "./firebase";
import Comments from "./Comments";

const useStyles = makeStyles((theme) => ({
  chips__container: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
    marginTop: "1rem",
    marginBottom: "1rem",
    padding: "0 20px 0 20px",
  },
  moreIcon: {
    marginLeft: "auto",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Post({
  user,
  postId,
  userName,
  title,
  caption,
  avatarURL,
  imageURL,
  tags,
  userEmail,
}) {
  const history = useHistory();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState({ show: false, message: "" });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = (postId) => {
    setAnchorEl(null);
    db.collection("posts")
      .doc(postId)
      .delete()
      .then(() => {
        setAnchorEl(null);
      })
      .catch((err) => {
        setAnchorEl(null);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ show: false, message: "" });
  };

  const likePost = async () => {
    if (!user) {
      setSnackbar({ show: true, message: "Login to like a post" });
      return;
    }
    const postRef = db.collection("posts").doc(postId);
    const post = await postRef.get().then((doc) => doc.data());
    console.log("the post iss", post);
    postRef
      .collection("likes")
      .get()
      .then(async (data) => {
        const userFound = data.docs.find(
          (doc) => doc.data().username === user.displayName
        );
        if (userFound) {
          await userFound.ref.delete();
          postRef.update({ likesCount: post.likesCount - 1 });
        } else {
          postRef.collection("likes").add({
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          postRef.update({ likesCount: post.likesCount + 1 });
        }
      });
  };

  React.useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("likes")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setLikesCount(snapshot.size);
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt={userName} src={avatarURL}>
          {userName?.[0]?.toUpperCase()}
        </Avatar>
        <Typography variant="h6">{userName.toUpperCase()}</Typography>
        {user.email === userEmail && (
          <>
            <IconButton className={classes.moreIcon} onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>

            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => handleDelete(postId)}>
                Delete Post
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
      <div className={classes.chips__container}>
        {tags &&
          tags.length > 0 &&
          tags.map((tag) => (
            <Chip
              key={`${tag}-${Math.round(Math.random() * 999999)}`}
              size="small"
              label={tag}
              clickable
              color="secondary"
              variant="outlined"
              onClick={() => history.push(`/posts/tags/${tag}`)}
            />
          ))}
      </div>

      {imageURL && <img className="post__image" src={imageURL} alt="post" />}
      <div className="post__bottom">
        <Typography variant="h5">{title}</Typography>
        <Typography variant="caption">{caption}</Typography>
      </div>
      <div className="post__icons">
        <Badge badgeContent={likesCount && likesCount} color="secondary">
          <IconButton onClick={likePost}>
            <FavoriteBorderIcon color="secondary" />
          </IconButton>
        </Badge>
        <IconButton
          className="post__icons-comment"
          onClick={() => {
            if (!user) {
              setSnackbar({
                show: true,
                message: "Login to comment on a post",
              });
              return;
            }
            setExpanded((expanded) => !expanded);
          }}
        >
          <ChatIcon color="primary" />
        </IconButton>
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {user?.displayName && <AddComment {...{ user, postId }} />}
        <Comments postId={postId} user={user} postOwner={userName} />
      </Collapse>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        severity="info"
        open={snackbar.show}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbar.message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
}

export default Post;
