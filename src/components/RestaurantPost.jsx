import React, { useState } from "react";
import {
  CommunityPosting,
  PostImgBox,
  PostImgUrl,
  PostContent,
  PostBottomBar,
  Button,
  ButtonSet,
  LikeCount,
  DetailLocation,
  PostContainer,
  CommunityCount,
} from "../components/TabPostStyled";
import { getUserData } from "../api/collection";
import { collection, getDocs, query, where, doc, getDoc, orderBy, or, limit } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useQuery } from "react-query";
import PostingModal from "./CommentsModal";
import Heart from "./Heart";
import useAuthStore from "../store/auth";
import { useNavigate } from "react-router";
function RestaurantPost({ category }) {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;
  const isLogIn = authStore.user !== null;
  //모달
  const [openModal, setOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [, setSelectedPostId] = useState(null);
  //모달 열기
  const handlePostClick = (post) => {
    // 배경 페이지 스크롤 막기
    if (!isLogIn) {
      alert("로그인 후 이용해주세요!");
      navigate("/signin");
      return;
    }
    document.body.style.overflow = "hidden";
    setSelectedPost(post);
    setSelectedPostId(post.postId);
    setOpenModal(true);
  };
  // 음식점 공개 게시물 가져오기
  const getPublicRestaurantPosts = async () => {
    const postsCollectionRef = collection(db, "posts");

    const querySnapshot = await getDocs(
      query(
        postsCollectionRef,

        where("isPublic", "==", true),
        where("category", "==", category),
        orderBy("timestamp", "desc")
      )
    );

    const RestaurantPublicPosts = querySnapshot.docs.map((postDoc) => {
      const data = postDoc.data();

      return {
        ...data,
        postId: postDoc.id,
      };
    });
    return RestaurantPublicPosts;
  };

  // //유저 좋아요 정보 가져오기
  // const getUserData = async () => {
  //   const userDocRef = doc(db, "users", userId);
  //   const docSnapshot = await getDoc(userDocRef);
  //   if (docSnapshot.exists()) {
  //     const userData = docSnapshot.data();
  //     return {
  //       userLikes: userData?.userLikes || [],
  //     };
  //   } else {
  //     return {
  //       userLikes: [],
  //     };
  //   }
  // };

  const { data: userData } = useQuery("fetchUserData", getUserData, { enabled: userId !== undefined });
  const { data: RestaurantPublicPosts } = useQuery("fetchPublicRestaurantPosts", getPublicRestaurantPosts);
  const Length = RestaurantPublicPosts?.length;
  return (
    <>
      <CommunityCount>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EB%85%B8%ED%8A%B8%20%EC%95%84%EC%9D%B4%EC%BD%98.png?alt=media&token=5ef26e88-9fb4-4ef5-bc7c-9d110502f6b4"
          style={{ height: "0.9rem", marginRight: "0.4rem" }}
        />
        {category} 게시글: {Length}개
      </CommunityCount>
      {RestaurantPublicPosts?.map((post) => (
        <CommunityPosting key={post.postId}>
          <PostContainer>
            {post.photo ? (
              <>
                <PostImgBox>
                  <PostImgUrl
                    src={post.photo}
                    onClick={() => {
                      handlePostClick(post);
                    }}
                  ></PostImgUrl>
                </PostImgBox>
              </>
            ) : (
              <>
                <PostImgBox>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%8A%A4%ED%8C%8C%EA%B2%8C%ED%8B%B0%20ETG.png?alt=media&token=a16fadeb-f562-4c12-ad73-c4cc1118a108"
                    style={{
                      height: "22vh",
                      width: "13.5vw",
                      marginTop: "2rem",
                      borderRadius: "0.7rem",
                      display: "block",
                      margin: " 0 auto",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    alt="게시물 사진 없을 때 뜨는 이미지"
                    onClick={() => {
                      handlePostClick(post);
                    }}
                  />
                </PostImgBox>
              </>
            )}
            <PostContent>
              <h2
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handlePostClick(post);
                }}
              >
                {post.place.place_name}&nbsp;
              </h2>
              <p>
                <DetailLocation
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handlePostClick(post);
                  }}
                >
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/location.png?alt=media&token=4850f645-0cac-41c4-91f5-595f28d33b79"
                    style={{
                      width: "0.7rem",
                      height: "1rem",
                      marginRight: "0.4rem",
                      float: "left",
                    }}
                    alt="위치 아이콘"
                  />
                  {post.place.address_name}
                </DetailLocation>
                <br />
              </p>
              <hr />
              <PostBottomBar>
                <ButtonSet>
                  <Heart
                    userData={userData}
                    post={post}
                    setSelectedPost={setSelectedPost}
                    setSelectedPostId={setSelectedPostId}
                  />
                  <LikeCount>{post.likeCount}</LikeCount>
                  <Button>
                    <commentIcon>
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EB%8C%93%EA%B8%80%20%EC%95%84%EC%9D%B4%EC%BD%98.png?alt=media&token=0f14a325-e157-47ae-aaa9-92adfb4a8434"
                        style={{
                          width: "1rem",
                          height: "1rem",
                          marginRight: "0.1rem",
                          float: "left",
                          cursor: "pointer",
                        }}
                        alt="댓글 아이콘"
                        onClick={() => {
                          handlePostClick(post);
                        }}
                      />
                    </commentIcon>
                  </Button>
                  <LikeCount>{post.commentCount}</LikeCount>
                </ButtonSet>
              </PostBottomBar>
            </PostContent>
          </PostContainer>
        </CommunityPosting>
      ))}
      <PostingModal
        selectedPost={selectedPost}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setSelectedPost={setSelectedPost}
        setSelectedPostId={setSelectedPostId}
        RestaurantPublicPosts={RestaurantPublicPosts}
        userData={userData}
      />
    </>
  );
}
export default { RestaurantPost };
