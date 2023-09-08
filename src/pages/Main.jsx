import KakaoMap from "../components/KakaoMap";
import MyList from "../components/MyList";
import { styled } from "styled-components";
import PostAddModal from "../components/PostAddModal";
import { useState } from "react";
import BestList from "../components/BestList";
import WorstList from "../components/WorstList";
import { useQuery } from "react-query";
import { getPosts } from "../api/collection";

function Main() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: postData } = useQuery(`fetchPostData`, getPosts);
  const showModal = () => {
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  return (
    <>
      {modalOpen && <PostAddModal modalOpen={modalOpen} setModalOpen={setModalOpen} />}
      <Container>
        <MapContainer>
          <KakaoMap showModal={showModal} postData={postData} />
        </MapContainer>
        <MyList />
        <ListContainer>
          <BestList />
          <WorstList />
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
  display: flex;
  justify-content: space-between;
`;
