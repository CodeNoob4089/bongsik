import React from "react";
import styled from "styled-components";

function DeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <ModalBackground>
      <ModalContainer>
        <ContentContainer>
          <Content>정말 삭제하시겠습니까?</Content>
        </ContentContainer>
        <ButtonContainer>
          <ConfirmButton onClick={onConfirm}>삭제</ConfirmButton>
          <CancelButton onClick={onCancel}>취소</CancelButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalBackground>
  );
}

export default DeleteModal;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 18px;
  width: 20vw;
  height: 20vh;
  padding: 20px;
  background-color: white;
`;
const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;
const Content = styled.p`
  font-size: 18px;
  font-weight: bold;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 1.2rem;
`;

const ConfirmButton = styled.button`
  width: 5rem;
  padding: 0.75em;
  color: white;
  background-color: #ff4e50;
  text-align: center;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition-duration: 0.3s;
  &:hover {
    background-color: #ff3333;
  }
`;

const CancelButton = styled.button`
  width: 5rem;
  padding: 0.75em;
  color: white;
  background-color: #6c757d;
  text-align: center;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition-duration: 0.3s;
  &:hover {
    background-color: #454647;
  }
`;
