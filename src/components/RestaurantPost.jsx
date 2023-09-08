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
} from "../components/TabPostStyled";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
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
      query(postsCollectionRef, where("isPublic", "==", true) && where("category", "==", category))
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

  //유저 좋아요 정보 가져오기
  const getUserData = async () => {
    const userDocRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(userDocRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      return {
        userLikes: userData?.userLikes || [],
      };
    } else {
      return {
        userLikes: [],
      };
    }
  };

  const { data: userData } = useQuery("fetchUserData", getUserData);
  const { data: RestaurantPublicPosts } = useQuery("fetchPublicRestaurantPosts", getPublicRestaurantPosts);

  return (
    <>
      {RestaurantPublicPosts?.map((item) => (
        <CommunityPosting key={item.postId}>
          <PostContainer>
            {item.photo ? (
              <>
                <PostImgBox>
                  <PostImgUrl
                    src={item.photo}
                    onClick={() => {
                      handlePostClick(item);
                    }}
                  ></PostImgUrl>
                </PostImgBox>
              </>
            ) : (
              <>
                <PostImgBox>
                  {/* <PostImgUrl src={}> </PostImgUrl> */}
                  무슨 사진 넣을지 고민중
                </PostImgBox>
              </>
            )}
            <PostContent>
              <h2>
                {item.place.place_name}&nbsp;
                {Array(item.star)
                  .fill()
                  .map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} style={{ color: "#ff4e50" }} />
                  ))}
              </h2>
              <p>
                <DetailLocation>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/location.png?alt=media&token=4850f645-0cac-41c4-91f5-595f28d33b79"
                    style={{
                      width: "0.9rem",
                      height: "1.1rem",
                      marginRight: "0.3rem",
                      float: "left",
                    }}
                    alt="위치 아이콘"
                  />
                  {item.place.address_name}
                </DetailLocation>
                <br />
              </p>
              <hr />
            </PostContent>
            <PostBottomBar>
              <ButtonSet>
                <Heart userData={userData} item={item} />
                <LikeCount>{item.likeCount}</LikeCount>
                <Button
                  onClick={() => {
                    handlePostClick(item);
                  }}
                >
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EB%8C%93%EA%B8%80%20%EC%95%84%EC%9D%B4%EC%BD%98.png?alt=media&token=0f14a325-e157-47ae-aaa9-92adfb4a8434"
                    style={{
                      width: "1.2rem",
                      height: "1.1rem",
                      marginRight: "0.3rem",
                      float: "left",
                    }}
                    alt="댓글 아이콘"
                  />
                </Button>
                <LikeCount>{item.commentCount}</LikeCount>
              </ButtonSet>
            </PostBottomBar>
          </PostContainer>
        </CommunityPosting>
      ))}
      <PostingModal
        selectedPost={selectedPost}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setSelectedPostId={setSelectedPost}
        RestaurantPublicPosts={RestaurantPublicPosts}
      />
    </>
  );
}
export default RestaurantPost;
