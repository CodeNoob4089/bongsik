import React, { useState } from "react";
import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { getBadgeData } from "../store/BadgeData";

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
        navigate("/main");
      } else {
        alert("이메일 인증을 확인해주세요.");
        await signOut(auth);
      }
    } catch (error) {
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      navigate("/main");

      const user = result.user;

      if (user) {
        const badges = await getBadgeData();

        const userBadgeData = badges.reduce((badgeObj, badge) => {
          badgeObj[badge.id] = {
            isOwned: false,
          };
          return badgeObj;
        }, {});

        const userRef = doc(db, "users", user.uid);
        if(userRef)return;
        await setDoc(
          userRef,
          {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            myTags: [],
            ownedBadges: userBadgeData,
            postCounts: 0,
            level: 1,
            exp: 0,
            dongCounts: [],
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error(error.message);
      alert("구글 로그인에 실패하였습니다.");
    }
  };

  return (
    <>
      <SignInContainer>
        <SignInBox>
          <InputContainer>
            <SigninTitle>Login</SigninTitle>
            <StyledForm onSubmit={handleSubmit}>
              <StyledInputDiv>
                <StyledLabel>이메일</StyledLabel>
                <StyledInput
                  placeholder="이메일을 입력해주세요."
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
                  placeholder="비밀번호"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </StyledInputDiv>
              <SignInButton type="submit">Sign In</SignInButton>
              <OrBox>
                <LineLeft />
                OR
                <LineRight />
              </OrBox>
              <GoogleSignUpButton type="button" onClick={handleGoogleLogin}>
                <GoogleLogo src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/Google__G__Logo%201.png?alt=media&token=75b51e58-8a63-44a8-86a6-fcdb851c166a" />
                <p>Sign in with Google</p>
              </GoogleSignUpButton>
            </StyledForm>
          </InputContainer>
          <ImageContainer>
            <ImageLogo src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/Frame%201321317750.png?alt=media&token=d9cd2da8-d246-47d6-b7e9-1f936956a485" />
          </ImageContainer>
        </SignInBox>
      </SignInContainer>
    </>
  );
}

export default SignIn;

export const SignInContainer = styled.div`
  display: flex;
  background-color: #ff4e50;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const SignInBox = styled.div`
  display: flex;
  width: 75vw;
  height: 85.3vh;
`;

export const InputContainer = styled.div`
  background-color: #ffffff;
  flex-basis: 50%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const SigninTitle = styled.div`
  margin-top: 5vw;
  margin-right: 17vw;
  font-size: 2rem;
  font-weight: 550;
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 50%;
  background-color: #f0f0f0;
`;
export const ImageLogo = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

export const StyledForm = styled.form`
  margin-top: -7vw;
  margin-right: 1vw;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledInputDiv = styled.div`
  margin-top: 0.2rem;
`;

export const StyledLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

export const StyledInput = styled.input`
  border-radius: 0.5rem;
  width: 22rem;
  border: 1px solid #d9d9d9;
  background-color: #fafafa;
  height: 2.8rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;
export const SignInButton = styled.button`
  background-color: #ff4e50;
  color: white;
  border: none;
  width: 22rem;
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
  justify-content: center;
  display: flex;
  background-color: #ffffff;
  color: black;
  width: 22rem;
  border-top: 1px solid #000000;
  border-radius: 5px;
  padding: 10px;
  transition-duration: 0.3s;
  cursor: pointer;
  &:hover {
    color: #4285f4;
  }
`;
const GoogleLogo = styled.img`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
`;
const LineLeft = styled.div`
  width: 33%;
  height: 0.1rem;
  margin-right: 0.5rem;
  background: linear-gradient(to left, gray, #fafafa);
`;
const LineRight = styled.div`
  width: 33%;
  height: 0.1rem;
  margin-left: 0.5rem;
  background: linear-gradient(to right, gray, #fafafa);
`;
const OrBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
`;
