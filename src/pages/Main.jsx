import KakaoMap from "../components/KakaoMap";
import MyList from "../components/MyList";
import { styled } from "styled-components";
import PostAddModal from "../components/PostAddModal";
import { useState } from "react";
import { useQuery } from "react-query";
import { getPosts } from "../api/collection";
import { useQueryClient } from "react-query";
function Main() {
  const queryClient = useQueryClient();
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
      </Container>
    </>
  );
}

export default Main;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14vh 7.8vw;
  width: 100%;
  height: 100%;
`;
const MapContainer = styled.div`
  width: 100%;
  height: 61vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
