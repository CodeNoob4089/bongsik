import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import RestaurantPost from "../components/RestaurantPost";

function Community() {
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
      tabTitle: "맛집",
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
            <SearchInput placeholder="검색어를 입력해주세요" />
            <SearchButton>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </SearchButton>
          </SearchForm>
        </SearchArea>
        <MonthlyPost>
          <MonthlyTitle>이 달의 글</MonthlyTitle>
          <MonthlyContent></MonthlyContent>
        </MonthlyPost>
        {/* <MonthlyPost>
          <MonthlyTitle>추가될 것 </MonthlyTitle>
          <MonthlyContent></MonthlyContent>
        </MonthlyPost> */}
      </CommunityRight>
      {isTopVisible && <TopButton onClick={scrollToTop}>TOP</TopButton>}
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
  width: 59.55497382198953vw;
  height: auto;
  position: relative;
`;
const CategoryBar = styled.div`
  width: 21vw;
  display: flex;
  margin-bottom: 2.5rem;
  margin-left: 3.5rem;
  height: 7vh;
`;
const Button = styled.button`
  font-weight: bold;
  font-size: 17px;
  color: ${(props) => (props.id === props.currentTab ? "#FF4E50" : "gray")};
  width: 95px;
  height: 45px;
  border: none;
  border-bottom: ${(props) => (props.id === props.currentTab ? "3px solid #FF4E50" : "2px solid gray")};
  background-color: rgba(255, 255, 255, 0);
  cursor: pointer;
`;

const SearchArea = styled.div`
  position: fixed;
  margin-left: 3rem;
  top: 6rem;
  width: 18rem;
  margin-top: 6rem;
`;

const SearchForm = styled.form`
  width: 16.5rem;
  height: 2.5rem;
`;

const SearchInput = styled.input`
  position: absolute;
  font-size: 17px;
  z-index: 2;
  padding-left: 1rem;
  width: 18.97vw;
  height: 2.2rem;
  border: 1.2px solid #696969;
  border-radius: 30px;
`;

const SearchButton = styled.button`
  position: relative;
  margin-right: 2rem;
  z-index: 3;
  color: #696969;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 18px;
  margin: 0.4rem 0 0 16rem;
`;
const CommunityRight = styled.div`
  /* background-color: #63914b; */
  flex-direction: column;
  height: auto;
  width: 25vw;
  margin: 5vh auto;
`;
const MonthlyPost = styled.div`
  position: fixed;
  flex-direction: row;
  background-color: #c8c8c8;
  width: 18.97vw;
  height: 55.9vh;
  border-radius: 0.3rem;
  margin-left: 3rem;
  margin-bottom: 3rem;
  margin-top: 11rem;
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
`;
const TopButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: url("/image/top-button.gif") no-repeat center center;
  background-size: cover;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  z-index: 4;
  color: #fff;
  font-size: large;
  font-weight: bold;
`;
