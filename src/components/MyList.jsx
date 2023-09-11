import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import useAuthStore from "../store/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { nanoid } from "nanoid";
import { getMyTags, getPosts } from "../api/collection";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { CustomArrowPrev } from "./CustomArrowPrev";
import { CustomArrowNext } from "./CustomArrowNext";
const GET_MY_TAGS = "getMyTags";

function MyList() {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const addImageInput = React.useRef(null);
  const [addActive, setAddActive] = useState(false);
  const [collectionInput, setCollectionInput] = useState({
    coverImage: "",
    title: "",
    collectionID: nanoid(),
  });
  const [toggleOpen, setToggleOpen] = useState("");
  const { loading, data: myTags } = useQuery(GET_MY_TAGS, getMyTags);
  const { data: postData } = useQuery(`fetchPostData`, getPosts);
  const [isModalOpen, setIsMoadlOpen] = useState(false);

  const addMutation = useMutation(
    async () => {
      const usersRef = doc(db, "users", user.uid);
      await updateDoc(usersRef, { myTags: arrayUnion(collectionInput) });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_MY_TAGS);
      },
    }
  );

  const deleteMutation = useMutation(
    async (key) => {
      const usersRef = doc(db, "users", user.uid);
      await updateDoc(usersRef, {
        myTags: myTags.filter((tag) => tag.collectionID !== key),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_MY_TAGS);
      },
    }
  );

  const addMyCollection = () => {
    if (!auth.currentUser) {
      alert("로그인 후 이용해주세요!");
    } else {
      setAddActive(true);
    }
  };
  const onImageUploadButtonClick = () => {
    addImageInput.current.click();
  };

  const onSelectImage = async (e) => {
    const image = e.target.files[0];
    if (image !== undefined) {
      const imageRef = ref(storage, `${auth.currentUser.email}/${image.name}`);
      await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(imageRef);
      setCollectionInput({ ...collectionInput, coverImage: downloadURL });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (collectionInput.title === "") {
      alert("컬렉션 제목을 입력해주세요!");
    } else {
      addMutation.mutate();
      setCollectionInput({
        coverImage: "",
        title: "",
        collectionID: nanoid(),
      });
      setAddActive(false);
    }
  };

  const onToggleOpenButtonClick = (tagID) => {
    setToggleOpen(tagID);
    setIsMoadlOpen(true);
  };
  const closeModal = () => {
    setIsMoadlOpen(false);
    setToggleOpen("");
  };

  const onDeleteButtonClick = (key) => {
    if (window.confirm("컬렉션을 삭제하시겠습니까?")) {
      deleteMutation.mutate(key);
      alert("컬렉션이 삭제되었습니다!");
    } else {
      return;
    }
  };

  return (
    <>
      <ListCardsContainer>
        <CollectionCard>
          <ListTitle>나의 컬렉션 리스트</ListTitle>
          {addActive ? (
            <>
              <AddButton onClick={() => setAddActive(false)}>ㅡ</AddButton>
              <NewCollectionCover img={collectionInput.coverImage}></NewCollectionCover>
              <NewCollectionForm onSubmit={onSubmit}>
                <CollectionTitleInput
                  placeholder="컬렉션 제목"
                  value={collectionInput.title}
                  onChange={(e) => {
                    setCollectionInput({ ...collectionInput, title: e.target.value });
                  }}
                />
                <input type="file" style={{ display: "none" }} ref={addImageInput} onChange={onSelectImage} />
                <ImageUploadButton type="button" onClick={onImageUploadButtonClick}>
                  커버 이미지 선택
                </ImageUploadButton>
              </NewCollectionForm>
            </>
          ) : (
            <>
              <AddButton onClick={addMyCollection}>+</AddButton>
            </>
          )}
        </CollectionCard>
        {!loading && myTags && (
          <CarouselBox
            responsive={responsive}
            infinite={true}
            customLeftArrow={<CustomArrowPrev />}
            customRightArrow={<CustomArrowNext />}
          >
            {myTags?.map((tag) => {
              return (
                <>
                  <CollectionCard key={tag.collectionID}>
                    <ImageBox src={tag.coverImage}></ImageBox>
                    <CardTitle>
                      {tag.title}
                      <ButtonBox>
                        {toggleOpen !== tag.collectionID ? (
                          <ToggleButton onClick={() => onToggleOpenButtonClick(tag.collectionID)}>▼</ToggleButton>
                        ) : (
                          <ToggleButton onClick={closeModal}>▲</ToggleButton>
                        )}
                        <DeleteButton onClick={() => onDeleteButtonClick(tag.collectionID)}>
                          <FontAwesomeIcon icon={faTrashCan} />
                        </DeleteButton>
                      </ButtonBox>
                    </CardTitle>
                  </CollectionCard>
                </>
              );
            })}
          </CarouselBox>
        )}
      </ListCardsContainer>
      {isModalOpen ? (
        <PostLists open={isModalOpen}>
          {postData
            ?.filter((post) => post.collectionTag === toggleOpen)
            .map((p) => (
              <CollectedPosts key={p.postID}>
                <ImageBox src={p.photo}></ImageBox>
                <TextBox>
                  <h2>{p.place.place_name}</h2>
                </TextBox>
              </CollectedPosts>
            ))}
        </PostLists>
      ) : null}
    </>
  );
}

