import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import useAuthStore from "../store/auth";
import { signOut } from "firebase/auth";
import MyList from "../components/MyList";
import { styled } from "styled-components";

function Main() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <Container>
      <Map />
      <MyList />
    </Container>
  );
}

export default Main;

const Container = styled.div`
  display: flex;
`;
