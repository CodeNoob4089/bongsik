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

function MyList() {
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
      console.log(downloadURL);
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

  return (
    <ListCardsContainer>
      <ListTop>
        <ListTitle>나의 컬렉션 리스트</ListTitle>
        {addActive ? <AddButton onClick={() => setAddActive(false)}>--</AddButton> : <AddButton onClick={addMyCollection}>+</AddButton>}
      </ListTop>
      {addActive ? (
        <ListCard>
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
                  {toggleOpen !== tag.collectionID ? <ToggleButton onClick={() => onToggleOpenButtonClick(tag.collectionID)}>▼</ToggleButton> : <ToggleButton onClick={() => setToggleOpen("")}>▲</ToggleButton>}
                  <DeleteButton onClick={() => onDeleteButtonClick(tag.collectionID)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </DeleteButton>
                </ButtonBox>
              </CardTitle>
            </ListCard>
            {toggleOpen === tag.collectionID ? (
              <PostLists>
                {postData
                  ?.filter((post) => post.collectionTag === tag.collectionID)
                  .map((p) => (
                    <CollectedPosts key={p.postID}>
                      <ImageBox img={p.photo}></ImageBox>
                      <TextBox>
                        <h2>{p.place.place_name}</h2>
                      </TextBox>
                    </CollectedPosts>
                  ))}
              </PostLists>
            ) : null}
          </>
        ))}
      </CardsBox>
    </ListCardsContainer>
  );
}

export default MyList;

const ListCardsContainer = styled.div`
  width: 100%;
  height: auto;
  margin: 5vh 4vw 5vh 0vw;
  background-color: white;
  border-radius: 15px;
  padding: 20px;
`;

const CardsBox = styled.div`
  width: 100%;
  max-height: ${(props) => (props.addActive ? "calc(75vh - 140px)" : "calc(75vh - 40px)")};
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
  font-size: 18px;
  font-weight: bold;
  color: #c8c8c8;
`;

const ListCard = styled.div`
  display: flex;
  margin-top: 20px;
`;
const ImageBox = styled.div`
  width: 80px;
  height: 80px;
  background-color: #c8c8c8;
  border-radius: 15px;
  background-image: url(${(props) => props.img?props.img: "data:image/jpeg;base64,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"});
  background-size: 5rem;
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
`;

const CollectedPosts = styled.div`
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
