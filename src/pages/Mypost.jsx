import React from "react";
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen, faHeart, faRectangleList } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { getPosts } from "../api/collection";
import PostEditModal from "../components/PostEditModal";
import { deletePost } from "../api/collection";
import DeleteModal from "../components/DeleteModal";
import PostingModal from "../components/CommentsModal";
function Mypost() {
  const { data: postData } = useQuery(`fetchPostData`, getPosts);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPostData, setCurrentPostData] = useState(null);
  const [currentCategory, setCurrentCategory] = useState("맛집");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const categories = ["맛집", "술집", "카페"];
  const queryClient = useQueryClient();
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

  const mutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("fetchPostData");
    },
  });

  const handleDeleteButton = (postID) => {
    setDeletePostId(postID);
    setIsDeleteModalOpen(true);
  };
  const confirmDeletion = async () => {
    try {
      await mutation.mutateAsync(deletePostId);
      setIsDeleteModalOpen(false);
    } catch (error) {}
  };

  const categoryButtonClickHandler = (category) => {
    setCurrentCategory(category);
  };
  const handleEditButtonClick = (postData) => {
    setCurrentPostData(postData);
    setModalOpen(true);
  };
  //로그인한 유저 상태확인해서 그걸로 그 유저가 작성한 글만 가져와야함
  return (
    <>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDeletion}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      {modalOpen && currentPostData && (
        <PostEditModal modalOpen={modalOpen} onRequestClose={() => setModalOpen(false)} postData={currentPostData} />
      )}
      <PostCardsContainer>
        <MyPostsTitle>
          <PostTitle>
            <FontAwesomeIcon icon={faRectangleList} /> 나의 기록 &nbsp;
            <span style={{ color: "#D0D0DE" }}>{postData?.length}</span>
          </PostTitle>
          {categories.map((category) => (
            <CategoryButton
              onClick={() => categoryButtonClickHandler(category)}
              id={category}
              currentCategory={currentCategory}
            >
              {category}
            </CategoryButton>
          ))}
        </MyPostsTitle>
        <PostCards>
          {postData
            ?.filter((post) => post.category === currentCategory)
            .sort((a, b) => b.timestamp?.toDate().getTime() - a.timestamp?.toDate().getTime())
            .map((post) => (
              <PostCard key={post.docID}>
                <TimeLine>
                  <Circle />
                  <Line />
                </TimeLine>
                <Post>
                  <Date>{post.timestamp?.toDate().toLocaleDateString()}</Date>
                  <ImageAndContents>
                    <PostImage
                      onClick={() => {
                        handlePostClick(post, post.docID);
                      }}
                      src={
                        post.photo
                          ? post.photo
                          : "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%8A%A4%ED%8C%8C%EA%B2%8C%ED%8B%B0%20ETG.png?alt=media&token=a16fadeb-f562-4c12-ad73-c4cc1118a108"
                      }
                    />
                    <PostContents>
                      <PostTitle>{post.place.place_name}</PostTitle>
                      {post.isPublic ? (
                        <IsPublic>
                          <FontAwesomeIcon icon={faLockOpen} style={{ color: "gray" }} /> 공개
                        </IsPublic>
                      ) : (
                        <IsPublic>
                          <FontAwesomeIcon icon={faLock} style={{ color: "gray" }} /> 비공개
                        </IsPublic>
                      )}
                      {/* <PostContent>{post.content}</PostContent> */}
                      <LikesCount>
                        <FontAwesomeIcon icon={faHeart} style={{ color: "gray" }} />
                        &nbsp;{post.likeCount}
                      </LikesCount>
                    </PostContents>
                  </ImageAndContents>
                </Post>
                <EditDeleteButtons>
                  <EditButton onClick={() => handleEditButtonClick(post)}>수정</EditButton>|
                  <DeleteButton
                    onClick={() => {
                      handleDeleteButton(post.postID);
                    }}
                  >
                    삭제
                  </DeleteButton>
                </EditDeleteButtons>
              </PostCard>
            ))}
        </PostCards>
      </PostCardsContainer>
      <PostingModal
        selectedPost={selectedPost}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setSelectedPostId={setSelectedPost}
      />
    </>
  );
  //map함수를 쓰는 이유 : 대량 데이터를 처리하기 위함
}

export default Mypost;

// 스타일컴포넌트
const PostCardsContainer = styled.div`
  margin: 5vh auto;
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 73vh;
  border-radius: 18px;
  background-color: white;
  box-shadow: 1px 1px 1px 1px #e7e7e7;
`;
const MyPostsTitle = styled.div`
  width: 100%;
  padding: 2rem 0rem 1rem 2rem;
  /* background-color: green; */
`;
const CategoryButton = styled.button`
  margin-top: 2rem;
  margin-right: 1rem;
  font-weight: bold;
  width: 5rem;
  height: 2.5rem;
  border: none;
  border-radius: 10px;
  color: ${(props) => (props.id === props.currentCategory ? "white" : "gray")};
  background-color: ${(props) => (props.id === props.currentCategory ? "#FF4E50" : "#e8e8ef")};
  cursor: pointer;
`;
const PostCards = styled.div`
  overflow-y: scroll;
  padding-top: 2rem;
`;
const PostCard = styled.div`
  position: relative;
  width: 100%;
  height: 18rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Post = styled.div`
  height: 100%;
`;
const Date = styled.div`
  height: 30px;
  line-height: 30px;
  color: gray;
  font-size: 20px;
`;
const ImageAndContents = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-top: 10px;
  margin-bottom: 10rem;
  height: 12rem;
`;
const TimeLine = styled.div`
  width: 4rem;
  margin-left: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Circle = styled.div`
  width: 23px;
  height: 23px;
  background-color: #d0d0de;
  border-radius: 50%;
`;
const Line = styled.div`
  width: 3px;
  height: 100%;
  background-color: #d0d0de;
`;

const PostTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

const IsPublic = styled.div`
  color: gray;
  font-size: 17px;
`;
const PostImage = styled.img`
  width: 20rem;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
`;
const LikesCount = styled.div`
  margin-top: 2.5rem;
  color: gray;
  font-size: 18px;
`;
const PostContents = styled.div`
  position: relative;
  padding: 15px;
  line-height: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;
const EditDeleteButtons = styled.div`
  position: absolute;
  right: 15px;
`;
const EditButton = styled.button`
  background-color: transparent;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition-duration: 0.3s;
  &:hover {
    color: #ff4e50;
  }
`;

const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition-duration: 0.3s;
  &:hover {
    color: #ff4e50;
  }
`;
