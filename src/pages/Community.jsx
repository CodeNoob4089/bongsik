import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import RestaurantPost from "../components/RestaurantPost";
import MonthPost from "../components/MonthPost";
function Community({ RestaurantPublicPosts }) {
  const [currentTab, setCurrentTab] = useState(1);
  const [isTopVisible, setIsTopVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 페이지 상단으로 부드럽게 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 스크롤 이벤트 리스너를 등록
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //"Top" 버튼
  const handleScroll = () => {
    setIsTopVisible(window.scrollY > 300);
  };

  const tabs = [
    {
      id: 1,
      tabTitle: "식당",
      title: "title",
      content: <RestaurantPost category={"맛집"} />,
    },
    {
      id: 2,
      tabTitle: "술집",
      title: "title",
      content: <RestaurantPost category={"술집"} />,
    },
    {
      id: 3,
      tabTitle: "카페",
      title: "title",
      content: <RestaurantPost category={"카페"} />,
    },
  ];

  const TabClickHandler = (tabId) => {
    setCurrentTab(tabId);
  };

  return (
    <Container>
      <CommunityLeft>
        <CategoryBar>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              id={tab.id}
              disabled={currentTab === tab.id}
              onClick={() => TabClickHandler(tab.id)}
              currentTab={currentTab}
            >
              {tab.tabTitle}
            </Button>
          ))}
        </CategoryBar>
        {tabs.map((tab) => (
          <React.Fragment key={tab.id}>
            {currentTab === tab.id && (
              <div>
                <p>{tab.content}</p>
              </div>
            )}
          </React.Fragment>
        ))}
      </CommunityLeft>
      <CommunityRight>
        <SearchArea>
          <SearchForm>
            <SearchInput
              text="text"
              placeholder="검색어를 입력해주세요"
              // value={search}
              // onChange={(e) => {
              //   setSearch(e.target.value); // 검색어 상태 업데이트
              // }}
            />
            <SearchButton type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </SearchButton>
          </SearchForm>
        </SearchArea>
        <MonthlyPost>
          <MonthlyTitle>이 달의 게시글</MonthlyTitle>
          <MonthlyContent>
            <MonthPost />
          </MonthlyContent>
        </MonthlyPost>
        {/* <MonthlyPost>
          <MonthlyTitle>추가될 것 </MonthlyTitle>
          <MonthlyContent></MonthlyContent>
        </MonthlyPost> */}
      </CommunityRight>
      {isTopVisible && <TopButton onClick={scrollToTop}></TopButton>}
    </Container>
  );
}

export default Community;
const Container = styled.div`
  /* background-color: red; */
  display: flex;
  min-height: 100vh;
`;
const CommunityLeft = styled.div`
  /* background-color: #6e2789; */
  margin-left: 6rem;
  margin-top: 2rem;
  width: 60vw;
  height: auto;
  position: relative;
`;
const CategoryBar = styled.div`
  width: 14vw;
  display: flex;
  margin-bottom: 0.8rem;
  margin-left: 4.3rem;
  height: 7vh;
  margin-top: 3rem;
`;
const Button = styled.button`
  font-weight: bold;
  font-size: 14.5px;
  color: ${(props) => (props.id === props.currentTab ? "#FF4E50" : "gray")};
  width: 7vw;
  height: 5vh;
  border: none;
  border-bottom: ${(props) => (props.id === props.currentTab ? "3px solid #FF4E50" : "2px solid gray")};
  background-color: rgba(255, 255, 255, 0);
  cursor: pointer;
`;

const SearchArea = styled.div`
  position: fixed;
  top: 6rem;
  width: 18rem;
  margin-top: 3rem;
`;

const SearchForm = styled.form`
  width: 16.5rem;
  height: 2.5rem;
`;

const SearchInput = styled.input`
  position: absolute;
  font-size: 17px;
  z-index: 2;
  padding-left: 3rem;
  width: 20vw;
  height: 2.2rem;
  border: none;
  border-radius: 30px;
  box-shadow: 3px 3px 3px #bbbbbb;
`;

const SearchButton = styled.button`
  position: relative;
  z-index: 3;
  color: #696969;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 18px;
  margin: 0.4rem 0 0 16.5rem;
`;
const CommunityRight = styled.div`
  /* background-color: #63914b; */
  flex-direction: column;
  height: auto;
  width: 28vw;
  margin: 5vh auto;
  margin-left: 2rem;
`;
const MonthlyPost = styled.div`
  position: fixed;
  flex-direction: row;
  background-color: white;
  box-shadow: 1px 1px 1px 1px #bbbbbb;
  width: 20vw;
  height: 70vh;
  border-radius: 0.7rem;
  margin-bottom: 3rem;
  margin-top: 6.8rem;
`;
const MonthlyContent = styled.div`
  display: flex;
  /* background-color: #bf85a1; */
  width: 17.2vw;
  height: 42vh;
  border-radius: 0.3rem;
`;
const MonthlyTitle = styled.p`
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  z-index: 1;
  padding: 1.8rem;
  font-weight: bold;
  color: #2d2d30;
`;
const TopButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 70px;
  height: 70px;
  background: url(https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EA%B7%B8%EB%A6%87%20%EB%A1%9C%EA%B3%A0.png?alt=media&token=8d59777d-4691-4c2c-80c4-6ae7a468d0a9)
    no-repeat center center;
  background-size: 3.5rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  z-index: 4;
`;
