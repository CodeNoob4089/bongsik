import { useNavigate } from "react-router-dom";
import KakaoMap from "../components/KakaoMap";
import { auth } from "../firebase";
import useAuthStore from "../store/auth";
import { signOut } from "firebase/auth";
import MyList from "../components/MyList";
import { styled } from "styled-components";

function Main() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <Container>
      <KakaoMap />
      <MyList/>

      {user !== null ? (
        <>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              navigate("/signin");
            }}
          >
            로그인
          </button>
          <button
            onClick={() => {
              navigate("/signup");
            }}
          >
            회원가입
          </button>
        </>
      )}
    </Container>
  );
}

export default Main;

const Container = styled.div`
  display: flex;
`;
