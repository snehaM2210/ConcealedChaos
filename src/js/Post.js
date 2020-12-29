import React from 'react';
import AddComment from './AddComment';
import Collapse from '@material-ui/core/Collapse';
import ChatIcon from '@material-ui/icons/Chat';
import firebase from 'firebase';
import { Avatar, Icon, IconButton, makeStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import '../css/Post.css';
import { db } from './firebase';
import Comments from './Comments';

const useStyles = makeStyles((theme) => ({
  chips__container: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    marginTop: '1rem',
    marginBottom: '1rem',
    padding: '0 20px 0 20px',
  },
  moreIcon: {
    marginLeft: 'auto',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
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
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = (postId) => {
    setLoading(true);
    setAnchorEl(null);
    db.collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        console.log('post deleted');
        setLoading(false);
        setAnchorEl(null);
      })
      .catch((err) => {
        setLoading(false);
        console.err(err);
        setAnchorEl(null);
      });
  };

  const likePost = () => {
    const postRef = db.collection('posts').doc(postId);
    postRef
      .collection('likes')
      .get()
      .then(async (data) => {
        const userFound = data.docs.find(
          (doc) => doc.data().username === user.displayName
        );
        if (userFound) {
          console.log('user found will delte ');
          await userFound.ref.delete();
        } else {
          console.log('user not found so will like');
          postRef.collection('likes').add({
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      });
  };

  React.useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('likes')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setLikesCount(snapshot.size);
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar className='post__avatar' alt={userName} src={avatarURL}>
          {userName?.[0]?.toUpperCase()}
        </Avatar>
        <Typography variant='h6'>{userName.toUpperCase()}</Typography>
        {user.email === userEmail && (
          <>
            <IconButton className={classes.moreIcon} onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>

            <Menu
              id='simple-menu'
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
              size='small'
              label={tag}
              clickable
              color='secondary'
              variant='outlined'
            />
          ))}
      </div>

      {imageURL && <img className='post__image' src={imageURL} alt='post' />}
      <div className='post__bottom'>
        <Typography variant='h5'>{title}</Typography>
        <Typography variant='caption'>{caption}</Typography>
      </div>
      <div className='post__icons'>
        <Badge badgeContent={likesCount && likesCount} color='secondary'>
          <IconButton onClick={likePost}>
            <Icon color='secondary' className='fas fa-long-arrow-alt-up' />
          </IconButton>
        </Badge>
        <IconButton
          className='post__icons-comment'
          onClick={() => setExpanded((expanded) => !expanded)}
        >
          <ChatIcon color='primary' />
        </IconButton>
      </div>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        {user?.displayName && <AddComment {...{ user, postId }} />}
        <Comments postId={postId} user={user} postOwner={userName} />
      </Collapse>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </div>
  );
}

export default Post;
