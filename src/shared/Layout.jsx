import React from "react";
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
    <>
      <Header>
        <LogoContent>
          <LogoImg
            onClick={() => {
              navigate("/");
            }}
          ></LogoImg>
        </LogoContent>
        {isLoggedIn ? (
          <>
            <NavigationBar>
              Hello, {displayName}님
              <Button onClick={() => navigate("/mypage")}>Mypage</Button>
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

      <Outlet />
      <Footer></Footer>
    </>
  );
}

export default Layout;

const Button = styled.button`
  border: none;
  height: 60px;
  width: 120px;
  font-size: 20px;
`;
const NavigationBar = styled.div`
  float: right;
`;
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
`;
const LogoImg = styled.div`
  /* margin: 20px auto; */
  width: 60px;
  height: 60px;
  background-image: url(https://th.bing.com/th/id/R.e771e69269a626ef5992a25680a45757?rik=h%2bS0NU8p17%2fbZg&riu=http%3a%2f%2fstorage.enuri.info%2fpic_upload%2fknowbox2%2f202012%2f0107315902020121547c1dd11-700c-4145-96e7-fea4a8ebdd84.jpg&ehk=mV9W4RCJGw3YKTF5kXGHpqIib2%2fIL93yy%2fyYbcKHhu8%3d&risl=&pid=ImgRaw&r=0);
  background-size: cover;
`;
const Footer = styled.div`
  position: relative;
  bottom: 0;
  padding: 5px 0;
  background: #eeeeee;
  width: 100%;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
