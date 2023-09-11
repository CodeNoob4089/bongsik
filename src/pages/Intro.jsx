import { faGratipay } from "@fortawesome/free-brands-svg-icons";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Badge from "../components/Badge";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "../store/auth";
import { getPublicPosts } from "../api/collection";
function Intro() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const handlePostcard = () => {
    if (user !== null) {
      navigate("/community");
    } else {
      alert("해당 서비스는 로그인 후 이용 가능합니다.");
      navigate("/signin");
    }
  };

  const { data: PublicPosts } = useQuery("fetchPublicPosts", getPublicPosts);
  const randomPosts = PublicPosts?.sort(() => 0.4 - Math.random()).slice(0, 4);

  return (
    <>
      <TopImage>
        <Title>
          내가 남긴 솔직 리뷰를
          <br />
          모아놓은 맛 기록 다이어리
        </Title>
        <Description>
          ETG는 'Eat the ground'의 약자로, 나만의 음식점을 기록하면 지도에 색이 칠해지는 재미를 더한 서비스입니다.
          <br />맛 기록을 컬렉션으로 저장하고, 다른 사람의 맛 기록도 구경해보세요
        </Description>
        <Button
          onClick={() => {
            navigate("/main");
          }}
        >
          시작하기
        </Button>
      </TopImage>
      {/* 지도와 컬렉션 이미지*/}
      <MiddleContentsLeft>
        <img src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%A7%80%EB%8F%84%20%EC%BB%AC%EB%A0%89%EC%85%98%20%EC%82%AC%EC%A7%84.png?alt=media&token=4586ab73-b0ed-457e-92ef-f82587d63a8c" />
        <div>
          <MiddleTitle>지도와 컬렉션</MiddleTitle>
          <MiddleDescription>
            <p>맛집을 기록하면 지도에 색이 칠해집니다.</p>
            <p>같은 동에서 3개 이상 색을 칠하면 동 전체를 나의 맛집 영역으로 만들 수 있습니다.</p>
            <p>땅따먹기 게임 같은 재미를 느끼며 지도에 나만의 영역을 넓혀보세요!</p>
            <p>기록들은 컬렉션을 만들어 나만의 맛 기록 모음집처럼 보관할 수 있습니다.</p>
          </MiddleDescription>
        </div>
      </MiddleContentsLeft>
      {/* 뱃지/레벨 시스템 이미지 */}
      <MiddleContentsRight>
        <div>
          <MiddleTitle>
            <p>뱃지/레벨 시스템</p>
          </MiddleTitle>
          <MiddleDescription>
            <div>활동에 따라 뱃지를 획득하고 레벨을 올려보세요</div>
          </MiddleDescription>
        </div>
        <img
          className="badgeLevel"
          src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EB%B1%83%EC%A7%80%20%EC%82%AC%EC%A7%84.png?alt=media&token=3e6fc79a-be0c-4885-9789-4e264278f229"
        />
      </MiddleContentsRight>
      {/* 커뮤니티 */}
      <MiddleContentsLeft>
        <img
          className=""
          src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0%20%EC%82%AC%EC%A7%84.png?alt=media&token=1f14467a-abce-4115-b55f-d35d2b44cb54"
        />
        <div>
          <MiddleTitle>커뮤니티 기능</MiddleTitle>
          <MiddleDescription>
            내 기록을 다른 사람에게 공개하거나, <br />
            커뮤니티에서 다른 사람의 글에 좋아요와 댓글을 남겨보세요!
          </MiddleDescription>
        </div>
      </MiddleContentsLeft>
      <div
        style={{
          widtth: "100px",
          height: "700px",
          backgroundColor: "#ff4e50",
          textAlign: "center",
          fontSize: "50px",
        }}
      >
        <div style={{ marginTop: "5rem", color: "white" }}>이용방법</div>
        <img
          style={{ marginTop: "5rem" }}
          src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%9D%B4%EC%9A%A9%EB%B0%A9%EB%B2%95.png?alt=media&token=2cb6dd88-8af0-497b-b4cb-e007e1b30e6d"
        />
      </div>
      <MorePostContainer>
        <PostContainer>
          <PostTitle>최근 게시물</PostTitle>
          <PostCards>
            {randomPosts?.map((post) => {
              return (
                <PostCard key={post.postId} onClick={handlePostcard}>
                  <ImageBox src={post.photo ? post.photo : ""} />
                  <InfoBox>
                    <PostName>{post.place.place_name}</PostName>
                    <Address>
                      <Ping src="https://firebasestorage.googleapis.com/v0/b/bongsikmk3.appspot.com/o/ping.png?alt=media&token=d1ee5d83-0158-4208-9250-31d448731c5a" />
                      <div>{post.place.address_name}</div>
                    </Address>
                  </InfoBox>
                  <HeartComment>
                    <Heart>
                      <FontAwesomeIcon icon={faHeart} color="#ff4e50" size="lg" />
                      <Count>{post.likeCount}</Count>
                    </Heart>
                    <PostComment>
                      <FontAwesomeIcon icon={faComment} size="lg" />
                      <Count>{post.commentCount}</Count>
                    </PostComment>
                  </HeartComment>
                </PostCard>
              );
            })}
          </PostCards>
        </PostContainer>
        <MoreButton
          onClick={() => {
            navigate("/community");
          }}
        >
          더보기
          <ButtonImg src="https://firebasestorage.googleapis.com/v0/b/bongsikmk3.appspot.com/o/%EC%98%A4%EB%A5%B8%EC%AA%BD%20%EB%B2%84%ED%8A%BC.png?alt=media&token=40a874fe-efec-467e-a6a8-a08569236d2b" />
        </MoreButton>
      </MorePostContainer>
    </>
  );
}

