import KakaoMap from "../components/KakaoMap";
import useAuthStore from "../store/auth";
import MyList from "../components/MyList";
import { styled } from "styled-components";
import PostAddModal from "../components/PostAddModal";
import { useState } from "react";

function Main() {
  const [modalOpen, setModalOpen] = useState(false);

  const showModal = () => {
    setModalOpen(true);
  };
  
  return (
    <>
    {modalOpen && <PostAddModal modalOpen={modalOpen} setModalOpen={setModalOpen}/>}
    <Container>
      <MapContainer>
      <KakaoMap showModal={showModal} />
      </MapContainer>
      <MyList />
    </Container>
    </>
  );
}

export default Main;

const Container = styled.div`
  display: flex;
`;
const MapContainer = styled.div`
  width: 67vw;
`