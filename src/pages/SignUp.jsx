import React, { useState } from "react";
import { GoogleAuthProvider, sendEmailVerification, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getBadgeData } from "../store/BadgeData";
import { doc, setDoc } from "firebase/firestore";
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

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        myTags: [],
        userLikes: [],
        ownedBadges: userBadgeData,
        postCounts: 0,
        level: 1,
        exp: 0,
        dongCounts: [],
      });
      alert("회원가입 완료! 이메일을 인증해주세요.");
      await signOut(auth);
      navigate("/signin");
    } catch ({ code, message }) {
      // console.log(message, code);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!handleErrorCheck()) {
      joinWithVerification(state.name, state.email, state.password, state.photoURL);
    } else {
      alert("입력값을 확인해주세요.");
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
        if (userRef) return;
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
      <SignUpContainer>
        <SignUpBox>
          <InputContainer>
            <SignupTitle>Create Your Account</SignupTitle>
            <StyledForm onSubmit={handleSubmit}>
              <StyledInputDiv>
                <StyledLabel>이름</StyledLabel>
                <StyledInput
                  type="text"
                  name="name"
                  value={state.name}
                  onChange={handleChange}
                  required
                  placeholder="이름을 입력해주세요."
                />
              </StyledInputDiv>
              <StyledInputDiv>
                <StyledLabel>이메일</StyledLabel>
                <StyledInput
                  type="email"
                  name="email"
                  value={state.email}
                  onChange={handleEmailChange}
                  placeholder="이메일을 입력해주세요."
                />

                {state.emailError && <ErrorArea>{state.emailError}</ErrorArea>}
              </StyledInputDiv>
              <StyledInputDiv>
                <StyledLabel>비밀번호</StyledLabel>
                <StyledInput
                  placeholder="비밀번호"
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
                  placeholder="비밀번호를 한 번 더 입력해주세요."
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
              <SignUpButton type="submit">Sign Up</SignUpButton>{" "}
              <GoogleSignUpButton type="button" onClick={handleGoogleLogin}>
                <GoogleLogo src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/Google__G__Logo%201.png?alt=media&token=75b51e58-8a63-44a8-86a6-fcdb851c166a" />
                <p>Sign in with Google</p>
              </GoogleSignUpButton>
              <OrBox>
                <LineLeft />
                OR
                <LineRight />
              </OrBox>
              <Login>
                <p>이미 회원이신가요?</p>
                <Logintag
                  onClick={() => {
                    navigate("/signin");
                  }}
                >
                  로그인
                </Logintag>
              </Login>
            </StyledForm>
          </InputContainer>
          <ImageContainer>
            <ImageLogo
              onClick={() => {
                navigate("/main");
              }}
              src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/Frame%201321317750.png?alt=media&token=d9cd2da8-d246-47d6-b7e9-1f936956a485"
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
  background-color: #ff4e50;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
export const SignupTitle = styled.div`
  margin-top: 3vw;
  width: 25rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const SignUpBox = styled.div`
  display: flex;
  width: 75vw;
  height: 85.3vh;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  flex-basis: 50%;
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 50%;
  background-color: #f0f0f0;
`;
export const ImageLogo = styled.img`
  cursor: pointer;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

export const StyledForm = styled.form`
  margin-right: 2.5vw;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledInputDiv = styled.div`
  margin-top: 1rem;
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
  height: 2.5rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;
export const SignUpButton = styled.button`
  background-color: #ff4e50;
  color: white;
  border: none;
  width: 22rem;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: 0.7rem;
  cursor: pointer;
  &:hover {
    background-color: #ff2e30;
  }
`;
const LineLeft = styled.div`
  width: 33%;
  height: 0.1rem;
  margin-right: 0.5rem;
  background: linear-gradient(to left, #a5a5a5, #fafafa);
`;
const LineRight = styled.div`
  width: 33%;
  height: 0.1rem;
  margin-left: 0.5rem;
  background: linear-gradient(to right, #a5a5a5, #fafafa);
`;
const OrBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
`;
const Login = styled.div`
  font-size: 0.8rem;
  display: flex;
`;
const Logintag = styled.p`
  text-decoration: underline;
  color: #ff4e50;
  cursor: pointer;
  margin-left: 0.2rem;
`;

const GoogleSignUpButton = styled.button`
  justify-content: center;
  display: flex;
  background-color: #ffffff;
  color: black;
  width: 22rem;
  border-top: 1px solid #000000;
  border-radius: 5px;
  padding: 10px;
  margin-top: 0.5rem;
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