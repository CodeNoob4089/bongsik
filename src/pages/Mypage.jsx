import React, { useState, useEffect } from "react";
import { getBadgeData } from "../store/BadgeData";
import { getUserBadges } from "../store/UserService";
import useAuthStore from "../store/auth";
import useBadgeStore from "../shared/BadgeStore";
import styled from "styled-components";
import Badge from "../components/Badge";
import Mypost from "./Mypost";
import MyList from "../components/MyList";

function Mypage() {
  const [currentTab, setCurrentTab] = useState(1);
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
      tabTitle: "기록",
      title: "title",
      component: (
        <>
          <MyList />
          <Mypost />
        </>
      ),
      content: "Mypost",
    },
    {
      id: 2,
      tabTitle: "활동",
      title: "title",
      component: <Badge badges={badges} ownedBadges={ownedBadges} />,
      content: "badge",
    },
    // {
    //   id: 1,
    //   tabTitle: "찜 목록",
    //   title: "title",
    //   component: <MyLikePost />,
    //   content: "scrap",
    // },
    // {
    //   id: 4,
    //   tabTitle: "맛 도장 깨기",
    //   component: <MyLikePost />,
    //   title: "title",
    //   content: "post",
    // },
  ];

  const TabClickHandler = (e) => {
    setCurrentTab(Number(e.target.id));
  };

  return (
    <Container>
      {user ? (
        <>
          {/* <UserInfo>
              <ProfileCircle>
                <ProfileImage src={user.photoURL} alt="프로필 사진" />
              </ProfileCircle>
              <Nickname>{user.displayName}님의 마이페이지</Nickname>
            </UserInfo> */}
          <TabsBox>
            {tabs.map((tab) => (
              <TabButton key={tab.id} id={tab.id} disabled={currentTab === `${tab.id}`} onClick={TabClickHandler} currentTab={currentTab}>
                {tab.tabTitle}
              </TabButton>
            ))}
          </TabsBox>
          <TabContent>
            {currentTab === 1 ? (
              <PostContents>
                <MyListBox>
                  <MyList/>
                </MyListBox>
                <MypostBox>
                <Mypost/>
                </MypostBox>
              </PostContents>
            ) : (
              <></>
            )}
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
const Container = styled.div`
  min-height: 100vh;
`;

const UserInfo = styled.div`
  display: flex;
  margin-top: 50px;
  margin-left: 40px;
`;

//000님의 마이페이지
// const Nickname = styled.p`
//   margin-left: 15px;
//   margin-top: 5px;
// `;

// const ProfileCircle = styled.div`
//   width: 60px;
//   height: 60px;
//   border-radius: 50%;
//   overflow: hidden;
//   display: inline-block;
// `;

// const ProfileImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   object-position: center;
// `;

const TabsBox = styled.div`
  height: 100px;
  width: 190px;
  margin-left: 50px;
  margin-top: 15px;
`;

const TabButton = styled.button`
  font-weight: bold;
  font-size: 17px;
  color: ${(props) => (props.id === props.currentTab ? "#FF4E50" : "gray")};
  width: 95px;
  height: 45px;
  margin-top: 30px;
  border: none;
  border-bottom: ${(props) => (props.id === props.currentTab ? "3px solid #FF4E50" : "2px solid gray")};
  background-color: rgba(255, 255, 255, 0);
  cursor: pointer;
`;

const TabContent = styled.div`
  width: 100%;
  height: 80vh;
`;

const PostContents = styled.div`
  display: flex;
  flex-direction: row;
`

const MyListBox = styled.div`
  width: 30vw;
  height: 80vh;
`;

const MypostBox = styled.div`
  width: 70vw;
  height: 80vh;
`