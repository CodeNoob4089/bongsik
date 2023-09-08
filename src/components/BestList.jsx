import React from "react";
import { getPosts } from "../api/collection";
import { useQuery } from "react-query";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function BestList() {
  const { data: postData } = useQuery(`fetchPostData`, getPosts);
  const bestPosts = postData?.filter((post) => post.star === 5);
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <ListContainer>
      <ListTitle>최고였어요!!</ListTitle>
      {bestPosts && (
        <CarouselBox responsive={responsive} arrows={false} autoPlay autoPlaySpeed={2000} infinite>
          {bestPosts?.map((post) => {
            return (
              <PostCard key={post.postId}>
                <ImageBox src={post.photo ? post.photo : ""} />
                <InfoBox>
                  <PostTitle>{post.place.place_name}</PostTitle>
                  <Star>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon icon={faStar} color={i + 1 <= post.star ? "#ff4e50" : "gray"} />
                    ))}
                  </Star>
                  <div>{post.timestamp?.toDate().toLocaleDateString()}</div>
                </InfoBox>
              </PostCard>
            );
          })}
        </CarouselBox>
      )}
    </ListContainer>
  );
}

export default BestList;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
const ListTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: -5rem;
`;
const CarouselBox = styled(Carousel)`
  width: 40rem;
  height: 30rem;
  z-index: 49;
  margin-left: 13rem;
`;
const PostCard = styled.div`
  width: 30rem;
  height: 15rem;
  display: flex;
  border-radius: 1rem;
  box-shadow: 3px 3px 3px #bbbbbb;
  align-items: center;
`;
const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
  border-left: 1px solid gray;
`;
const ImageBox = styled.img`
  width: 10rem;
  height: 10rem;
  object-fit: cover;
`;
const Star = styled.div`
  display: flex;
  margin-bottom: 5.5rem;
`;
const PostTitle = styled.h3`
  font-size: 1.05rem;
  margin-bottom: 1rem;
`;
