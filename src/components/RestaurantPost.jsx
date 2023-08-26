import React, { useState } from "react";
import styled from "styled-components";
import {
  CommunityPosting,
  PostImgBox,
  PostImgUrl,
  PostContent,
  PostBottomBar,
  Button,
  ButtonSet,
} from "../components/TabPostStyled";
import { useQuery } from "react-query";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth, firestore, firebase } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "../store/auth";

const getPublicPosts = async () => {
  const postsCollectionRef = collection(db, "posts");

  const querySnapshot = await getDocs(
    query(postsCollectionRef, where("isPublic", "==", true))
  );

  const PublicPosts = querySnapshot.docs.map((postDoc) => {
    const data = postDoc.data();

    return {
      postId: postDoc.id,
      imageUrl: data.photo,
      content: data.content,
      category: data.place.category_group_name,
    };
  });
  console.log(PublicPosts);
  return PublicPosts;
};

function RestaurantPost() {
  const authStore = useAuthStore();
  const isLogIn = authStore.user !== null;

  //모달
  const [openModal, setOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  //모달 열기
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setSelectedPostId(post.postId);
    setOpenModal(true);
  };

  //모달 닫기
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPostId(null);
  };

  const { data: PublicPosts } = useQuery("fetchPublicPosts", getPublicPosts);
  const filterdPosts = PublicPosts?.filter(
    (post) => post?.category === "음식점"
  );

  //찜하기 전 유저 정보 가져오기
  const getUserLikes = async () => {
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userId);

    const docSnapshot = await getDoc(userDocRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      return userData.userLikes || [];
    } else {
      return [];
    }
  };
  const { data: userLikes } = useQuery("fetchUserLikes", getUserLikes);
  // 찜하기
  const clickHeart = async (postId) => {
    const userId = auth.currentUser.uid;
    const alreadyLikedUser = userLikes.find(
      (like) => like.likePostId === postId
    );

    const userDocRef = doc(db, "users", userId);

    if (alreadyLikedUser) {
      await updateDoc(userDocRef, {
        userLikes: userLikes.filter((like) => like.likePostId !== postId),
      });
    } else {
      await updateDoc(userDocRef, {
        userLikes: [...userLikes, { likePostId: postId }],
      });
    }
  };

  return (
    <>
      {filterdPosts?.map((item) => (
        <CommunityPosting key={item.postId}>
          <div>
            {item.imageUrl ? (
              <>
                <PostImgBox>
                  <PostImgUrl src={item.imageUrl}></PostImgUrl>
                </PostImgBox>
                <PostContent>
                  <h2>{item.title}</h2>
                  <p>{item.content}</p>
                  <Button onClick={() => handlePostClick(item)}>
                    자세히 보기
                  </Button>
                </PostContent>
                <PostBottomBar>
                  <ButtonSet>
                    <Button>조회수</Button>

                    <Like
                      isLiked={userLikes?.some(
                        (like) => like.likePostId === item.postId
                      )}
                      onClick={() => {
                        clickHeart(item.postId);
                        alert("찜");
                      }}
                    >
                      <FontAwesomeIcon icon={faHeart} size="lg" />
                    </Like>
                    <Button>댓글</Button>
                    <Button>공유</Button>
                  </ButtonSet>
                </PostBottomBar>
              </>
            ) : (
              <>
                <PostImgBox>
                  {/* <PostImgUrl src={}> </PostImgUrl> */}
                  사진 없을 때 무슨 사진 넣을지 고민중
                </PostImgBox>
                <PostContent>
                  <h2>{item.title}</h2>
                  <p>{item.content}</p>
                </PostContent>
                <PostBottomBar>
                  <Button>조회수</Button>
                  <Button>찜</Button>
                  <Button>댓글</Button>
                  <Button>공유</Button>
                </PostBottomBar>
              </>
            )}
          </div>
        </CommunityPosting>
      ))}
      {openModal && selectedPost && (
        <ModalWrapper>
          <ModalContent>
            {selectedPost && <img src={selectedPost.imageUrl} alt="Post" />}
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.content}</p>
            <Button onClick={handleCloseModal}>닫기</Button>
          </ModalContent>
        </ModalWrapper>
      )}
    </>
  );
}
export default RestaurantPost;
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);

  h2 {
    margin-bottom: 10px;
  }

  img {
    width: 60vw;
    height: 70vh;
    margin-bottom: 10px;
  }
`;
const Like = styled.button`
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 100%;
  cursor: pointer;
  color: ${(props) => (props.isLiked ? "red" : "black")};
`;
