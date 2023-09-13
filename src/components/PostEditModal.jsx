import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
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
  const initialStars = [false, false, false, false, false];
  const [stars, setStars] = useState(initialStars.map((_, i) => i < postData.star));
  const starClickHandler = (index) => {
    if (index + 1 === stars.filter((s) => s === true).length) {
      setInputValue({ ...inputValue, star: 0 });
      setStars(initialStars);
      return;
    }
    setInputValue({ ...inputValue, star: index + 1 });

    let newStars = [...initialStars];

    for (let i = 0; i <= index; i++) {
      newStars[i] = true;
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
        <ModalTitle>
          <StoreInfo>
            <span>가게:&nbsp;{inputValue.place.place_name}</span>
            <span>주소:&nbsp;{inputValue.place.road_address_name}</span>
          </StoreInfo>
          <TitleCategory>
            <SelectBox>
              <CollectionSelect
                value={inputValue.collectionTag}
                onChange={(e) => setInputValue({ ...inputValue, collectionTag: e.target.value })}
              >
                <option value="">컬렉션 선택안함</option>
                {myTags?.map((tag) => (
                  <option key={tag.collectionID} value={tag.collectionID}>
                    {tag.title}
                  </option>
                ))}
              </CollectionSelect>
            </SelectBox>
            <CategoryDiv>{inputValue.category}</CategoryDiv>
          </TitleCategory>
        </ModalTitle>
        <ModalContents>
          <div>
            별점:&nbsp;
            {stars.map((starState, index) => (
              <StarSpan onClick={() => starClickHandler(index)}>
                <FontAwesomeIcon icon={faStar} style={{ color: starState ? "#ff4e50" : "gray" }} />
              </StarSpan>
            ))}
          </div>
          <ReviewInput
            value={inputValue.content}
            onChange={(e) => setInputValue({ ...inputValue, content: e.target.value })}
          />
          <BottomContent>
            <FileInput type="file" onChange={(e) => handlePhotoUpload(e)} />
            <div>작성자: {user.displayName}</div>
          </BottomContent>
        </ModalContents>
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
  top: 0;
  left: 0;
  position: fixed;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Modal = styled.div`
  padding: 0px 50px;
  position: fixed;
  width: 50rem;
  height: 40rem;
  z-index: 55;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 8px;
`;

const ModalTop = styled.div`
  border-bottom: 3px solid #f2f2f5;
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CloseButton = styled.button`
  position: absolute;
  right: 50px;
  font-size: 20px;
  font-weight: bold;
  color: gray;
  width: 40px;
  height: 40px;
  background-color: white;
  border: none;
  cursor: pointer;
`;
const ModalContents = styled.div`
  padding: 10px 30px;
  height: calc(100% - 270px);
  display: flex;
  flex-direction: column;
`;
const ModalTitle = styled.div`
  width: 100%;
  height: 80px;
  border-bottom: 3px solid #f2f2f5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
  line-height: 30px;
`;
const TitleCategory = styled.div`
  display: flex;
`;
const CategoryDiv = styled.div`
  background-color: #f2f2f5;
  color: gray;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  line-height: 40px;
  width: 70px;
  height: 40px;
  margin-left: 10px;
  border-radius: 10px;
`;
const BottomContent = styled.div`
  padding: 10px 20px;
  height: 15%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const InputField = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ReviewInput = styled.textarea`
  margin-top: 10px;
  height: 85%;
  border: none;
  resize: none;
  padding: 10px;
  line-height: 20px;
  font-size: 15px;
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
  padding: 10px 20px;
`;

const SelectBox = styled.div`
  width: auto;
  height: 40px;
  display: flex;
  flex-direction: row;
  padding: 0px 13px;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  background-color: #f2f2f5;
  border: none;
  cursor: pointer;
`;

const PublicSelect = styled.select`
  border: none;
  outline: none;
  background-color: #f2f2f5;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  font-weight: bold;
  color: gray;
  text-align: center;
  cursor: pointer;
`;

const CollectionSelect = styled.select`
  border: none;
  outline: none;
  background-color: #f2f2f5;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  font-weight: bold;
  color: gray;
  text-align: center;
  cursor: pointer;
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
