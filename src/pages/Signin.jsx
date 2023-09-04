import React, { useState } from "react";
import { signOut } from "firebase/auth";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { emailVerified } = userCredential.user;

      if (emailVerified) {
        navigate("/");
      } else {
        alert("이메일 인증을 확인해주세요.");
        signOut(auth);
      }
    } catch (error) {
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  return (
    <>
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
      </Header>
      <SignInContainer>
        <SignInBox>
          <InputContainer>
            <SigninTitle>Sign in</SigninTitle>
            <StyledForm onSubmit={handleSubmit}>
              <StyledInputDiv>
                <StyledLabel>이메일</StyledLabel>
                <StyledInput
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </StyledInputDiv>
              <StyledInputDiv>
                <StyledLabel>비밀번호</StyledLabel>
                <StyledInput
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </StyledInputDiv>
              <SignInButton type="submit">Sign In</SignInButton>
              <GoogleSignUpButton type="button">Sign up with Google</GoogleSignUpButton>
            </StyledForm>
          </InputContainer>
          <ImageContainer>
            <ImageLogo src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EB%A1%9C%EA%B3%A08.png?alt=media&token=de9e2b70-f61b-41a1-802f-1c910339a984" />
          </ImageContainer>
        </SignInBox>
      </SignInContainer>
      <Footer>
        <FooterContent>김봉식 푸터</FooterContent>
      </Footer>
    </>
  );
}

export default SignIn;

const Header = styled.div`
  background: #eeeeee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0 20px;
`;
export const SignInContainer = styled.div`
  display: flex;
  background-color: #d9d9d9;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 20px);
`;

export const SignInBox = styled.div`
  display: flex;
  width: 1000px;
  max-width: calc(1000px -60px);
  height: 700px;
`;

export const InputContainer = styled.div`
  background-color: #ffffff;
  flex-basis: 50%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const SigninTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  font-size: 42px;
  font-weight: bold;
  position: relative;
  left: 80px;
  top: 90px;
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 50%;
  background-color: #f0f0f0;
`;
export const ImageLogo = styled.img`
  scale: 1.3;
  width: auto;
  height: auto;
`;

export const StyledForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledInputDiv = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
`;

export const StyledLabel = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
`;

export const StyledInput = styled.input`
  border-radius: 5px;
  width: 20rem;
  border: 1px solid gray;
  height: 40px;
  margin-bottom: 10px;
`;
export const SignInButton = styled.button`
  background-color: #ff4e50;
  color: white;
  border: none;
  width: 20rem;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: 20px;
  transition-duration: 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #ff2e30;
  }
`;
export const GoogleSignUpButton = styled.button`
  background-color: #ffffff;
  color: black;
  width: 20rem;
  border-top: 1px solid #000000;
  border-radius: 5px;
  padding: 10px;
  margin-top: 20px;
  transition-duration: 0.3s;
  cursor: pointer;
  &:hover {
    color: #4285f4;
  }
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
