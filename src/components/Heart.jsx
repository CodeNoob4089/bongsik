import React, { useState } from "react";
import { Like } from "../components/TabPostStyled";
import { updateDoc, doc, getDoc, arrayUnion } from "firebase/firestore";
import { useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { db, auth } from "../firebase";
import useAuthStore from "../store/auth";
function Heart({ userData, item }) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = auth.currentUser?.uid;
  const [isClickProcessing, setIsClickProcessing] = useState(false);
  // 필터링된 포스트 상태 정의
  const [filteredPosts, setFilteredPosts] = useState([]);
  //모달 열기
  // 찜하기
  const clickHeart = async (postId, isLiked) => {
    const alreadyLikedUser = userData?.userLikes?.find((like) => like.likePostId === postId);
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
    queryClient.invalidateQueries("fetchPublicPosts");

    if (alreadyLikedUser) {
      await updateDoc(userDocRef, {
        userLikes: userData?.userLikes?.filter((like) => like.likePostId !== postId),
      });
    } else {
      await updateDoc(userDocRef, {
        userLikes: arrayUnion({ likePostId: postId }),
      });
    }
    queryClient.invalidateQueries("fetchUserData");
    //찜한 수 가져오기
    const userSnapshot = await getDoc(userDocRef);
    const updatedUserData = userSnapshot.data();

    if (updatedUserData.userLikes.length >= 1 && !updatedUserData.ownedBadges?.fBQFJ6xzfDovK0N3FedE.isOwned) {
      await updateDoc(userDocRef, {
        "ownedBadges.fBQFJ6xzfDovK0N3FedE.isOwned": true,
      });
      alert("첫 좋아요 누르기 조건을 달성하여 뱃지를 획득합니다!");
    }
    if (updatedUserData.userLikes.length >= 10 && !updatedUserData.ownedBadges?.xplIFBYaDPZfiBUPg8nV.isOwned) {
      await updateDoc(userDocRef, {
        "ownedBadges.xplIFBYaDPZfiBUPg8nV.isOwned": true,
      });
      alert("좋아요 10개 누르기 조건을 달성하여 뱃지를 획득합니다!");
    }
    if (updatedUserData.userLikes.length >= 30 && !updatedUserData.ownedBadges?.wR3TzKNMDzPPwCLA8c1f.isOwned) {
      await updateDoc(userDocRef, {
        "ownedBadges.wR3TzKNMDzPPwCLA8c1f.isOwned": true,
      });
      alert("좋아요 10개 누르기 조건을 달성하여 뱃지를 획득합니다!");
    }

    await updateDoc(postDocRef, {});
    const updatedLikeCount = postSnapshot.data().likeCount;
    updateLikeCountInState(postId, updatedLikeCount);
    console.log(updatedLikeCount);
    // 하트색 바로 바뀌게 하려고 넣어둠
    setTimeout(() => {
      setIsClickProcessing(false); // 클릭 처리 완료 후 클릭 활성화
    }, 10);
  };
  // 상태 업데이트 함수 정의
  const updateLikeCountInState = (postId, updatedLikeCount) => {
    setFilteredPosts((prevPosts) =>
      prevPosts?.map((post) => {
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
        isLiked={userData?.userLikes?.some((like) => like.likePostId === item.postId)}
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
