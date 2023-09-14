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

const GET_MY_TAGS = "getMyTags";

function MyPageList() {
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

  const { data: myTags } = useQuery(GET_MY_TAGS, getMyTags);
  const { data: postData } = useQuery(`fetchPostData`, getPosts);

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
  };

  const onDeleteButtonClick = (key) => {
    if (window.confirm("컬렉션을 삭제하시겠습니까?")) {
      deleteMutation.mutate(key);
      alert("컬렉션이 삭제되었습니다!");
    } else {
      return;
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


  return (
    <ListCardsContainer>
      <ListTop>
        <ListTitle>나의 리스트</ListTitle>
        {addActive ? (
          <AddButton onClick={() => setAddActive(false)}>--</AddButton>
        ) : (
          <AddButton onClick={addMyCollection}>+</AddButton>
        )}
      </ListTop>
      {addActive ? (
        <ListCard>
          <NewCollectionCover img={collectionInput.coverImage}
          onClick={onImageUploadButtonClick}>
            {collectionInput.coverImage? null : "+"}
          </NewCollectionCover>
          <NewCollectionForm onSubmit={onSubmit}>
            <CollectionTitleInput
              placeholder="컬렉션 제목"
              value={collectionInput.title}
              onChange={(e) => {
                setCollectionInput({ ...collectionInput, title: e.target.value });
              }}
            />
            <input type="file" style={{ display: "none" }} ref={addImageInput} onChange={onSelectImage} />
            <CollectionListButtonBox>
            <CollectionButton  type="button" onClick={onCancel}>
              취소
            </CollectionButton>
            <CollectionButton>
              확인
            </CollectionButton>
            </CollectionListButtonBox>
          </NewCollectionForm>
        </ListCard>
      ) : null}
      <CardsBox addActive={addActive}>
        {myTags?.map((tag) => (
          <>
            <ListCard key={tag.collectionID}>
              <ImageBox img={tag.coverImage}></ImageBox>
              <CardTitle>
                {tag.title}
                <ButtonBox>
                  {toggleOpen !== tag.collectionID ? (
                    <ToggleButton onClick={() => onToggleOpenButtonClick(tag.collectionID)}>▼</ToggleButton>
                  ) : (
                    <ToggleButton onClick={() => setToggleOpen("")}>▲</ToggleButton>
                  )}
                  <DeleteButton onClick={() => onDeleteButtonClick(tag.collectionID)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </DeleteButton>
                </ButtonBox>
              </CardTitle>
            </ListCard>
            {toggleOpen === tag.collectionID ? (
              <PostLists>
                {postData?.filter((post) => post.collectionTag === tag.collectionID).length !== 0?
                  postData?.filter((post) => post.collectionTag === tag.collectionID).map((p) => (
                    <CollectedPosts key={p.postID}>
                      <ImageBox img={p.photo}></ImageBox>
                      <TextBox>
                        <p>{p.place.place_name}</p>
                      </TextBox>
                    </CollectedPosts>
                  ))
                : <div>아직 컬렉션에 글이 없어요!</div>
                }
              </PostLists>
            ) : null}
          </>
        ))}
      </CardsBox>
    </ListCardsContainer>
  );
}

export default MyPageList;

const ListCardsContainer = styled.div`
  width: 29.75vw;
  height: 70vh;
  margin: 5vh 4vw 5vh 0vw;
  background-color: white;
  border-radius: 10px;
  box-shadow: 1px 1px 1px 1px #e7e7e7;
  padding: 2rem;
`;

const CardsBox = styled.div`
  width: 100%;
  height: 90%;
  overflow-y: scroll;
`;

const ListTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 5vh;
`;

const ListTitle = styled.h1`
  font-size: 1.3rem;
  font-weight: bold;
  color: #2d2d30;
`;

const ListCard = styled.div`
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px dotted #c8c8c8;
`;
const ImageBox = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 15px;
  background-image: url(${(props) =>
    props.img
      ? props.img
      : "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%8A%A4%ED%8C%8C%EA%B2%8C%ED%8B%B0%20ETG.png?alt=media&token=a16fadeb-f562-4c12-ad73-c4cc1118a108"});
  background-size: 5rem;
  box-shadow: 1px 1px 1px #c8c8c8;
`;

const TextBox = styled.div`
  font-size: 1rem;
  display: flex;
  flex-direction: column;
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
  flex-direction: row;
  justify-content: space-between;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const ToggleButton = styled.button`
  font-size: 1rem;
  width: 3rem;
  margin-left: 1rem;
  border: none;
  background-color: white;
  color: gray;
  cursor: pointer;
`;
const PostLists = styled.div`
  background-color: #ff4e5117;
  border-radius: 10px;
  height: auto;
  min-height: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CollectedPosts = styled.div`
  display: flex;
  padding: 0.2rem;
  width: 100%;
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
  width: 2.3rem;
  height: 2.3rem;
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
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #ff4e50;
  width: 5rem;
  height: 5rem;
  background-color: #ff4e5117;
  border: 1.5px dotted #ff4e50;
  border-radius: 15px;
  background-image: url(${(props) => props.img});
  background-size: 5rem;
  cursor: pointer;
`;

const CollectionListButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
`

const NewCollectionForm = styled.form`
  padding: 0.5rem;
  width: calc(100% - 5rem);
  height: 
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
  border-radius: 10px;
`;

const CollectionButton = styled.button`
  width: 48%;
  height: 2rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: gray;
`;
