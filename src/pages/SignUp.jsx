import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getBadgeData } from "../store/BadgeData";
import { updateUserDoc } from "../store/UserService";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  photoURL:
    "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/59932b0eb046f9fa3e063b8875032edd_crop.jpeg?alt=media&token=615f79d4-7eef-46e9-ba45-d7127b0597ea",
  emailError: "",
  passwordError: "",
  confirmPasswordError: "",
};

function SignUp() {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setState((prevState) => ({
      ...prevState,
      email,
      emailError: validateEmail(email) ? "" : "잘못된 이메일 형식입니다.",
    }));
  };

  const joinWithVerification = async (name, email, password, photo) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      await sendEmailVerification(auth.currentUser);
      const badges = await getBadgeData();

      const userBadgeData = badges.reduce((badgeObj, badge) => {
        badgeObj[badge.id] = {
          isOwned: false,
        };
        return badgeObj;
      }, {});
      alert("회원가입 완료! 이메일을 인증해주세요.");
      navigate("/");
      signOut(auth);
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        myTags: [],
        userLikes: [],
        ownedBadges: userBadgeData,
        postCounts: 0,
        level: 1,
        exp: 0,
      });
    } catch ({ code, message }) {
      alert(code);
    }
  };
  const validateEmail = (email) => {
    const emailRegEx =
      /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return emailRegEx.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleErrorCheck = () => {
    return state.emailError || state.passwordError || state.confirmPasswordError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleErrorCheck()) {
      joinWithVerification(state.name, state.email, state.password, state.photoURL);
    } else {
      alert("입력값을 확인해주세요.");
    }
  };

  return (
    <>
      <SignUpContainer>
        <SignUpBox>
          <InputContainer>
            <SignupTitle>Sign Up</SignupTitle>
            <StyledForm onSubmit={handleSubmit}>
              <StyledInputDiv>
                <StyledLabel>닉네임</StyledLabel>
                <StyledInput type="text" name="name" value={state.name} onChange={handleChange} required />
              </StyledInputDiv>
              <StyledInputDiv>
                <StyledLabel>이메일</StyledLabel>
                <StyledInput type="email" name="email" value={state.email} onChange={handleEmailChange} />

                {state.emailError && <ErrorArea>{state.emailError}</ErrorArea>}
              </StyledInputDiv>
              <StyledInputDiv>
                <StyledLabel>비밀번호</StyledLabel>
                <StyledInput
                  type="password"
                  name="password"
                  value={state.password}
                  onChange={(e) => {
                    handleChange(e);
                    setState((prevState) => ({
                      ...prevState,
                      passwordError: "",
                    }));
                  }}
                  onBlur={(e) => {
                    if (e.target.value.length < 6 || e.target.value.length > 20) {
                      setState({
                        ...state,
                        passwordError: "비밀번호는 6~20자리로 입력해주세요.",
                      });
                    } else {
                      setState((prevState) => ({
                        ...prevState,
                        passwordError: "",
                      }));
                    }
                  }}
                />

                {state.passwordError && <ErrorArea>{state.passwordError}</ErrorArea>}
              </StyledInputDiv>
              <StyledInputDiv>
                <StyledLabel>비밀번호 확인</StyledLabel>
                <StyledInput
                  type="password"
                  name="confirmPassword"
                  value={state.confirmPassword}
                  onChange={(e) => {
                    handleChange(e);
                    state.confirmPasswordError = "";
                  }}
                  onBlur={(e) => {
                    if (e.target.value !== state.password) {
                      setState({
                        ...state,
                        confirmPasswordError: "비밀번호가 일치하지 않습니다.",
                      });
                    } else {
                      state.confirmPasswordError = "";
                    }
                  }}
                />

                {state.confirmPasswordError && <ErrorArea>{state.confirmPasswordError}</ErrorArea>}
              </StyledInputDiv>
              <SignUpButton type="submit">Sign Up</SignUpButton>
            </StyledForm>
          </InputContainer>
          <ImageContainer>
            <ImageLogo
              src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EB%A1%9C%EA%B3%A08.png?alt=media&token=de9e2b70-f61b-41a1-802f-1c910339a984"
              onClick={() => {
                navigate("/");
              }}
            />
          </ImageContainer>
        </SignUpBox>
      </SignUpContainer>
    </>
  );
}

export default SignUp;

export const ErrorArea = styled.span`
  display: block;
  color: red;
`;
export const SignUpContainer = styled.div`
  display: flex;
  background-color: #d9d9d9;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 20px);
`;
export const SignupTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  font-size: 42px;
  font-weight: bold;
  position: relative;
  left: 80px;
  top: 90px;
`;

export const SignUpBox = styled.div`
  display: flex;
  width: calc(100% - 60px);
  max-width: calc(1000px - 60px);
  height: 700px;
`;

export const InputContainer = styled.div`
  background-color: #ffffff;
  flex-basis: 50%;
  padding-right: 20px;
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
export const SignUpButton = styled.button`
  background-color: #ff4e50;
  color: white;
  border: none;
  width: 20rem;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    background-color: #ff2e30;
  }
`;
