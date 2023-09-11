import React from "react";
import { getPublicPosts } from "../api/collection";
import { useQuery } from "react-query";
import styled from "styled-components";
function MonthPost() {
  const { data: PublicPosts } = useQuery(`fetchPublicPosts`, getPublicPosts);
  console.log(PublicPosts);
  const favoritePost = PublicPosts?.sort((a, b) => b.likeCount - a.likeCount);
  console.log("like", favoritePost);
  return (
    <div>
      {/* {favoritePost?.map((p) => (
        <FavoritePostCard key={p.postId}>
          <FavoritePostImg>
            <FavoritePostImgUrl src={p.photo}></FavoritePostImgUrl>
          </FavoritePostImg>
        </FavoritePostCard>
      ))} */}
    </div>
  );
}

export default MonthPost;
const FavoritePostCard = styled.div`
  width: 18vw;
  height: 12vh;
  margin-left: 0.9rem;
  background-color: rgb(40, 97, 141);
  display: flex;
`;
const FavoritePostImg = styled.div`
  width: 5.5vw;
  height: 11vh;
  background-color: black;
  margin-left: 0.9rem;
  border-radius: 0.7rem;
`;
const FavoritePostImgUrl = styled.img`
  width: 5.5vw;
  height: 11vh;
  object-fit: cover;
  border-radius: 0.7rem;
  display: block;
`;
