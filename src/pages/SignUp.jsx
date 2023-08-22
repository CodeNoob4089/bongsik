import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
      alert("회원가입 완료! 이메일을 인증해주세요.");
      navigate("/");
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
    return (
      state.emailError || state.passwordError || state.confirmPasswordError
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!handleErrorCheck()) {
      joinWithVerification(
        state.name,
        state.email,
        state.password,
        state.photoURL
      );
    } else {
      alert("입력값을 확인해주세요.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          닉네임
          <input
            type="text"
            name="name"
            value={state.name}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          이메일
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleEmailChange}
          />
        </label>
        {state.emailError && <ErrorArea>{state.emailError}</ErrorArea>}
      </div>
      <div>
        <label>
          비밀번호
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={(e) => {
              handleChange(e);
              state.passwordError = "";
            }}
            onBlur={(e) => {
              if (e.target.value.length < 6 || e.target.value.length > 20) {
                setState({
                  ...state,
                  passwordError: "비밀번호는 6~20자리로 입력해주세요.",
                });
              } else {
                state.passwordError = "";
              }
            }}
          />
        </label>
        {state.passwordError && <ErrorArea>{state.passwordError}</ErrorArea>}
      </div>
      <div>
        <label>
          비밀번호 확인
          <input
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
        </label>
        {state.confirmPasswordError && (
          <ErrorArea>{state.confirmPasswordError}</ErrorArea>
        )}
      </div>
      <button type="submit">회원가입</button>
    </form>
  );
}

export default SignUp;

export const ErrorArea = styled.span`
  color: red;
`;
