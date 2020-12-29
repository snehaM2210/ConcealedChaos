import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import Post from "./Post";

const TaggedPosts = ({ user }) => {
  const [taggedPosts, setTaggedPosts] = useState({ found: null, posts: [] });
  const params = useParams();
  useEffect(() => {
    db.collection("posts")
      .orderBy("likesCount", "desc")
      .orderBy("commentsCount", "desc")
      .limit(10)
      .get()
      .then((data) => {
        let posts = [];
        const _posts = data.docs;
        _posts.forEach((post) => {
          const tags = post.data().failTags.map((x) => x.trim());
          console.log(tags);
          const containsParams = tags.includes(params.tag);
          if (containsParams) posts.push({ id: post.id, post: post.data() });
        });
        if (posts.length === 0) {
          setTaggedPosts({ found: false, posts });
        } else {
          setTaggedPosts({ found: true, posts });
        }
      });
  }, [params.tag]);

  if (taggedPosts.posts.length === 0 && taggedPosts.found === null) {
    return (
      <div className="posts">
        <Typography variant="h2">Loading....</Typography>
      </div>
    );
  }

  if (taggedPosts.posts.length === 0 && taggedPosts.found === false) {
    return (
      <div className="posts">
        <Typography variant="h2">No posts found :( </Typography>
      </div>
    );
  }

  console.log(taggedPosts);

  return (
    <div>
      <div className="posts">
        <Typography variant="h4">Posts related to tag </Typography>
        <Typography
          variant="h3"
          color="secondary"
          style={{ textDecoration: "underline" }}
        >
          {params.tag}
        </Typography>

        {taggedPosts.posts.map(({ id, post }) => (
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
    </div>
  );
};

export default TaggedPosts;
