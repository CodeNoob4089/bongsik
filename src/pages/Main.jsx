import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import { auth } from "../firebase";
import useAuthStore from "../store/auth";
import { signOut } from "firebase/auth";
import MyList from "../components/MyList"

function Main() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("정상적으로 로그아웃 되었습니다.");
    } catch (error) {
      alert("로그아웃 도중 에러가 발생했습니다.", error);
    }
  };
  return (
    <div>
      <Map />
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
    </div>
  );
}

export default Main;
