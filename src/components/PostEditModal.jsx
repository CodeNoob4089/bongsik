import React, { useState } from "react";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import useAuthStore from "../store/auth";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen, faStar } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "react-query";
import { getMyTags } from "../api/collection";

function PostEditModal({ modalOpen, onRequestClose, postData }) {
  const user = useAuthStore((state) => state.user);
  const { data: myTags } = useQuery("getMyTags", getMyTags);
  const [inputValue, setInputValue] = useState(postData);
  const initialStars = Array(5)
    .fill(false)
    .map((_, i) => i < postData.star);
  const [stars, setStars] = useState(initialStars);
  const starClickHandler = (index) => {
    setInputValue({ ...inputValue, star: index + 1 });
    let newStars = [...stars];
    for (let i = 0; i < newStars.length; i++) {
      newStars[i] = i <= index;
    }
    setStars(newStars);
  };

  const modalRef = useRef();
  const closeModalOnOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  const closeModal = () => {
    onRequestClose();
    document.body.style.overflow = "auto";
  };

  const onUpdateButtonClick = async () => {
    try {
      const postRef = doc(db, "posts", postData.docID);
      await updateDoc(postRef, inputValue);
      alert("게시글이 수정되었습니다!");
      closeModal();
    } catch (e) {
      console.error("문서 업데이트 실패 오류:", e);
    }
  };
  const handlePhotoUpload = async (e) => {
    const image = e.target.files[0];
    if (image !== undefined) {
      const imageRef = ref(storage, `${user.uid}/${image.name}`);
      await uploadBytes(imageRef, image);

      const downloadURL = await getDownloadURL(imageRef);
      setInputValue({ ...inputValue, photo: downloadURL });
    }
  };

  return (
    <>
      <ModalContainer modalOpen={modalOpen} onClick={closeModalOnOutsideClick}></ModalContainer>

      <Modal ref={modalRef}>
        <ModalTop>
          게시글 수정
          <CloseButton onClick={closeModal}>✕</CloseButton>
        </ModalTop>
        <InputField type="text" value={inputValue.place.place_name} readOnly />
        <ReviewInput
          value={inputValue.content}
          onChange={(e) => setInputValue({ ...inputValue, content: e.target.value })}
        />
        <div>
          별점:&nbsp;
          {stars.map((starState, index) => (
            <StarSpan onClick={() => starClickHandler(index)}>
              <FontAwesomeIcon icon={faStar} style={{ color: starState ? "#ff4e50" : "gray" }} />
            </StarSpan>
          ))}
        </div>
        <FileInput type="file" onChange={(e) => handlePhotoUpload(e)} />
        <CollectionTagSelect
          value={inputValue.collectionTag}
          onChange={(e) => setInputValue({ ...inputValue, collectionTag: e.target.value })}
        >
          <option value="">컬렉션 선택안함</option>
          {myTags?.map((tag) => (
            <option key={tag.collectionID} value={tag.collectionID}>
              {tag.title}
            </option>
          ))}
        </CollectionTagSelect>
        <ModalBottom>
          <SelectBox>
            {inputValue.isPublic ? (
              <FontAwesomeIcon icon={faLockOpen} style={{ color: "gray" }} />
            ) : (
              <FontAwesomeIcon icon={faLock} style={{ color: "gray" }} />
            )}
            <PublicSelect
              value={inputValue.isPublic ? "public" : "private"}
              onChange={(e) => setInputValue({ ...inputValue, isPublic: e.target.value === "public" })}
            >
              <option value="private">비공개</option>
              <option value="public">공개</option>
            </PublicSelect>
          </SelectBox>
          <UpdateButton onClick={onUpdateButtonClick}>수정하기</UpdateButton>
        </ModalBottom>
      </Modal>
    </>
  );
}

export default PostEditModal;

// Styles

const ModalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${(props) => (props.modalOpen ? "50" : "-1")};
`;

const Modal = styled.div`
  background-color: white;
  margin: auto;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 51;
`;

const ModalTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CloseButton = styled.span`
  cursor: pointer;
  font-size: 30px;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    margin-bottom: 20px;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ReviewInput = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const StarSpan = styled.span`
  cursor: pointer;
  margin-left: 2px;
  font-size: 18px;
`;

const FileInput = styled.input`
  margin-bottom: 0.5em;
`;
const ModalBottom = styled.div`
  border-top: 3px solid #f2f2f5;
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectBox = styled.div`
  width: auto;
  height: 40px;
  display: flex;
  flex-direction: row;
  padding: 0px13px;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  background-color: #f2f2f5;

  svg {
    margin-left: 10px;
  }
`;

const PublicSelect = styled.select`
  border: none;
  outline: none;
  background-color: #f2f2f5;
  height: 100%;
  border-radius: 10px;
  width: 4.5rem;
  font-weight: bold;
  color: #808080;
  text-align: center;
  cursor: pointer;
`;

const CollectionTagSelect = styled.select`
  width: 100%;
  height: 2.3em;
  border: none;
  border-radius: 0.25em;

  option {
    background-color: #f2f2f5;
    color: #6d6c6c;
    padding: 0.5em;
    font-weight: bold;
  }
`;

const UpdateButton = styled.button`
  width: 8rem;
  padding: 0.75em;
  color: white;
  background-color: #ff4e50;
  text-align: center;
  font-weight: bold;
  border: none;
  border-radius: 0.25em;
  cursor: pointer;
  transition-duration: 0.3s;
  &:hover {
    background-color: #ff3333;
  }
`;
