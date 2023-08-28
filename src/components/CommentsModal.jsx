import { useMutation, useQueryClient } from "react-query";
import { db, auth } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import {
  ModalWrapper,
  ModalContent,
  SubmitButton,
  InputBox,
  Form,
  CommentWrap,
} from "./TabPostStyled";
function PostingModal({
  userData,
  Button,
  openModal,
  setOpenModal,
  selectedPost,
  setSelectedPostId,
}) {
  const authStore = useAuthStore();
  const displayName = authStore.user?.displayName;
  const isLogIn = authStore.user !== null;
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //모달 닫기
  const handleCloseModal = () => {
    // 배경 페이지 스크롤 활성화
    document.body.style.overflow = "auto";
    setOpenModal(false);
    setSelectedPostId(null);
  };
  const addCommentMutation = useMutation(async (newComment) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      userComments: [...userData.userComments, newComment],
    });
    // Refetch user data after adding a comment
    queryClient.invalidateQueries("fetchUserData");
  });

  //  댓글 작성 버튼 핸들러
  const handleSubmit = async (e, postId) => {
    e.preventDefault();
    console.log(postId);
    const commentInput = e.target.comment;
    const comment = commentInput.value;

    if (!isLogIn) {
      alert("로그인 후 이용해주세요!");
      navigate("/signin");
      return;
    }
    if (comment === "") {
      alert("댓글을 입력해주세요");
      return;
    }
    const newComment = {
      nickName: displayName,
      postId: postId,
      comment: comment,
      date: new Date().toISOString(),
    };

    await addCommentMutation.mutate(newComment);
    commentInput.value = "";
  };

  // 댓글 시간
  const elapsedTime = (date) => {
    const start = new Date(date);
    const end = new Date();
    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (seconds < 60) return "방금 전";
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분 전`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간 전`;
    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}일 전`;
    return `${start.toLocaleDateString()}`;
  };

  return (
    <>
      {openModal && selectedPost && (
        <ModalWrapper>
          <ModalContent>
            {selectedPost && <img src={selectedPost.imageUrl} alt="Post" />}
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.content}</p>

            <Form onSubmit={(e) => handleSubmit(e, selectedPost.postId)}>
              <InputBox
                name="comment"
                placeholder="댓글을 작성해주세요"
              ></InputBox>
              <SubmitButton type="submit">작성</SubmitButton>
            </Form>
            {userData?.userComments?.map(
              (comment) =>
                comment.postId === selectedPost.postId && (
                  <CommentWrap>
                    <div key={comment.id}>
                      <span>{comment.nickName}:&nbsp;</span> {comment.comment}
                      <span>{elapsedTime(comment.date)}</span>
                    </div>
                  </CommentWrap>
                )
            )}

            <Button onClick={handleCloseModal}>닫기</Button>
          </ModalContent>
        </ModalWrapper>
      )}
    </>
  );
}

export default PostingModal;