export default MyList;

const ListCardsContainer = styled.div`
  position: relative;
  width: 75vw;
  height: 30vh;
  margin: 13vh auto;
  display: flex;
  flex-direction: row;
  border-radius: 15px;
`;

const ListTitle = styled.h1`
  font-size: 18px;
  font-weight: bold;
  color: #c8c8c8;
`;

const CollectionCard = styled.div`
  width: 15vw;
  height: 15rem;
  display: flex;
  margin: 0 1vw;
  border-radius: 1.5rem;
  background-color: white;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CarouselBox = styled(Carousel)`
  width: 60rem;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 49;
  .carousel-button-left {
    position: fixed;
    left: 20px;
    top: calc(50% - 20px);
  }
  .carousel-button-right {
    position: fixed;
    right: 20px;
    top: calc(50% - 20px);
  }
`;

const ImageBox = styled.img`
  width: 8rem;
  height: 8rem;
  background-color: #c8c8c8;
  border-radius: 15px;
`;

const TextBox = styled.div`
  font-size: 17px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 30px;
`;

const CardTitle = styled.h2`
  font-size: 17px;
  padding-left: 30px;
  padding-top: 10px;
  width: calc(100% - 80px);
  max-height: 80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: space-between;
`;

const ToggleButton = styled.button`
  font-size: 18px;
  width: 50px;
  margin-left: 15px;
  border: none;
  background-color: white;
  color: gray;
  cursor: pointer;
`;
const PostLists = styled.div`
  background-color: #dccdc5;
  border-radius: 15px;
  width: 20rem;
  height: 10rem;
`;

const CollectedPosts = styled.div`
  background-color: white;
  display: flex;
  margin-top: 20px;
`;

const DeleteButton = styled.button`
  font-size: 14px;
  width: 50px;
  margin-left: 15px;
  border: none;
  background-color: white;
  color: gray;
  cursor: pointer;
`;

const AddButton = styled.button`
  font-weight: bold;
  font-size: 17px;
  width: 40px;
  height: 40px;
  background-color: #ff4e50;
  color: white;
  border: none;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  &:hover {
    background-color: #ff7337;
  }
`;
const NewCollectionCover = styled.div`
  width: 80px;
  height: 80px;
  background-color: #c8c8c8;
  border-radius: 15px;
  background-image: url(${(props) => props.img});
  background-size: 5rem;
`;

const NewCollectionForm = styled.form`
  padding: 10px;
  width: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const CollectionTitleInput = styled.input`
  text-align: center;
  width: 80%;
  height: 30px;
  border: 1px solid #c8c8c8;
  border-radius: 10px;
`;

const ImageUploadButton = styled.button`
  width: 80%;
  height: 30px;
  margin-top: 5px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: gray;
`;
