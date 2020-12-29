import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import '../css/Comments.css';
import { Icon, IconButton, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  pinIcon: {
    transform: 'rotate(45deg)',
    marginRight: '0.25rem',
  },
}));

function Comments({ postId, user, postOwner }) {
  const [comments, setComments] = useState();
  const classes = useStyles();

  useEffect(() => {
    let unsubscribe;

    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .orderBy('pinned')
        .onSnapshot((snapshot) => {
          let comments = [];
          snapshot.docs.forEach((doc) => {
            comments.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          const pinnedComments = comments.filter((c) => c.data.pinned);
          const unPinnedComments = comments.filter((c) => !c.data.pinned);
          setComments([...pinnedComments, ...unPinnedComments]);
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const pinComment = (commentId) => {
    const commentRef = db
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .doc(commentId);

    commentRef.get().then((doc) => {
      console.log('comment is ', doc.data());
      if (doc.data().pinned) {
        commentRef.update({ pinned: false }).then(() => {});
      } else {
        commentRef.update({ pinned: true }).then(() => {});
      }
    });
  };
  console.log(user.displayName);
  console.log(postOwner);
  console.log(user.displayName === postOwner);
  return (
    <div className='comments'>
      {comments &&
        comments.map(({ id, data }) => (
          <div className='comments__container' key={id}>
            {user.displayName === postOwner && (
              <IconButton
                className={classes.pinIcon}
                onClick={() => pinComment(id)}
                color='primary'
              >
                <Icon className='fas fa-thumbtack' />
              </IconButton>
            )}
            <div>
              <Typography variant='subtitle1'>
                {data.username}{' '}
                {data.pinned && (
                  <Typography variant='caption'>
                    <i>pinned</i>
                  </Typography>
                )}
              </Typography>
              <Typography variant='subtitle2'>{data.text}</Typography>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Comments;
