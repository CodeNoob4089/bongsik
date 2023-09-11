import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleList, faHeart } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import useAuthStore from "../store/auth";
import { getDoc, doc } from "@firebase/firestore";
import { db } from "../firebase";
import PostingModal from "./CommentsModal";

function MyLikePost() {
  const user = useAuthStore((state) => state.user);
  const [likedPosts, setLikedPosts] = useState([]);

  //모달
  const [openModal, setOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [, setSelectedPostId] = useState(null);

  //모달 열기
  const handlePostClick = (post) => {
    // 배경 페이지 스크롤 막기
    document.body.style.overflow = "hidden";
    setSelectedPost(post);
    setSelectedPostId(post.postId);
    setOpenModal(true);
  };

  const getLikedPosts = async (userLikes) => {
    const promises = userLikes.map(async ({ likePostId }) => {
      const docRef = doc(db, "posts", likePostId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { ...docSnap.data(), postId: likePostId };
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

  return (
    <>
      <PostCardsContainer>
        <PostTitle>
          <FontAwesomeIcon icon={faHeart} style={{ color: "#FF4E50" }} /> 좋아요 {user.userLikes?.length}
        </PostTitle>
        <Posts>
          {likedPosts.map((post) => (
            <PostContainer key={post.id}>
              <PostImage
                src={post.photo}
                onClick={() => {
                  handlePostClick(post, post.postId);
                }}
              />
              <PostDetails>
                <div>
                  <ShopName>{post.place.place_name}</ShopName>
                  <ShopAddress>{post.place.road_address_name}</ShopAddress>
                </div>
                <LikesCount>
                  <FontAwesomeIcon icon={faHeart} style={{ color: "#FF4E50" }} />
                  {post.likeCount}
                </LikesCount>
              </PostDetails>
            </PostContainer>
          ))}
        </Posts>
      </PostCardsContainer>
      <PostingModal
        selectedPost={selectedPost}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setSelectedPostId={setSelectedPost}
      />
    </>
  );
}

export default MyLikePost;

const PostCardsContainer = styled.div`
  margin: 5vh auto;
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 100%;
  border-radius: 18px;
  background-color: white;
  overflow-y: scroll;
`;

const PostTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  padding: 2rem 0rem 1rem 2rem;
`;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 2rem;
`;

const PostContainer = styled.div`
  display: flex;
  height: 18rem;
  border: none;
  border-radius: 10px;
  padding: 10px;
  margin-left: 30px;
  margin-top: 20px;
`;

const PostImage = styled.img`
  width: 20rem;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
`;

const PostDetails = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ShopName = styled.h3`
  color: black;
  font-size: 20px;
  font-weight: bold;
`;

const ShopAddress = styled.p`
  color: gray;
  font-size: 18px;
  margin-top: 20px;
`;

const LikesCount = styled.div`
  color: gray;
  font-size: 18px;
  margin-bottom: 1rem;
  margin-left: 5px;
`;
