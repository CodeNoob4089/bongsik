import React, { useState } from "react";
import { Like } from "../components/TabPostStyled";
import { updateDoc, doc, getDoc, arrayUnion } from "firebase/firestore";
import { useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { db, auth } from "../firebase";
import { useMutation } from "react-query";
import useAuthStore from "../store/auth";
import { useNavigate } from "react-router";
function Heart({ userData, post, selectedPost, setSelectedPostId, setSelectedPost }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const isLogIn = authStore.user !== null;
  const userId = auth.currentUser?.uid;
  const [isClickProcessing, setIsClickProcessing] = useState(false);
  // 모달 상태 업데이트
  const updateSelectedLikePost = (updatedPost) => {
    setSelectedPost(updatedPost);
  };

  const mutation = useMutation(
    async () => {
      const postIdToUse = post?.postId || selectedPost?.postId;
      const alreadyLikedUser = userData?.userLikes?.find((like) => like.likePostId === postIdToUse);
      console.log("alreadyLikedUser", alreadyLikedUser);
      // mutation 함수 내부에서만 userDocRef를 생성합니다.
      const userDocRef = doc(db, "users", userId);

      const postDocRef = doc(db, "posts", postIdToUse);

      const postSnapshot = await getDoc(postDocRef);
      const currentLikeCount = postSnapshot.data().likeCount;
      const updatedLikePost = alreadyLikedUser
        ? { ...selectedPost, likeCount: currentLikeCount - 1 }
        : { ...selectedPost, likeCount: currentLikeCount + 1 };
      updateSelectedLikePost(updatedLikePost);
      await updateDoc(postDocRef, {
        likeCount: alreadyLikedUser ? currentLikeCount - 1 : currentLikeCount + 1,
      });

      queryClient.invalidateQueries("fetchPublicRestaurantPosts");
      if (alreadyLikedUser) {
        await updateDoc(userDocRef, {
          userLikes: userData?.userLikes?.filter((like) => like.likePostId !== postIdToUse),
        });
      } else {
        await updateDoc(userDocRef, {
          userLikes: arrayUnion({ likePostId: postIdToUse }),
        });
      }

      queryClient.invalidateQueries("fetchUserData");

      const userSnapshot = await getDoc(userDocRef);
      const updatedUserData = userSnapshot.data();

      return updatedUserData;
    },
    {
      onSuccess: async (updatedUserData) => {
        // onSuccess 핸들러에서도 별도로 userDorRef를 생성합니다.
        const userDorOnSuccess = doc(db, "users", userId);

        if (updatedUserData.userLikes.length >= 1 && !updatedUserData.ownedBadges?.fBQFJ6xzfDovK0N3FedE.isOwned) {
          await updateDoc(userDorOnSuccess, {
            "ownedBadges.fBQFJ6xzfDovK0N3FedE.isOwned": true,
          });

          alert("첫 좋아요 누르기 조건을 달성하여 뱃지를 획득합니다!");
        }

        if (updatedUserData.userLikes.length >= 10 && !updatedUserData.ownedBadges?.xplIFBYaDPZfiBUPg8nV.isOwned) {
          await updateDoc(userDorOnSuccess, {
            "ownedBadges.xplIFBYaDPZfiBUPg8nV.isOwned": true,
          });

          alert("좋아요 10개 누르기 조건을 달성하여 뱃지를 획득합니다!");
        }

        if (updatedUserData.userLikes.length >= 30 && !updatedUserData.ownedBadges?.wR3TzKNMDzPPwCLA8c1f.isOwned) {
          await updateDoc(userDorOnSuccess, {
            "ownedBadges.wR3TzKNMDzPPwCLA8c1f.isOwned": true,
          });

          alert("좋아요 30개 누르기 조건을 달성하여 뱃지를 획득합니다!");
        }
      },
    }
  );
  const clickHeart = async () => {
    if (!isLogIn) {
      alert("로그인 후 이용해주세요!");
      navigate("/signin");
      return;
    }
    if (mutation.isLoading) return;
    setIsClickProcessing(true);
    console.log("clickHeart 함수가 호출");
    mutation.mutate();
  };

  return (
    <>
      <Like
        isLiked={userData?.userLikes?.some((like) => like.likePostId === (post?.postId || selectedPost?.postId))}
        onClick={() => {
          clickHeart(
            post?.postId || selectedPost?.postId,
            userData?.userLikes?.some((like) => like.likePostId === (post?.postId || selectedPost?.postId))
          );
        }}
      >
        <FontAwesomeIcon icon={faHeart} size="lg" />
      </Like>
    </>
  );
}

export default Heart;
