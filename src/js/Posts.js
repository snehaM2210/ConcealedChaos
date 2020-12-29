import React, { useState, useEffect } from 'react';
import '../css/Posts.css';
import Post from './Post';
import { db } from './firebase';

function Posts({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsub = db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });

    return unsub;
  }, []);

  return (
    <div className='posts'>
      {posts.map(({ id, post }) => (
        <Post
          key={id}
          user={user}
          postId={id}
          userName={post.userName}
          caption={post.caption}
          avatarURL={post.avatarURL}
          imageURL={post.imageURL}
          tags={post.failTags}
          title={post.title}
          userEmail={post.userEmail}
        />
      ))}
    </div>
  );
}

export default Posts;
