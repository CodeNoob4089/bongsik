import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { nanoid } from "nanoid";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Description, DescriptionBox, DescriptionTitle } from "../shared/MainDescription";
const GET_MY_TAGS = "getMyTags";

function MyList({myTags, postData, user}) {

  const CustomRightArrow = ({ onClick}) => {
    // onMove means if dragging or swiping in progress.
    return <CustomCarouselButton ref={rightButton} onClick={() => onClick()} />;
  };
  const CustomLeftArrow = ({ onClick}) => {
    // onMove means if dragging or swiping in progress.
    return <CustomCarouselButton ref={leftButton} onClick={() => onClick()} />;
  };

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

  const addImageInput = React.useRef(null);
  const [addActive, setAddActive] = useState(false);
  const [collectionInput, setCollectionInput] = useState({
    coverImage: "",
    title: "",
    collectionID: nanoid(),
  });
  const [toggleOpen, setToggleOpen] = useState("");
  const [isModalOpen, setIsMoadlOpen] = useState(false);

  const leftButton = React.useRef(null);
  const rightButton = React.useRef(null);

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
    <CollectionContainer>
      <DescriptionBox>
            <DescriptionTitle>내 컬렉션</DescriptionTitle>
            <Description>나만의 카테고리를 만들어 게시물을 분류해보세요.</Description>
      </DescriptionBox>
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
              <AddButton onClick={addMyCollection}>+</AddButton>
          )}
        </CollectionCard>
        <CustomCarouselButton
        onClick={() => leftButton.current.click()}
        img={"https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/left_button.png?alt=media&token=87b75d4f-f08f-46a4-950b-bc96ca8963a7"}
        />
          <CarouselBox
            responsive={responsive}
            infinite={true}
            removeArrowOnDeviceType={["tablet", "mobile"]}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customLeftArrow={<CustomLeftArrow/>}
            customRightArrow={<CustomRightArrow />}
          >
            {myTags?.length > 0 ? (
              myTags?.map((tag) => {
                return (
                    <CollectionCard key={tag.collectionID}>
                      <ImageBox src={tag.coverImage || "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%8A%A4%ED%8C%8C%EA%B2%8C%ED%8B%B0%20ETG.png?alt=media&token=a16fadeb-f562-4c12-ad73-c4cc1118a108"}></ImageBox>
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
                );
              })
            ) : (
              <NoTag>
                <NoTagTop>왼쪽 버튼을 눌러</NoTagTop>
                <NoTagTBottom>컬렉션을 추가해주세요!</NoTagTBottom>
              </NoTag>
            )}
          </CarouselBox>
          <CustomCarouselButton
          onClick={() => rightButton.current.click()}
          img={"https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/right_button.png?alt=media&token=eaf76923-992b-40bf-a90b-aa2c80e8de8f"}
          />
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
    </CollectionContainer>
  );
}

export default MyList;

const CollectionContainer = styled.div`
  margin: 10vh auto 13vh auto;
  width: 100%;
`

const ListCardsContainer = styled.div`
  width: 100%;
  height: 40vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
`;

const ListTitle = styled.h1`
  font-size: 18px;
  font-weight: bold;
  color: #c8c8c8;
`;

const CollectionCard = styled.div`
  width: 15.1vw;
  height: 30.8vh;
  display: flex;
  border-radius: 10px;
  background-color: white;
  box-shadow: 1px 1px 1px #e7e7e7;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CustomCarouselButton = styled.button`
    border: none;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    margin: 0.5rem;
    background-color: white;
    background-image: url(${(props)=> props.img});
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 1.5rem;
    box-shadow: 1px 1px 1px #e7e7e7;
    cursor: pointer;
`

const CarouselBox = styled(Carousel)`
  width: 60vw;
  padding-left: 17.5rem;
  height: 100%;
`;

const ImageBox = styled.img`
  width: 84%;
  height: 50%;
  background-color: #c8c8c8;
  border-radius: 10px;
  object-fit: cover;
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
  width: 84%;
  height: 40%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NoTag = styled.div`
  margin-left: -10rem;
  width: 30rem;
  height: 12rem;
  margin-top: -3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
  box-shadow: 1px 1px 1px #e7e7e7;
`;
const NoTagTop = styled.div``;
const NoTagTBottom = styled.div`
  margin-top: 1.5rem;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;  
  height: 90%;
`;

const DeleteButton = styled.button`
  font-size: 14px;
  width: 50px;
  border: none;
  background-color: white;
  color: gray;
  cursor: pointer;
`;
const ToggleButton = styled.button`
  font-size: 18px;
  width: 50px;
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
