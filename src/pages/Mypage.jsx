import React, { useState, useEffect } from "react";
import { getBadgeData } from "../store/BadgeData";
import { getUserBadges } from "../store/UserService";
import useAuthStore from "../store/auth";
import useBadgeStore from "../shared/BadgeStore";
import styled from "styled-components";
import Main from "./Main";
import Badge from "../components/Badge";
import Mypost from "./Mypost";
function Mypage() {
  const [currentTab, setCurrentTab] = useState();
  const user = useAuthStore((state) => state.user);
  const badges = useBadgeStore((state) => state.badges);
  const ownedBadges = useBadgeStore((state) => state.ownedBadges);
  const setBadges = useBadgeStore((state) => state.setBadges);
  const setOwnedBadges = useBadgeStore((state) => state.setOwnedBadges);

  useEffect(() => {
    const fetchBadges = async () => {
      const fetchedBadges = await getBadgeData();
      setBadges(fetchedBadges);
    };

    const fetchUserBadges = async () => {
      if (!user) return;
      console.log(user.uid);
      const fetchedUserBadges = await getUserBadges(user.uid);
      console.log(fetchedUserBadges);
      const ownedBadgesArray = Object.keys(fetchedUserBadges).filter((badgeId) => fetchedUserBadges[badgeId].isOwned);
      setOwnedBadges(ownedBadgesArray);
    };

    fetchBadges();
    if (user) {
      fetchUserBadges();
    }
  }, [user, setBadges, setOwnedBadges]);

  const tabs = [
    {
      id: 1,
      tabTitle: "스크랩 보기",
      title: "title",
      component: <Main />,
      content: "scrap",
    },
    {
      id: 2,
      tabTitle: "뱃지 보러가기",
      title: "title",
      component: <Badge badges={badges} ownedBadges={ownedBadges} />,
      content: "badge",
    },
    {
      id: 3,
      tabTitle: "나의 맛 기록",
      title: "title",
      component: <Mypost />,
      content: "Mypost",
    },
    {
      id: 4,
      tabTitle: "맛 도장 깨기",
      title: "title",
      content: "post",
    },
  ];
  console.log(ownedBadges);

  const TabClickHandler = (e) => {
    setCurrentTab(e.target.id);
  };

  return (
    <Container>
      {user ? (
        <>
          <TabsArea>
            <UserInfo>
              <ProfileCircle>
                <ProfileImage src={user.photoURL} alt="프로필 사진" />
              </ProfileCircle>
              <Nickname>{user.displayName}님의 마이페이지</Nickname>
            </UserInfo>
            <TabsBox>
              {tabs.map((tab) => (
                <TabButton key={tab.id} id={tab.id} disabled={currentTab === `${tab.id}`} onClick={TabClickHandler}>
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
                    <div>{tab.component}</div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </TabContent>
        </>
      ) : (
        <>Loading...</>
      )}
    </Container>
  );
}
export default Mypage;

//스타일컴포넌트
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