export default Intro;

const TopImage = styled.div`
  width: 100%;
  height: 90vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url("https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%86%8C%EA%B0%9C%EC%82%AC%EC%A7%84.png?alt=media&token=d8c10c8d-798c-4f21-909a-d708a1b518ef");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  //필터에 브라이트니스를 주니까 사진이 어두워 졌는데 글씨까지 어두워짐. + 시작하기 버튼까지 어두워짐 해결해야함.
`;

const Title = styled.div`
  font-size: 3rem;
  line-height: 3rem;
  font-weight: 500;
`;

const Description = styled.div`
  font-size: 1rem;
  margin: 2rem 0 3rem 0;
  line-height: 1.3rem;
`;

const MiddleContentsLeft = styled.div`
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0vh 5vw;
  justify-content: left;
`;
const MiddleContentsRight = styled.div`
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0vh 10vw;
  justify-content: right;
`;

const MiddleTitle = styled.h1`
  margin-left: 2.5rem;
  font-weight: 700;
  font-size: 1.75rem;
  color: #2d2d30;
  p {
    font-weight: bold;
    text-align: right;
  }
`;

const MiddleDescription = styled.div`
  margin-left: 2.5rem;
  font-weight: 500;
  line-height: 1.5rem;
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #2d2d30;
  div {
    float: right;
    font-size: 1.5rem;
  }
`;

const Button = styled.button`
  font-size: 1rem;
  font-weight: bold;
  width: 8rem;
  height: 3.5rem;
  background-color: #fe4c4f;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition-duration: 0.5s;
  &:hover {
    background-color: #fdb9ba;
    color: white;
  }
`;

//16px : 1rem
const MorePostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const PostContainer = styled.div`
  width: 90vw;
  height: 70vh;
  margin-top: 8rem;
  margin-left: 5rem;
`;
const PostTitle = styled.h2`
  margin-bottom: 7rem;
  font-size: 1.8rem;
  font-weight: bold;
`;
const PostCards = styled.div`
  width: 90vw;
  display: flex;
  justify-content: space-between;
`;
const PostCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  width: 20rem;
  height: 25rem;
  border-radius: 1rem;
  padding-top: 1rem;
  box-sizing: border-box;
  box-shadow: 3px 3px 3px #bbbbbb;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
    z-index: 1;
  }
`;
const ImageBox = styled.img`
  width: 90%;
  height: 60%;
  border-radius: 1rem;
  object-fit: cover;
`;
const InfoBox = styled.div`
  margin-top: 1rem;
  align-self: self-start;
  margin-left: 1rem;
  font-size: 1.1rem;
`;
const PostName = styled.p`
  font-weight: bold;
  margin-bottom: 1rem;
`;
const Address = styled.div`
  display: flex;
`;
const Ping = styled.img`
  width: 1.3rem;
  height: 1.3rem;
`;
const HeartComment = styled.div`
  width: 90%;
  display: flex;
  margin-top: 2rem;
  align-self: self-start;
  margin-left: 1rem;
  gap: 2rem;
  border-top: 1px solid #d9d9d9;
  padding-top: 1rem;
`;
const Heart = styled.div`
  display: flex;
  gap: 0.4rem;
`;
const Count = styled.p`
  font-size: 1.15rem;
  font-weight: 500;
`;
const PostComment = styled.div`
  display: flex;
  gap: 0.4rem;
`;
const MoreButton = styled.button`
  margin-top: -3rem;
  margin-bottom: 5rem;
  width: 30%;
  height: 3rem;
  border: none;
  background-color: #ffffff;
  transition-duration: 0.3s;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;
const ButtonImg = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  object-fit: cover;
`;
