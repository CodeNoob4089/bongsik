import React, { useState } from "react";
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { emailVerified } = userCredential.user;

      if (emailVerified) {
        navigate("/");
      } else {
        alert("이메일 인증을 확인해주세요.");
      }
    } catch (error) {
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  return (
    <SignInContainer>
      <SignInBox>
        <InputContainer>
          <StyledForm onSubmit={handleSubmit}>
            <StyledInputDiv>
              <StyledLabel>Email</StyledLabel>
              <StyledInput
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </StyledInputDiv>
            <StyledInputDiv>
              <StyledLabel>Password</StyledLabel>
              <StyledInput
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </StyledInputDiv>
            <SignInButton type="submit">Sign In</SignInButton>
          </StyledForm>
        </InputContainer>
        <ImageContainer>이미지 영역</ImageContainer>
      </SignInBox>
    </SignInContainer>
  );
}

export default SignIn;
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
`;

export const ImageContainer = styled.div`
  flex-basis: 50%;
  background-color: #f0f0f0;
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
  :hover {
    cursor: pointer;
    background-color: #ff2e30;
  }
`;
