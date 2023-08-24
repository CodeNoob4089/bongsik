import React from "react";
import styled from "styled-components";
import {
  CommunityPosting,
  PostImgBox,
  PostImgUrl,
  PostContent,
  PostBottomBar,
  Button,
} from "../components/TabPostStyled";
const getPostsData = async () => {
  // collection 이름이 posts인 collection의 모든 document를 가져옵니다.
  const querySnapshot = await getDocs(query(collection(db, " posts")));
  const postsData = [];

  querySnapshot.forEach((doc) => {
    // console.log(`${doc.id} => ${doc.data()}`);

    posts.push({
      postId: doc.id,
      imageUrl: data.imageUrl, // 예시: 'imageUrl'가 사진의 URL이라고 가정
      content: data.content,
    });
  });

  return postsData;
};
function RestaurantPost() {
  return (
    <CommunityPosting>
      <PostImgBox>
        <PostImgUrl></PostImgUrl>
      </PostImgBox>
      <PostContent></PostContent>
      <PostBottomBar>
        <Button>조회수</Button>
        <Button>찜</Button>
        <Button>댓글</Button>
        <Button>공유</Button>
      </PostBottomBar>
    </CommunityPosting>
  );
}
export default RestaurantPost;
