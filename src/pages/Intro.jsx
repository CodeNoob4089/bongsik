// import { faFaceSadTear, faRoadBarrier } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGratipay } from "@fortawesome/free-brands-svg-icons";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Badge from "../components/Badge";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useQuery } from "react-query";

function Intro() {
  const navigate = useNavigate();
  const getPublicPosts = async () => {
    const postsCollectionRef = collection(db, "posts");

    const querySnapshot = await getDocs(query(postsCollectionRef, where("isPublic", "==", true)));

    const PublicPosts = querySnapshot.docs.map((postDoc) => {
      const data = postDoc.data();

      return {
        ...data,
        postId: postDoc.id,
      };
    });
    return PublicPosts;
  };
  const { data: PublicPosts } = useQuery("fetchPublicPosts", getPublicPosts);
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage:
            "linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url('https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%86%8C%EA%B0%9C%EC%82%AC%EC%A7%84.png?alt=media&token=d8c10c8d-798c-4f21-909a-d708a1b518ef')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // filter: "brightness(90%)",
          //필터에 브라이트니스를 주니까 사진이 어두워 졌는데 글씨까지 어두워짐. + 시작하기 버튼까지 어두워짐 해결해야함.
        }}
      >
        <div />
        <div>
          <h1
            style={{
              marginBottom: "4rem",
              fontSize: "50px",
              fontWeight: "bold",
              marginTop: "30rem",
              textAlign: "center",
              color: "black",
              // position: "relative; z-index: 1;",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>내가 남긴 솔직 리뷰를 </div>
            <div>모아놓은 맛 기록 다이어리</div>
          </h1>
          <h2 style={{ marginTop: "10px", fontSize: "1rem", color: "black", textAlign: "center", marginBottom: "1px" }}>
            ETG는 'Eat the ground'의 약자로, 나만의 음식점을 기록하면 지도에 색이 칠해지는 재미를 더한 서비스입니다.
            <br />맛 기록을 컬렉션으로 저장하고, 다른 사람의 맛 기록도 구경해보세요
          </h2>
          <Button onClick={() => navigate("/main")}>시작하기</Button>
        </div>
      </div>

      <div
        style={{
          display: "inline-block",
          marginTop: "10rem",
          marginLeft: "13rem",
          // backgroundColor: "gray",
        }}
      >
        {/* 지도와 컬렉션 이미지*/}
        <img
          src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%A7%80%EB%8F%84%20%EC%BB%AC%EB%A0%89%EC%85%98%20%EC%82%AC%EC%A7%84.png?alt=media&token=4586ab73-b0ed-457e-92ef-f82587d63a8c"
          style={{
            width: "31.875rem",
            height: "25rem",
          }}
        />
        <h1
          style={{
            fontWeight: "700",
            fontSize: "1.75rem",
            color: "#2d2d30",
            display: "inline-block",
            verticalAlign: "top",
            marginLeft: "2.5rem",
            padding: "10px 0px",
            marginTop: "6.5rem",
            // backgroundColor: "gray",
          }}
        >
          지도와 컬렉션 <br />
          <h2
            style={{
              marginTop: "3.5rem",
              fontSize: "1.5rem",
            }}
          >
            <p style={{ marginBottom: "0.3rem" }}>맛집을 기록하면 지도에 색이 칠해집니다.</p>

            <p style={{ marginBottom: "0.3rem" }}>
              같은 동에서 n개 이상 색을 칠하면 동 전체를 나의 맛집 영역으로 만들 수 있습니다.
            </p>

            <p style={{ marginBottom: "0.3rem" }}>땅따먹기 게임 같은 재미를 느끼며 지도에 나만의 영역을 넓혀보세요!</p>

            <p style={{ marginBottom: "0.3rem" }}>
              기록들은 컬렉션을 만들어 나만의 맛 기록 모음집처럼 보관할 수 있습니다.
            </p>
          </h2>
        </h1>
      </div>
      {/* 뱃지/레벨 시스템 이미지 */}
      <div style={{ marginTop: "15rem" }}>
        <img
          className="badgeLevel"
          src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EB%B1%83%EC%A7%80%20%EC%82%AC%EC%A7%84.png?alt=media&token=3e6fc79a-be0c-4885-9789-4e264278f229"
          style={{ float: "right", marginRight: "13.125rem" }}
        />
        <div>
          <h1
            style={{
              textAlign: "right",
              fontSize: "1.75rem",
              fontWeight: "500",
              marginRight: "2.5rem",
            }}
          >
            뱃지/레벨 시스템
          </h1>
          <h2 style={{ textAlign: "right", marginRight: "2.5rem" }}>활동에 따라 뱃지를 획득하고 레벨을 올려보세요</h2>
        </div>
      </div>
      <div style={{ marginTop: "20rem" }}>
        <img
          className=""
          src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%BB%A4%EB%AE%A4%EB%8B%88%ED%8B%B0%20%EC%82%AC%EC%A7%84.png?alt=media&token=1f14467a-abce-4115-b55f-d35d2b44cb54"
          style={{ display: "flex", float: "left", margintop: "500px", marginLeft: "13.125rem" }}
        />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1
          style={{
            fontSize: "1.75rem",
            // marginLeft: "1.5rem",
          }}
        >
          커뮤니티 기능
          <br />
          <br />
          <h2
            style={{
              fontSize: "1.5rem",
              // marginLeft: "1.5rem",
            }}
          >
            내 기록을 다른 사람에게 공개하거나, <br />
            커뮤니티에서 다른 사람의 글에 좋아요와 댓글을 남겨보세요!
          </h2>
        </h1>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
      <div
        style={{
          widtth: "100px",
          height: "700px",
          backgroundColor: "#ff4e50",
          textAlign: "center",
          fontSize: "50px",
        }}
      >
        <div style={{ marginTop: "5rem" }}>이용방법</div>
        <img
          style={{ marginTop: "5rem" }}
          src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%9D%B4%EC%9A%A9%EB%B0%A9%EB%B2%95.png?alt=media&token=2cb6dd88-8af0-497b-b4cb-e007e1b30e6d"
        />
      </div>
    </>
  );
}

export default Intro;

const Button = styled.button`
  font-size: 1rem;
  font-weight: bold;
  margin: 18rem;
  margin-top: 140px;
  width: 10rem;
  height: 3rem;
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
