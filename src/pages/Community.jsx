import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useState } from "react";
import RestaurantPost from "../components/RestaurantPost";
import CafePost from "../components/CafePost";
import BarPost from "../components/BarPost";
function Community() {
  const [currentTab, setCurrentTab] = useState(1);

  const tabs = [
    {
      id: 1,
      tabTitle: "맛집",
      title: "title",
      content: <RestaurantPost />,
    },
    {
      id: 2,
      tabTitle: "술집",
      title: "title",
      content: <BarPost />,
    },
    {
      id: 3,
      tabTitle: "카페",
      title: "title",
      content: <CafePost />,
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
            <SearchMapInput placeholder="검색어를 입력해주세요" />
            <SearchButton>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </SearchButton>
          </SearchForm>
        </SearchArea>
        <MonthlyPost>
          <MonthlyTitle>이 달의 글</MonthlyTitle>
          <MonthlyContent></MonthlyContent>
        </MonthlyPost>
        <MonthlyPost>
          <MonthlyTitle>추가될 것 </MonthlyTitle>
          <MonthlyContent></MonthlyContent>
        </MonthlyPost>
      </CommunityRight>
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
  margin-left: 5rem;
  margin-top: 2rem;
  width: 63vw;
  height: auto;
  position: relative;
`;
const CategoryBar = styled.div`
  background-color: #11a388;
  height: 8vh;
  width: 21vw;
  display: flex;
`;
const Button = styled.button`
  width: 7vw;
  border: none;
  font-size: 1rem;
`;

const SearchArea = styled.div`
  /* position: absolute; */
  margin-left: 3.7rem;
  padding-bottom: 30px;
  top: 6rem;
  right: 1rem;
  width: 18rem;
`;

const SearchForm = styled.form`
  width: 16.5rem;
  height: 2.5rem;
`;

const SearchMapInput = styled.input`
  position: absolute;
  font-size: 17px;
  z-index: 2;
  padding-left: 1rem;
  width: 16.5rem;
  height: 2.2rem;
  border: 1.2px solid #696969;
  border-radius: 30px;
`;

const SearchButton = styled.button`
  position: absolute;
  z-index: 3;
  color: #696969;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 18px;
  margin: 0.4rem 0 0 14rem;
`;
const CommunityRight = styled.div`
  /* background-color: #63914b; */
  flex-direction: column;
  height: auto;
  width: 25vw;
  margin: 5vh auto;
`;
const MonthlyPost = styled.div`
  flex-direction: row;
  background-color: #c8c8c8;
  width: 17.2vw;
  height: 45vh;
  border-radius: 0.3rem;
  margin-left: 3.7rem;
  margin-bottom: 3rem;
  position: relative;
`;
const MonthlyContent = styled.div`
  display: flex;
  background-color: #bf85a1;
  width: 17.2vw;
  height: 42vh;
  border-radius: 0.3rem;
`;
const MonthlyTitle = styled.p`
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;
