import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import { Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useParams } from "react-router-dom";
import { styled } from "styled-components";

function Layout() {
  const authStore = useAuthStore();
  const { id } = useParams();
  const isLoggedIn = authStore.user !== null;
  const displayName = authStore.user?.displayName;
  const navigate = useNavigate();

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
    <LayoutContainer>
      <Header>
        <LogoContent>
          <LogoImg
            src={
              "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EB%A1%9C%EA%B3%A07.png?alt=media&token=b0943697-3adc-40ab-9bec-fe12259408e1"
            }
            onClick={() => {
              navigate("/");
            }}
          />
        </LogoContent>
        {isLoggedIn ? (
          <>
            <NavigationBar>
              Hello, {displayName}님<Button onClick={() => navigate("/mypage")}>Mypage</Button>
              <Button
                onClick={() => {
                  navigate("/community");
                }}
              >
                Community
              </Button>
              <Button onClick={handleLogout}>Logout</Button>
            </NavigationBar>
          </>
        ) : (
          <div>
            <Button
              onClick={() => {
                navigate("/signin");
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                navigate("/signup");
              }}
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
        <FooterContent>김봉식 푸터</FooterContent>
        <Button
          onClick={() => {
            navigate("/admin");
          }}
        >
          어드민
        </Button>
      </Footer>
    </LayoutContainer>
  );
}

export default Layout;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f2f2f5;
`;

const Button = styled.button`
  border: none;
  height: 60px;
  width: 120px;
  font-size: 20px;
  :hover {
    cursor: pointer;
  }
`;
const NavigationBar = styled.div``;

const Header = styled.div`
  background: #eeeeee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0 20px;
`;

const LogoContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const LogoImg = styled.img`
  width: 220px;
  height: 40px;
  scale: 1.3;
  margin-left: 4rem;
  cursor: pointer;
`;

const Footer = styled.div`
  bottom: 0;
  background: #eeeeee;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FooterContent = styled.div`
  /* max-width: 1200px; */
  margin: 0 auto;
`;
const MainContent = styled.div`
  flex: 1;
`;
