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
function CafePost() {
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
export default CafePost;
