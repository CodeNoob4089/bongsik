import KakaoMap from "../components/KakaoMap";
import MyList from "../components/MyList";
import { styled } from "styled-components";
import PostAddModal from "../components/PostAddModal";
import { useState } from "react";
import BestList from "../components/BestList";
import WorstList from "../components/WorstList";
import { useQuery } from "react-query";
import { getMyTags, getPosts } from "../api/collection";
import useAuthStore from "../store/auth";
import { auth } from "../firebase";
import { Description, DescriptionBox, DescriptionTitle } from "../shared/MainDescription";

function Main() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: postData } = useQuery(`fetchPostData`, getPosts, {
    enabled: auth.currentUser !== null
  });
  const { data: myTags } = useQuery("getMyTags", getMyTags, {
    enabled: auth.currentUser !== null
  });
  
  const user = useAuthStore((state) => state.user);

  const showModal = () => {
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  return (
    <>
      {modalOpen && <PostAddModal modalOpen={modalOpen} setModalOpen={setModalOpen} myTags={myTags} user={user} />}
      <Container>
        <MapContainer>
          <KakaoMap showModal={showModal} postData={postData} user={user}/>
        </MapContainer>
        <MyList postData={postData} myTags={myTags} user={user} />
        <ListContainer>
        <DescriptionBox>
            <DescriptionTitle>되돌아보세요</DescriptionTitle>
            <Description>상반된 후기를 작성했던 가게들은 다시 한 번 확인해보세요.</Description>
          </DescriptionBox>
          <ListBox>
          <BestList postData={postData}/>
          <WorstList postData={postData}/>
          </ListBox>
        </ListContainer>
      </Container>
    </>
  );
}

export default Main;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3vh 9vw;
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 81vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 5vh;
`;

const ListBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0vh 6vw;
`