import React from "react";
import { getPublicPosts } from "../api/collection";
import { useQuery } from "react-query";
import styled from "styled-components";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function MonthPost() {
  const { data: PublicPosts } = useQuery(`fetchPublicPosts`, getPublicPosts);
  console.log(PublicPosts);
  const favoritePost = PublicPosts?.sort((a, b) => b.likeCount - a.likeCount);
  console.log("like", favoritePost);
  return (
    <div>
      {favoritePost?.slice(0, 5).map((p) => (
        <FavoritePostCard key={p.postId}>
          {p.photo ? (
            <FavoritePostImg>
              <FavoritePostImgUrl src={p.photo}></FavoritePostImgUrl>
            </FavoritePostImg>
          ) : (
            <FavoritePostImg>
              <FavoritePostImgUrl
                src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%8A%A4%ED%8C%8C%EA%B2%8C%ED%8B%B0%20ETG.png?alt=media&token=a16fadeb-f562-4c12-ad73-c4cc1118a108"
                alt="게시물 사진 없을 때 뜨는 이미지"
              />
            </FavoritePostImg>
          )}
          <FavoritePostContent>
            <FavoriteName>
              {p.place.place_name}
              <br />
              {Array(p.star)
                .fill()
                .map((_, index) => (
                  <FontAwesomeIcon key={index} icon={faStar} style={{ color: "#ff4e50" }} size="sm" />
                ))}
            </FavoriteName>
          </FavoritePostContent>
        </FavoritePostCard>
      ))}
    </div>
  );
}

export default MonthPost;
const FavoritePostCard = styled.div`
  width: 18vw;
  height: 12vh;
  margin-left: 0.9rem;
  /* background-color: rgb(40, 97, 141); */
  display: flex;
`;
const FavoritePostImg = styled.div`
  width: 5vw;
  height: 10.5vh;
  /* background-color: black; */
  margin-left: 0.9rem;
  border-radius: 0.7rem;
  margin-top: 0.5rem;
`;
const FavoritePostImgUrl = styled.img`
  width: 5.5vw;
  height: 11vh;

  object-fit: cover;
  border-radius: 0.7rem;
  display: block;
`;
const FavoritePostContent = styled.div`
  width: 11vw;
  height: 11vh;
  margin-left: 1rem;
  /* background-color: #fffafa; */
`;
const FavoriteName = styled.div`
  /* background-color: #d3abab; */
  float: left;
  width: 11vw;
  height: 8vh;
  margin-top: 1.2rem;
  font-size: 0.9rem;
  font-weight: bold;
`;
