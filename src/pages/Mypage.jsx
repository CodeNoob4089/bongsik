import React, { useState } from "react";
import styled from "styled-components";
function Mypage() {
  const [currentTab, setCurrentTab] = useState();
  const tabs = [
    {
      id: 1,
      tabTitle: "스크랩 보기",
      title: "title",
      content: "scrap",
    },
    {
      id: 2,
      tabTitle: "뱃지 보러가기",
      title: "title",
      content: "badge",
    },
    {
      id: 3,
      tabTitle: "나의 맛 기록",
      title: "title",
      content: "Mypost",
    },
    {
      id: 4,
      tabTitle: "맛 도장 깨기",
      title: "title",
      content: "post",
    },
  ];

  const TabClickHandler = (e) => {
    setCurrentTab(e.target.id);
  };

  return (
    <Container>
      <TabsArea>
        <UserInfo>
          <ProfileCircle>
            <ProfileImage src="사진_이미지_경로" alt="프로필 사진" />
          </ProfileCircle>
          <Nickname>nickname님의 마이페이지</Nickname>
        </UserInfo>
        <TabsBox>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              disabled={currentTab === `${tab.id}`}
              onClick={TabClickHandler}
            >
              {tab.tabTitle}
            </TabButton>
          ))}
        </TabsBox>
      </TabsArea>
      <TabContent>
        {tabs.map((tab) => (
          <React.Fragment key={tab.id}>
            {currentTab === `${tab.id}` && (
              <div>
                <TabTitle>{tab.title}</TabTitle>
                <p>{tab.content}</p>
              </div>
            )}
          </React.Fragment>
        ))}
      </TabContent>
    </Container>
  );
}

export default Mypage;
const Container = styled.div``;

const TabsArea = styled.div`
  width: 400px;
  height: 700px;
  float: left;
`;
const UserInfo = styled.div`
  display: flex;
  margin-top: 50px;
  margin-left: 40px;
`;
const Nickname = styled.p`
  margin-left: 15px;
  margin-top: 5px;
`;
const ProfileCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
`;
const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const TabsBox = styled.div`
  background-color: #d9d9d9;
  height: 120px;
  width: 350px;
  margin-left: 23px;
  margin-top: 15px;
`;

const TabButton = styled.button`
  width: 60px;
  height: 60px;
  margin-top: 30px;
  margin-left: 20px;
  border-radius: 50px;
  border: none;
`;

const TabContent = styled.div`
  width: 100%;
  height: 700px;
`;
const TabTitle = styled.p``;

// 푸쉬 신윤식 멍청이
