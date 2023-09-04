import React, { useState } from "react";
import styled from "styled-components";
import useAuthStore from "../store/auth";
import { doc, updateDoc } from "@firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function EditUserModal({ isOpen, onCancle }) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");
  const [newPhotoURL, setNewPhotoURL] = useState(user?.photoUrl || "");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    if (e.target.files[0]) {
      let reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoURL(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setNewPhotoURL(user?.photoUrl || "");
    }
  };

  const handleConfirmClick = async () => {
    let editPhotoURL = newPhotoURL;
    if (selectedFile) {
      let storageRef = ref(storage, `profileImages/${user.uid}`);

      let uploadTask = uploadBytesResumable(storageRef, selectedFile);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log(error);
            reject();
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("file available at", downloadURL);
              editPhotoURL = downloadURL;
              resolve();
            });
          }
        );
      });
    }
    const updatedUserInfo = {
      ...user,
      displayName: newDisplayName,
      photoUrl: newPhotoURL || user.photoUrl,
    };

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      displayName: newDisplayName || user.displayName,
      photoUrl: editPhotoURL || user.photoUrl,
    });

    setUser(updatedUserInfo);

    onCancle();
  };
  if (!isOpen) return null;
  return (
    <ModalBackground>
      <ModalContainer>
        <ContentContainer>
          <InputFieldLabel>프로필 사진</InputFieldLabel>
          <ProfileImage src={newPhotoURL} alt="Profile" />
          <input type="file" onChange={handleFileChange} />
          <InputFieldLabel>닉네임</InputFieldLabel>
          <InputField
            type="text"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            placeholder={user?.displayName}
          />
        </ContentContainer>
        <ButtonContainer>
          <ConfirmButton onClick={handleConfirmClick}>수정</ConfirmButton>
          <CancelButton onClick={onCancle}>취소</CancelButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalBackground>
  );
}

export default EditUserModal;

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
  width: 50vw;
  height: 60vh;
  padding: 40px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  gap: 30px;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition-duration: 0.3s;
  &:hover {
    background-color: #ff4e50;
  }
`;

const CancelButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition-duration: 0.3s;
  &:hover {
    background-color: #454647;
  }
`;
const InputFieldLabel = styled.label`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0.2em;
`;

const InputField = styled.input`
  width: 40%;
  padding: 0.5em 0.7em;
  border-radius: 0.3em;
  border: none;
  margin-bottom: 0.8em;

  &::placeholder {
    color: #6c757d;
  }
`;
const ProfileImage = styled.img`
  width: auto;
  height: auto;
  max-width: 200px;
  max-height: 200px;
  border-radius: 50%;
  margin-bottom: 20px;
`;
