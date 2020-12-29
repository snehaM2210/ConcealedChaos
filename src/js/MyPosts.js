import React, { useState, useEffect } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { db } from "./firebase";
import Post from "./Post";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "600px",
    margin: "auto",
    marginTop: "1rem",
  },
}));

const MyPosts = ({ user }) => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user) {
      console.log(user);
      db.collection("posts")
        .where("userName", "==", user.displayName)
        .orderBy("timestamp", "desc")
        .get()
        .then((data) => {
          const posts = [];
          data.docs.forEach((doc) => {
            posts.push({
              id: doc.id,
              post: doc.data(),
            });
          });
          setPosts(posts);
        });
    }
  }, [user]);

  console.log("posts is", posts);

  return (
    <div className={classes.container}>
      <Typography variant="h3">My Posts</Typography>
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
        />
      ))}
    </div>
  );
};

export default MyPosts;
