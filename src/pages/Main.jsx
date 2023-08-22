import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import useAuthStore from "../store/auth";

function Main() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <div>
      <Map />

      {/* {user !== null ? (
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
      )} */}
    </div>
  );
}

export default Main;
