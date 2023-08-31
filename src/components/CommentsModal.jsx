import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  where,
  query,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import useAuthStore from "../store/auth";
import {
  ModalWrapper,
  ModalContent,
  SubmitButton,
  InputBox,
  Form,
  CommentWrap,
  CommentButton,
  CloseButton,
  CommentInput,
  ContentArea,
} from "./TabPostStyled";
import { nanoid } from "nanoid";
function PostingModal({
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
  // 댓글 수정
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  // 댓글 세기
  const [commentCount, setCommentCount] = useState(0);
  //모달 닫기
  const handleCloseModal = () => {
    // 배경 페이지 스크롤 활성화
    document.body.style.overflow = "auto";
    setOpenModal(false);
    setSelectedPostId(null);
  };

  // //게시물 댓글 가져오기
  const getPostComments = async (postId) => {
    const commentsCollectionRef = collection(db, "postComments");

    const querySnapshot = await getDocs(
      query(commentsCollectionRef, where("postId", "==", postId))
    );
    const PostComments = querySnapshot.docs.map((commentsDoc) => {
      const data = commentsDoc.data();
      return {
        ...data,
      };
    });
    return PostComments;
  };

  const { data: PostComments } = useQuery(
    "fetchPostComments",
    () => getPostComments(selectedPost.postId),
    {
      enabled: !!selectedPost?.postId,
      onSuccess: () => {
        setCommentCount(0); // 초기 댓글 개수 0으로 설정
      },
    }
  );
  console.log("postComments", PostComments);

  // 댓글 추가
  const addCommentMutation = useMutation(
    async (newComment) => {
      const commentsCollectionRef = collection(db, "postComments");
      await addDoc(commentsCollectionRef, newComment);
    },
    {
      onSuccess: async () => {
        const postDocRef = doc(db, "posts", selectedPost.postId);
        const postSnapshot = await getDoc(postDocRef);
        const currentCommentCount = postSnapshot.data().commentCount;

        // 게시물의 commentCount 업데이트
        await updateDoc(postDocRef, {
          commentCount: currentCommentCount + 1,
        });

        queryClient.invalidateQueries("fetchPostComments");

        // fetchPublicPosts 쿼리 다시 호출하여 게시물 리스트 업데이트
        queryClient.invalidateQueries("fetchPublicPosts");
      },
    }
  );

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
      userId: userId,
      comment: comment,
      date: new Date().toISOString(),
      commentId: nanoid(),
    };

    await addCommentMutation.mutateAsync(newComment);

    commentInput.value = "";
  };
  // 댓글 삭제
  const deleteCommentMutation = useMutation(async (commentId) => {
    const commentsCollectionRef = collection(db, "postComments");
    const querySnapshot = await getDocs(
      query(commentsCollectionRef, where("commentId", "==", commentId))
    );
    if (!querySnapshot.empty) {
      const commentDocRef = doc(db, "postComments", querySnapshot.docs[0].id);
      await deleteDoc(commentDocRef);
    }

    // 해당 게시물의 commentCount 업데이트
    const postDocRef = doc(db, "posts", selectedPost.postId);
    const postSnapshot = await getDoc(postDocRef);
    const currentCommentCount = postSnapshot.data().commentCount;
    await updateDoc(postDocRef, {
      commentCount: currentCommentCount - 1,
    });

    queryClient.invalidateQueries("fetchPostComments");
  });
  // 댓글 수정
  const handleEdit = (commentId, currentComment) => {
    setEditingCommentId(commentId);
    setEditedComment(currentComment);
  };

  const handleSaveEdit = async (commentId, postId) => {
    const commentsCollectionRef = collection(db, "postComments");

    // 댓글의 commentId를 사용하여 해당 댓글 문서를 찾음
    const querySnapshot = await getDocs(
      query(commentsCollectionRef, where("commentId", "==", commentId))
    );

    if (!querySnapshot.empty) {
      const commentDocRef = querySnapshot.docs[0].ref; // 첫 번째 문서의 참조를 가져옴

      const updatedComment = {
        nickName: displayName,
        postId: postId,
        userId: userId,
        comment: editedComment,
        commentId: commentId,
        date: new Date().toISOString(),
      };

      // 업데이트할 필드의 경로를 지정하여 업데이트 수행
      await updateDoc(commentDocRef, updatedComment);

      queryClient.invalidateQueries("fetchPostComments");

      // 수정 완료 후 상태 초기화
      setEditingCommentId(null);
      setEditedComment("");
    }
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
  // 게시물의 댓글 수 업데이트
  const updatePostCommentCount = async (postId, newCommentCount) => {
    const postDocRef = doc(db, "posts", postId);
    await updateDoc(postDocRef, {
      commentCount: newCommentCount,
    });
  };
  return (
    <>
      {openModal && selectedPost && (
        <ModalWrapper>
          <ModalContent>
            {selectedPost && <img src={selectedPost.imageUrl} alt="Post" />}
            <h2>{selectedPost.title}</h2>
            <ContentArea>{selectedPost.content}</ContentArea>

            <Form onSubmit={(e) => handleSubmit(e, selectedPost.postId)}>
              <InputBox
                name="comment"
                placeholder="댓글을 작성해주세요"
              ></InputBox>
              <SubmitButton type="submit">작성</SubmitButton>
            </Form>
            {PostComments?.map(
              (comment) =>
                comment.postId === selectedPost.postId && (
                  <CommentWrap key={comment.commentId}>
                    <div>
                      <span>{comment.nickName}:&nbsp;</span>
                      {editingCommentId === comment.commentId ? (
                        <>
                          <CommentInput
                            type="text"
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                if (editingCommentId === comment.commentId) {
                                  handleSaveEdit(
                                    comment.commentId,
                                    comment.postId
                                  );
                                }
                              }
                            }}
                          />
                          <CommentButton
                            onClick={() => {
                              handleSaveEdit(comment.commentId, comment.postId);
                            }}
                          >
                            저장
                          </CommentButton>
                        </>
                      ) : (
                        <>
                          {comment.comment}&nbsp;
                          <span>{elapsedTime(comment.date)}</span>
                          {comment.userId === userId && (
                            <>
                              <CommentButton
                                onClick={() =>
                                  handleEdit(comment.commentId, comment.comment)
                                }
                              >
                                수정
                              </CommentButton>
                              <CommentButton
                                onClick={() =>
                                  deleteCommentMutation.mutate(
                                    comment.commentId
                                  )
                                }
                              >
                                삭제
                              </CommentButton>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </CommentWrap>
                )
            )}
            <CloseButton onClick={handleCloseModal}>X</CloseButton>
          </ModalContent>
        </ModalWrapper>
      )}
    </>
  );
}

export default PostingModal;
