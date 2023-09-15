import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { nanoid } from "nanoid";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Description, DescriptionBox, DescriptionTitle } from "../shared/MainDescription";
import { ImageBox, InfoBox, PostCard, PostDescription, PostTitle } from "../shared/BestWorstList";
const GET_MY_TAGS = "getMyTags";

function MyList({ myTags, postData, user }) {
  const CustomRightArrow = ({ onClick }) => {
    // onMove means if dragging or swiping in progress.
    return <CustomCarouselButton ref={rightButton} onClick={() => onClick()} />;
  };
  const CustomLeftArrow = ({ onClick }) => {
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
      if(toggleOpen.collectionID === key){
        setIsMoadlOpen(false)
        setToggleOpen("")
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_MY_TAGS);
      },
    }
  );

  const onImageUploadButtonClick = () => {
    addImageInput.current.click();
  };

  const onSelectImage = async (e) => {
    setAddActive(true);
    const image = e.target.files[0];
    if (image !== undefined) {
      const imageRef = ref(storage, `${auth.currentUser.email}/${image.name}`);
      await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(imageRef);
      setCollectionInput({ ...collectionInput, coverImage: downloadURL });
    }
  };

  const onCancel = (e) => {
    e.preventDefault();
    setCollectionInput({
      coverImage: "",
      title: "",
      collectionID: nanoid(),
    });
    setAddActive(false);
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

  const onToggleOpenButtonClick = (tag) => {
    setToggleOpen(tag);
    setIsMoadlOpen(true);
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
          <NewCollectionCover img={collectionInput.coverImage} onClick={onImageUploadButtonClick}>
            {collectionInput.coverImage ? null : "+"}
          </NewCollectionCover>
          <NewCollectionForm onSubmit={onSubmit}>
            <CollectionTitleInput
              placeholder="컬렉션 제목"
              value={collectionInput.title}
              onChange={(e) => {
                setCollectionInput({ ...collectionInput, title: e.target.value });
                setAddActive(true);
              }}
            />
            <input type="file" style={{ display: "none" }} ref={addImageInput} onChange={onSelectImage} />
            {addActive ? (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <NewCollectionButton type="button" onClick={onCancel}>
                  취소
                </NewCollectionButton>
                <NewCollectionButton>확인</NewCollectionButton>
              </div>
            ) : (
              <CollectionDescription>맛 기록 컬렉션을 만들어보세요</CollectionDescription>
            )}
          </NewCollectionForm>
        </CollectionCard>
        <CustomCarouselButton
          onClick={() => leftButton?.current?.click()}
          img={
            "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/left_button.png?alt=media&token=87b75d4f-f08f-46a4-950b-bc96ca8963a7"
          }
        />
        <CarouselBox
          responsive={responsive}
          infinite={true}
          removeArrowOnDeviceType={["tablet", "mobile"]}
          autoPlaySpeed={1000}
          keyBoardControl={true}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
        >
          {myTags?.length > 0 ? (
            myTags?.map((tag) => {
              return (
                <CollectionCard
                  key={tag.collectionID}
                  style={{ cursor: "pointer" }}
                >
                  <CollectionImageBox
                   onClick={() => onToggleOpenButtonClick(tag)}
                    src={
                      tag.coverImage ||
                      "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%8A%A4%ED%8C%8C%EA%B2%8C%ED%8B%B0%20ETG.png?alt=media&token=a16fadeb-f562-4c12-ad73-c4cc1118a108"
                    }
                  ></CollectionImageBox>
                  <CardContents
                   onClick={() => onToggleOpenButtonClick(tag)}>
                    <CardTitle>
                      {tag.title}
                      {/* {toggleOpen !== tag.collectionID ? (
                          <ToggleButton onClick={() => onToggleOpenButtonClick(tag.collectionID)}>▼</ToggleButton>
                        ) : (
                          <ToggleButton onClick={closeModal}>▲</ToggleButton>
                        )} */}
                    </CardTitle>
                    <CollectionDescription>
                      {postData?.filter((p) => p.collectionTag === tag.collectionID).length}개의 글
                    </CollectionDescription>
                  </CardContents>
                    <ButtonBox>
                      <DeleteButton onClick={() => onDeleteButtonClick(tag.collectionID)}></DeleteButton>
                    </ButtonBox>
                </CollectionCard>
              );
            })
          ) : (
            <CollectionCard>
              <NoTagDescription>
                아직 컬렉션이 없어요!
                <br />
                왼쪽에서 추가해보세요
                <br/>
                :)
              </NoTagDescription>
            </CollectionCard>
          )}
        </CarouselBox>
        <CustomCarouselButton
          onClick={() => rightButton?.current?.click()}
          img={
            "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/right_button.png?alt=media&token=eaf76923-992b-40bf-a90b-aa2c80e8de8f"
          }
        />
      </ListCardsContainer>
      {isModalOpen && toggleOpen? (
        <PostLists open={isModalOpen}>
          <CollectionCover img={toggleOpen.coverImage}>{toggleOpen.title}</CollectionCover>
          <CollectionPostsLists>
            {postData
              ?.filter((post) => post.collectionTag === toggleOpen.collectionID)
              .map((p) => (
                <PostCard key={p.postId}>
                  <ImageBox
                    src={
                      p.photo
                        ? p.photo
                        : "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%8A%A4%ED%8C%8C%EA%B2%8C%ED%8B%B0%20ETG.png?alt=media&token=a16fadeb-f562-4c12-ad73-c4cc1118a108"
                    }
                  />
                  <InfoBox>
                    <PostTitle>{p.place.place_name}</PostTitle>
                    <PostDescription>{p.place.road_address_name || p.place.address_name}</PostDescription>
                  </InfoBox>
                </PostCard>
              ))}
          </CollectionPostsLists>
        </PostLists>
      ) : null}
    </CollectionContainer>
  );
}

