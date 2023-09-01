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
} from "../components/TabPostStyled";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { db, auth } from "../firebase";
import { useQuery } from "react-query";
import PostingModal from "./CommentsModal";
import Heart from "./Heart";

function RestaurantPost() {
  const userId = auth.currentUser?.uid;

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
  const getPublicPosts = async () => {
    const postsCollectionRef = collection(db, "posts");

    const querySnapshot = await getDocs(
      query(postsCollectionRef, where("isPublic", "==", true))
    );

    const PublicPosts = querySnapshot.docs.map((postDoc) => {
      const data = postDoc.data();

      return {
        ...data,
        postId: postDoc.id,
      };
    });
    return PublicPosts;
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
  const { data: PublicPosts } = useQuery("fetchPublicPosts", getPublicPosts);

  const filterdPosts = PublicPosts?.filter((post) => post?.category === "맛집");
  console.log(filterdPosts);
  return (
    <>
      {filterdPosts?.map((item) => (
        <CommunityPosting key={item.postId}>
          <div>
            {item.photo ? (
              <>
                <PostImgBox>
                  <PostImgUrl src={item.photo}></PostImgUrl>
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
                    <FontAwesomeIcon
                      key={index}
                      icon={faStar}
                      style={{ color: "#ff4e50" }}
                      size="lg"
                    />
                  ))}
              </h2>

              <p>
                <FontAwesomeIcon icon={faLocationDot} size="lg" />
                &nbsp;{item.place.address_name}
              </p>
            </PostContent>
            <PostBottomBar>
              <hr />
              <ButtonSet>
                <Heart userData={userData} item={item} />
                <LikeCount>{item.likeCount}</LikeCount>
                <Button
                  onClick={() => {
                    handlePostClick(item);
                  }}
                >
                  <FontAwesomeIcon icon={faComment} size="lg" />
                </Button>
                <LikeCount>{item.commentCount}</LikeCount>
                <Button>
                  <FontAwesomeIcon icon={faArrowUpFromBracket} size="lg" />
                </Button>
              </ButtonSet>
            </PostBottomBar>
          </div>
        </CommunityPosting>
      ))}
      <PostingModal
        userData={userData}
        Button={Button}
        selectedPost={selectedPost}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setSelectedPostId={setSelectedPost}
      />
    </>
  );
}
export default RestaurantPost;
