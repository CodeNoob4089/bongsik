import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import { Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useParams } from "react-router-dom";
import { styled } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function Layout() {
  const authStore = useAuthStore();
  const { id } = useParams();
  const isLoggedIn = authStore.user !== null;
  const displayName = authStore.user?.displayName;
  const [currentPage, setCurrentPage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const MypageCss = location.pathname === "/mypage";
  console.log(MypageCss);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      alert("정상적으로 로그아웃 되었습니다.");
    } catch (error) {
      alert("로그아웃 도중 에러가 발생했습니다.", error);
    }
  };

  return (
    <LayoutContainer style={{ MinHeight: MypageCss ? "100%" : "auto" }}>
      <Header>
          <LogoImg
            src={
              "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/ETG%20%E1%84%83%E1%85%A2%E1%84%86%E1%85%AE%E1%86%AB%E1%84%8C%E1%85%A1%E1%84%89%E1%85%AE%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9.png?alt=media&token=ee0210fe-744c-40ef-a806-be5ba8fc08fc"
            }
            onClick={() => {
              setCurrentPage("");
              navigate("/main");
            }}
          />
        {isLoggedIn ? (
          <>
            <NavigationBar>
              Hello, {displayName}님
            <Button
             id="intro"
             onClick={() => {
               setCurrentPage("intro")
               navigate("/");
             }}
             currentPage={currentPage}
            >About</Button>
              <Button
                id="community"
                onClick={() => {
                  setCurrentPage("community");
                  navigate("/community");
                }}
                currentPage={currentPage}
              >
                Community
              </Button>
              <Button
                id="mypage"
                onClick={() => {
                  setCurrentPage("mypage");
                  navigate("/mypage");
                }}
                currentPage={currentPage}
              >
                My page
              </Button>
              <Button id="log-out" onClick={handleLogout}>
                Log out
              </Button>
            </NavigationBar>
          </>
        ) : (
          <div>
             <Button
             id="intro"
             onClick={() => {
               setCurrentPage("intro")
               navigate("/");
             }}
             currentPage={currentPage}
            >About</Button>
            <Button
              id="signin"
              onClick={() => {
                setCurrentPage("signin");
                navigate("/signin");
              }}
              currentPage={currentPage}
            >
              Login
            </Button>
            <Button
              id="signup"
              onClick={() => {
                setCurrentPage("signup");
                navigate("/signup");
              }}
              currentPage={currentPage}
            >
              Signup
            </Button>
          </div>
        )}
      </Header>
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer>
        <FooterContent>© 2023 KIMBONGSIK</FooterContent>
        <FooterButton onClick={() => window.open("https://github.com/Kim-bongsik/bongsik", "_blank")}>
          <FontAwesomeIcon icon={faGithub} />
        </FooterButton>
      </Footer>
    </LayoutContainer>
  );
}

export default Layout;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff8f8;
  /* height: 100vh; */
`;

const Button = styled.button`
  border: none;
  height: 60px;
  width: 5rem;
  color: ${(props) => props.id === props.currentPage? "#FF4E50": "black"};
  background: none;
  cursor: pointer;
`;
const NavigationBar = styled.div``;

const Header = styled.div`
  font-size: 0.8rem;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 3.5rem;
  padding: 0 6rem;
`;

// const LogoContent = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 20px;
// `;

const LogoImg = styled.img`
  height: 1.7rem;
  cursor: pointer;
`;

const Footer = styled.div`
  bottom: 0;
  background: #e8dddd;
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FooterContent = styled.div`
  /* max-width: 1200px; */
  margin: 0 auto;
`;

const FooterButton = styled.button`
  border: none;
  font-size: 30px;
  color: #452828;
  margin-right: 3vw;
  background-color: rgba(0, 0, 0, 0);
  cursor: pointer;
`;

const MainContent = styled.div`
  // flex: 1;
  // min-height: 100vh;
`;
