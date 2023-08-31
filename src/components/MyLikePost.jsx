import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useAuthStore from "../store/auth";
import { getDoc, doc } from "@firebase/firestore";
import { db } from "../firebase";

function MyLikePost() {
  const user = useAuthStore((state) => state.user);
  const [likedPosts, setLikedPosts] = useState([]);

  const getLikedPosts = async (userLikes) => {
    const promises = userLikes.map(async ({ likePostId }) => {
      const docRef = doc(db, "posts", likePostId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: likePostId, ...docSnap.data() };
      } else {
        console.log("None");
        return null;
      }
    });

    const posts = await Promise.all(promises);
    return posts.filter((post) => post !== null);
  };

  useEffect(() => {
    if (user && user.userLikes && user.userLikes.length > 0) {
      getLikedPosts(user.userLikes).then((posts) => setLikedPosts(posts));
    }
  }, [user]);
  console.log(likedPosts);
  console.log(user);
  return (
    <LikedPostsContainer>
      <Title>찜한 글 리스트</Title>
      <GridContainer>
        {likedPosts.map((post) => (
          <PostContainer key={post.id}>
            <PostImage src={post.photo} />
            <p>{post.content}</p>
          </PostContainer>
        ))}
      </GridContainer>
    </LikedPostsContainer>
  );
}

export default MyLikePost;
const LikedPostsContainer = styled.div`
  margin: 5vh auto;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 100%;
  border-radius: 18px;
  background-color: white;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: gray;
  margin-bottom: 2rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  overflow-y: scroll;
`;

const PostContainer = styled.div`
  border: none;
  border-radius: 10px;
  background-color: #F2F2F5;
  padding: 10px;
`;

const PostImage = styled.img`
  width: 100%;
  margin-bottom: 10px;
`;
