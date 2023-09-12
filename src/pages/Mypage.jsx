import React, { useState, useEffect } from "react";
import { getBadgeData } from "../store/BadgeData";
import { getUserBadges } from "../store/UserService";
import useAuthStore from "../store/auth";
import useBadgeStore from "../shared/BadgeStore";
import styled from "styled-components";
import Badge from "../components/Badge";
import Mypost from "./Mypost";
import MyLikePost from "../components/MyLikePost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faHeart, faMedal } from "@fortawesome/free-solid-svg-icons";
import EditUserModal from "../components/EditUserModal";
import MyPageList from "../components/MyPageList";
import getLevelImageUrl from "../shared/LevelImage";

function Mypage() {
  const [currentTab, setCurrentTab] = useState(1);
  const user = useAuthStore((state) => state.user);
  const badges = useBadgeStore((state) => state.badges);
  const ownedBadges = useBadgeStore((state) => state.ownedBadges);
  const setBadges = useBadgeStore((state) => state.setBadges);
  const setOwnedBadges = useBadgeStore((state) => state.setOwnedBadges);
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const [isMedalHovered, setIsMedalHovered] = useState(false);
  const [iseditusermodal, setIsEditUserModal] = useState(false);

  const [currentUserTab, setCurrentUserTab] = useState("like-posts");

  useEffect(() => {
    const fetchBadges = async () => {
      const fetchedBadges = await getBadgeData();
      setBadges(fetchedBadges);
    };

    const fetchUserBadges = async () => {
      if (!user) return;
      const fetchedUserBadges = await getUserBadges(user.uid);
      const ownedBadgesArray = Object.keys(fetchedUserBadges).filter((badgeId) => fetchedUserBadges[badgeId].isOwned);

      setOwnedBadges(ownedBadgesArray);
    };

    fetchBadges();
    if (user) {
      fetchUserBadges();
    }
  }, [user, setBadges, setOwnedBadges]);

  const edituserhandler = () => {
    setIsEditUserModal(true);
  };

  const tabs = [
    {
      id: 1,
      tabTitle: "기록",
    },
    {
      id: 2,
      tabTitle: "활동",
      title: "title",
      component: <Badge badges={badges} ownedBadges={ownedBadges} />,
      content: "badge",
    },
  ];

  const TabClickHandler = (e) => {
    setCurrentTab(Number(e.target.id));
  };

  return (
    <Container>
      <EditUserModal
        isOpen={iseditusermodal}
        onCancle={() => {
          setIsEditUserModal(false);
        }}
      />
      {user ? (
        <>
          <TabsBox>
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                disabled={currentTab === `${tab.id}`}
                onClick={TabClickHandler}
                currentTab={currentTab}
              >
                {tab.tabTitle}
              </TabButton>
            ))}
          </TabsBox>
          <TabContent>
            {currentTab === 1 ? (
              <PostContents>
                <MyListBox>
                  <MyPageList />
                </MyListBox>
                <RightContents>
                  <Mypost />
                </RightContents>
              </PostContents>
            ) : (
              <UserPostContents>
                <UserInfo>
                  <UserProfile>
                    <ProfileCircle>
                      <ProfileImage
                        src={
                          user?.photoUrl
                            ? user.photoUrl
                            : "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/59932b0eb046f9fa3e063b8875032edd_crop.jpeg?alt=media&token=615f79d4-7eef-46e9-ba45-d7127b0597ea"
                        }
                        alt="프로필 사진"
                      />
                    </ProfileCircle>
                    <UserNameAndLevel>
                      <Nickname>{user.displayName} </Nickname>
                      <Level>
                        Lv.{user.level}
                        <LevelImg src={getLevelImageUrl(user.level)} />
                      </Level>
                    </UserNameAndLevel>
                    <SettingButton>
                      <FontAwesomeIcon icon={faGear} onClick={edituserhandler} />
                    </SettingButton>
                  </UserProfile>
                  <UserTabsBox>
                    <UserTabButton
                      onClick={() => setCurrentUserTab("like-posts")}
                      onMouseEnter={() => setIsHeartHovered(true)}
                      onMouseLeave={() => setIsHeartHovered(false)}
                    >
                      <FontAwesomeIcon icon={faHeart} style={{ color: isHeartHovered ? "#ff4e50" : "gray" }} />
                      <br />
                      {user?.userLikes?.length}
                    </UserTabButton>
                    <Line />
                    <UserTabButton
                      onClick={() => setCurrentUserTab("my-badges")}
                      onMouseEnter={() => setIsMedalHovered(true)}
                      onMouseLeave={() => setIsMedalHovered(false)}
                    >
                      <FontAwesomeIcon icon={faMedal} style={{ color: isMedalHovered ? "#ff4e50" : "gray" }} />
                      <br />
                      챌린지
                    </UserTabButton>
                  </UserTabsBox>
                </UserInfo>
                <UserRightContents>
                  {currentUserTab === "like-posts" ? (
                    <MyLikePost />
                  ) : (
                    <Badge badges={badges} ownedBadges={ownedBadges} />
                  )}
                </UserRightContents>
              </UserPostContents>
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
  padding: 3vh 9vw;
  width: 100%;
  min-height: 100vh;
`;

const UserInfo = styled.div`
  background-color: white;
  border-radius: 10px;
  width: 24vw;
  height: 28vh;
  margin: 5vh 9vw;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
`;
const UserPostContents = styled.div`
  display: flex;
  margin-left: -9.3vw;
  margin-top: -2.2vw;
`;
const UserRightContents = styled.div`
  margin-left: -8vw;
  width: 66.25vw;
  height: 80vh;
`;

const UserProfile = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const UserNameAndLevel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 63%;
`;

const Nickname = styled.p`
  font-size: 24px;
  margin-left: 0.5rem;
  margin-top: 5px;
`;

const ProfileCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  /* display: inline-block; */
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;
const SettingButton = styled.button`
  width: 40px;
  position: relative;
  color: gray;
  border: none;
  font-size: 25px;
  background-color: rgba(0, 0, 0, 0);
  padding-bottom: 25px;
  cursor: pointer;
`;

const UserTabsBox = styled.div`
  background-color: #f2f2f5;
  margin-top: 2.5rem;
  border-radius: 1rem;
  height: 5rem;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const UserTabButton = styled.button`
  font-size: 15px;
  height: 100%;
  width: 50%;
  line-height: 1.4rem;
  border: none;
  color: gray;
  cursor: pointer;
  &:hover {
    color: #ff4e50;
    svg {
      color: #ff4e50;
    }
  }
`;
const Line = styled.div`
  height: 3rem;
  width: 1.4px;
  background-color: #d0d0de;
`;
const TabsBox = styled.div`
  height: 6rem;
  width: 13rem;
  margin-top: 1.7rem;
`;

const TabButton = styled.button`
  font-weight: bold;
  font-size: 17px;
  color: ${(props) => (props.id === props.currentTab ? "#FF4E50" : "gray")};
  width: 5.8rem;
  height: 2.6rem;
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
  margin-left: -0.5rem;
  margin-top: -2.6rem;
  display: flex;
  flex-direction: row;
`;

const MyListBox = styled.div`
  margin: 0 auto;
`;

const RightContents = styled.div`
  margin-left: -2.5vw;
  width: 66.25vw;
  height: 80vh;
`;
const LevelImg = styled.img`
  width: 25px;
  height: 25px;
  overflow: hidden;
`;

const Level = styled.div`
  font-size: 20px;
  display: flex;
  justify-content: left;
  margin-left: 0.5rem;
  margin-top: 1rem;
`;
