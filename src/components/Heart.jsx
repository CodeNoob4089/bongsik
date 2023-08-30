import React, { useState } from "react";
import { Like } from "../components/TabPostStyled";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { db, auth } from "../firebase";
function Heart({ userData, item }) {
  const userId = auth.currentUser?.uid;
  const [isClickProcessing, setIsClickProcessing] = useState(false);
  // 필터링된 포스트 상태 정의
  const [filteredPosts, setFilteredPosts] = useState([]);
  //모달 열기
  // 찜하기
  const clickHeart = async (postId, isLiked) => {
    const alreadyLikedUser = userData?.userLikes?.find(
      (like) => like.likePostId === postId
    );
    if (isClickProcessing) return; // 클릭 처리 중인 경우 클릭 방지

    setIsClickProcessing(true); // 클릭 처리 시작

    const userDocRef = doc(db, "users", userId);
    const postDocRef = doc(db, "posts", postId);
    //현재 찜한 수 바꾸기
    const postSnapshot = await getDoc(postDocRef);
    const currentLikeCount = postSnapshot.data().likeCount;
    await updateDoc(postDocRef, {
      likeCount: isLiked
        ? currentLikeCount - (alreadyLikedUser ? 1 : 0)
        : currentLikeCount + (alreadyLikedUser ? 0 : 1),
    });

    if (alreadyLikedUser) {
      await updateDoc(userDocRef, {
        userLikes: userData?.userLikes.filter(
          (like) => like.likePostId !== postId
        ),
      });
    } else {
      await updateDoc(userDocRef, {
        userLikes: [...userData?.userLikes, { likePostId: postId }],
      });
    }
    //찜한 수 가져오기
    await Promise.all([
      updateDoc(postDocRef, {}),
      getDoc(postDocRef).then((snap) => {
        const updatedLikeCount = snap.data().likeCount;
        updateLikeCountInState(postId, updatedLikeCount);
        console.log(updatedLikeCount);
      }),
    ]);
    // 하트색 바로 바뀌게 하려고 넣어둠
    setTimeout(() => {
      alert("찜");
      setIsClickProcessing(false); // 클릭 처리 완료 후 클릭 활성화
    }, 100);
  };
  // 상태 업데이트 함수 정의
  const updateLikeCountInState = (postId, updatedLikeCount) => {
    setFilteredPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.postId === postId) {
          return { ...post, likeCount: updatedLikeCount };
        }
        return post;
      })
    );
  };
  return (
    <>
      <Like
        isLiked={userData?.userLikes?.some(
          (like) => like.likePostId === item.postId
        )}
        onClick={() => {
          clickHeart(
            item.postId,
            userData?.userLikes?.some((like) => like.likePostId === item.postId)
          );
        }}
      >
        <FontAwesomeIcon icon={faHeart} size="lg" />
      </Like>
    </>
  );
}

export default Heart;