export default MyList;

const CollectionContainer = styled.div`
  margin: 10vh auto;
  width: 100%;
`;

const ListCardsContainer = styled.div`
  width: 100%;
  height: 40vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
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
  overflow: hidden;
`;

const CustomCarouselButton = styled.button`
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0.5rem;
  background-color: white;
  background-image: url(${(props) => (props.img ? props.img : "")});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 1.5rem;
  box-shadow: 1px 1px 1px #e7e7e7;
  cursor: pointer;
`;

const CarouselBox = styled(Carousel)`
  width: 60vw;
  padding-left: 17.5rem;
  height: 100%;
`;

const CollectionImageBox = styled.img`
  width: 84%;
  height: 50%;
  background-color: #c8c8c8;
  border-radius: 10px;
  object-fit: cover;
`;

const CardContents = styled.div`
  width: 84%;
  height: 30%;
`;

const CardTitle = styled.h2`
  width: 100%;
  height: 2rem;
  font-size: 1.1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NoTagDescription = styled.div`
  background-color: #ff4e5117;
  border: 1.5px dotted #ff4e50;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 0.9rem;
  line-height: 2rem;
`;

const ButtonBox = styled.div`
  width: 90%;
  display: flex;
  justify-content: right;
`;

const DeleteButton = styled.button`
  font-size: 0.9rem;
  width: 1.2rem;
  height: 1.2rem;
  border: none;
  background: none;
  background-image: url("https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/Type184.png?alt=media&token=7a03c8fa-39bf-44f8-97dd-27002cfcc45f");
  background-size: 1rem;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
`;

const NewCollectionCover = styled.div`
  width: 84%;
  height: 50%;
  background-color: #ff4e5117;
  border: 1.5px dotted #ff4e50;
  border-radius: 10px;
  background-image: url(${(props) => props.img});
  background-size: 12rem;
  background-position: center center;
  background-repeat: no-repeat;
  object-fit: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff4e50;
  font-size: 3rem;
  padding-top: 0.5rem;
  cursor: pointer;
`;

const NewCollectionForm = styled.form`
  font-size: 17px;
  width: 84%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const CollectionTitleInput = styled.input`
  text-align: center;
  width: 100%;
  height: 2rem;
  border: 1px solid #c8c8c8;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const NewCollectionButton = styled.button`
  width: 3rem;
  height: 2rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: gray;
`;

const CollectionDescription = styled.div`
  width: 90%;
  height: 2rem;
  font-size: 0.8rem;
  color: gray;
  display: flex;
  align-items: center;
`;

const PostLists = styled.div`
  width: 95%;
  height: 50vh;
  background-color: white;
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  padding: 2rem;
  box-shadow: 1px 1px 1px #e7e7e7;
`;

const CollectionCover = styled.div`
  background-color: white;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url(${(props) =>
      props.img
        ? props.img
        : "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%8A%A4%ED%8C%8C%EA%B2%8C%ED%8B%B0%20ETG.png?alt=media&token=a16fadeb-f562-4c12-ad73-c4cc1118a108"});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 30rem;
  object-fit: cover;
  width: 50%;
  height: 41.3vh;
  margin: auto 0;
  border-radius: 9px;
  padding: 2.5rem;
  color: white;
  font-weight: 600;
  font-size: 2rem;
`;

const CollectionPostsLists = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  margin-left: 1.5rem;
`;
