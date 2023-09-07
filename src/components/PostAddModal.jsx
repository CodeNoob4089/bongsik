import { faLock, faLockOpen, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDoc, collection, doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import { getMyTags, getPosts } from "../api/collection";
import { db, storage } from "../firebase";
import useAuthStore from "../store/auth";
import useClickedDataStore from "../store/modalData";

function PostAddModal({ modalOpen, setModalOpen }) {
  const queryClient = useQueryClient();
  const { data: myTags } = useQuery("getMyTags", getMyTags);

  const clickedData = useClickedDataStore((state) => state.clickedData);
  const setClickedData = useClickedDataStore((state) => state.setClickedData);
  const user = useAuthStore((state) => state.user);

  const clickedCategory =
    clickedData?.category_group_name === "카페"
      ? "카페"
      : clickedData?.category_name?.split(">").includes(" 술집 ")
      ? "술집"
      : "맛집";

  console.log(clickedData?.category_name?.split(">"));

  const [inputValue, setInputValue] = useState({
    place: clickedData,
    content: "",
    uid: user.uid,
    userName: user.displayName,
    star: 0,
    photo: "",
    isPublic: false,
    collectionTag: "",
    likeCount: 0,
    postID: nanoid(),
    category: clickedCategory,
    commentCount: 0,
    timestamp: new Date(),
    userPhoto: user.photoUrl,
  });
  const initialStars = [false, false, false, false, false];
  const [stars, setStars] = useState(initialStars);

  const starClickHandler = (index) => {
    if (index + 1 === stars.filter((s) => s === true).length) {
      console.log("여기유", stars.filter((s) => s === true).length, index);
      setInputValue({ ...inputValue, star: 0 });
      console.log(inputValue.star);
      setStars(initialStars);
      return;
    }
    setInputValue({ ...inputValue, star: index + 1 });
    let newStars = [...stars];
    for (let i = 0; i < 5; i++) {
      newStars[i] = i <= index ? true : false;
    }
    setStars(newStars);
  };

  const selectImage = async (e) => {
    const image = e.target.files[0];
    if (image !== undefined) {
      const imageRef = ref(storage, `${user.uid}/${image.name}`);
      await uploadBytes(imageRef, image);

      const downloadURL = await getDownloadURL(imageRef);
      setInputValue({ ...inputValue, photo: downloadURL });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "auto";
    setClickedData({});
  };

  const mutation = useMutation(
    async () => {
      const usersRef = doc(db, "users", user.uid);
      await addDoc(collection(db, "posts"), inputValue);
      await updateDoc(usersRef, { postCounts: increment(1) });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(getPosts);
      },
    }
  );

  const onAddButtonClick = async () => {
    try {
      const usersRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(usersRef);
      mutation.mutate();
      if (userDoc.data().postCounts >= 5 && !userDoc.data().ownedBadges?.Enxc4FhNynGwy0yjNeZY.isOwned) {
        await updateDoc(usersRef, {
          [`ownedBadges.Enxc4FhNynGwy0yjNeZY`]: { isOwned: true },
        });
        alert("게시글 5개작성에 대한 뱃지를 획득하였습니다!");
      }
      if (userDoc.data().postCounts >= 10 && !userDoc.data().ownedBadges?.anQKDwRjXghFWDwKvaKA.isOwned) {
        await updateDoc(usersRef, {
          [`ownedBadges.anQKDwRjXghFWDwKvaKA`]: { isOwned: true },
        });
        alert("게시글 10개작성에 대한 뱃지를 획득하였습니다!");
      }
      if (userDoc.data().postCounts >= 20 && !userDoc.data().ownedBadges?.AHTgJVUtQIezbnbbIVHL.isOwned) {
        await updateDoc(usersRef, {
          [`ownedBadges.AHTgJVUtQIezbnbbIVHL`]: { isOwned: true },
        });
        alert("게시글 20개작성에 대한 뱃지를 획득하였습니다!");
      }
      await updateDoc(usersRef, { exp: increment(30) });
      const updatedUserDoc = await getDoc(usersRef);
      if (updatedUserDoc.data().exp >= updatedUserDoc.data().level * 100) {
        await updateDoc(usersRef, {
          level: increment(1),
          exp: updatedUserDoc.data().exp - updatedUserDoc.data().level * 100,
        });
        alert("레벨업!");
      }
    } catch (e) {
      console.error("문서 추가 실패 오류:", e);
    }
    closeModal();
  };

  return (
    <>
      <ModalContainer modalOpen={modalOpen} onClick={closeModal}></ModalContainer>
      <Modal>
        <ModalTop>
          새 게시물
          <CloseButton onClick={closeModal}>✕</CloseButton>
        </ModalTop>
        <ModalTitle>
          <StoreInfo>
            <span>가게:&nbsp;{clickedData.place_name}</span>
            <span>
              주소:&nbsp;
              {clickedData.road_address_name ? clickedData.road_address_name : clickedData.address_name}
            </span>
          </StoreInfo>

          <TitleCategory>
            <SelectBox>
              <CollectionSelect
                onChange={(e) =>
                  setInputValue({
                    ...inputValue,
                    collectionTag: e.target.value,
                  })
                }
              >
                <option value="">컬렉션 선택안함</option>
                {myTags?.map((tag) => (
                  <option key={tag.collectionID} value={tag.collectionID}>
                    {tag.title}
                  </option>
                ))}
              </CollectionSelect>
            </SelectBox>
            <CategoryDiv>{clickedCategory}</CategoryDiv>
          </TitleCategory>
        </ModalTitle>
        <ModalContents>
          <div>
            별점:&nbsp;
            {stars.map((star, index) => (
              <StarSpan
                onClick={() => {
                  starClickHandler(index);
                }}
              >
                {stars[index] ? (
                  <FontAwesomeIcon icon={faStar} style={{ color: "#ff4e50" }} />
                ) : (
                  <FontAwesomeIcon icon={faStar} style={{ color: "gray" }} />
                )}
              </StarSpan>
            ))}
          </div>
          <ReviewInput
            placeholder="나만의 맛집 평가를 적어주세요!"
            value={inputValue.content}
            onChange={(e) => {
              setInputValue({ ...inputValue, content: e.target.value });
            }}
          />
          <BottomContent>
            <input type="file" onChange={selectImage} />
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
            <PublicSelect onChange={(e) => setInputValue({ ...inputValue, isPublic: !inputValue.isPublic })}>
              <option value="private">비공개</option>
              <option value="public">공개</option>
            </PublicSelect>
          </SelectBox>
          <AddButton onClick={onAddButtonClick}>기록하기</AddButton>
        </ModalBottom>
      </Modal>
    </>
  );
}

export default PostAddModal;

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
const StarSpan = styled.span`
  cursor: pointer;
  margin-left: 2px;
  font-size: 18px;
`;

const ModalContents = styled.div`
  padding: 10px 30px;
  height: calc(100% - 270px);
  display: flex;
  flex-direction: column;
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

const BottomContent = styled.div`
  padding: 10px 20px;
  height: 15%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
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
  height: 100%;
  border-radius: 10px;
  font-weight: bold;
  color: gray;
  text-align: center;
  cursor: pointer;
`;

const AddButton = styled.button`
  color: white;
  font-weight: bold;
  background-color: #ff4e50;
  width: 8rem;
  height: 2.3rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;
