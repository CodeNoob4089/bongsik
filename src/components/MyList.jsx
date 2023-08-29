import { arrayUnion, deleteDoc, doc, query, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState, useClickOutside } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import useAuthStore from "../store/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { nanoid } from "nanoid";
import { getMyTags } from "../api/collection";

const GET_MY_TAGS = 'getMyTags'

function MyList() {
const queryClient = useQueryClient();
const user = useAuthStore((state) => state.user)


const addImageInput = React.useRef(null);
const [addActive, setAddActive] = useState(false);
const [collectionInput, setCollectionInput] = useState({
  coverImage: "",
  title: "",
  collectionID: nanoid(),
})

const { data : myTags } = useQuery(GET_MY_TAGS, getMyTags)

const mutation = useMutation(async() => {
  const usersRef = doc(db, "users", user.uid);
  await updateDoc(usersRef, { myTags: arrayUnion(collectionInput)})
},{ onSuccess: () => {
    queryClient.invalidateQueries(GET_MY_TAGS)
  }
});


const addMyCollection = () => {
  if(!auth.currentUser){
    alert("로그인 후 이용해주세요!")
  } else {setAddActive(true)}
}
const onImageUploadButtonClick = () => {
  addImageInput.current.click();
}

const onSelectImage = async(e)=> {
  const image = e.target.files[0];
    if (image !== undefined) {
      const imageRef = ref(storage, `${auth.currentUser.email}/${image.name}`);
      await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(imageRef);
      console.log(downloadURL);
      setCollectionInput({ ...collectionInput, coverImage: downloadURL });
    }
}

const onSubmit = async(e) => {
  e.preventDefault();
  if(collectionInput.title === ""){
    alert("컬렉션 제목을 입력해주세요!")
  }else{
  mutation.mutate();
  setCollectionInput({
  coverImage: "",
  title: "",
  collectionID: nanoid(),
  })
  setAddActive(false)
}
}


const onDeleteButtonClick = async(key) => {
  if(window.confirm("컬렉션을 삭제하시겠습니까?")){
    const usersRef = doc(db, "users", user.uid);
    await updateDoc(usersRef, {
      myTags: myTags.filter((tag) => tag.collectionID !== key),
    });
    alert("컬렉션이 삭제되었습니다!")
  } else return
 
}

  return (
    <>
    <ListCardsContainer>
      <ListTop>
      <ListTitle>나의 리스트</ListTitle>
      <AddButton onClick={addMyCollection}>+</AddButton>
      </ListTop>
      {addActive?
      <ListCard>
        <NewCollectionCover img={collectionInput.coverImage}></NewCollectionCover>
        <NewCollectionForm
         onSubmit={onSubmit}
        >
          <CollectionTitleInput
          placeholder="컬렉션 제목"
          value={collectionInput.title}
          onChange={(e) => {
            setCollectionInput({... collectionInput, title: e.target.value})
          }}
          />
          <input
          type="file"
          style={{display: "none"}}
          ref={addImageInput}
          onChange={onSelectImage}
          />
          <ImageUploadButton type="button" onClick={onImageUploadButtonClick}>커버 이미지 선택</ImageUploadButton>  
        </NewCollectionForm>
      </ListCard>
      : null}
      {myTags?.map((tag) => 
        <ListCard key={tag.collectionID}>
        <ImageBox img={tag.coverImage}></ImageBox>
          <CardTitle>{tag.title}
          <ButtonBox>
          <ToggleButton>▼</ToggleButton>
          <DeleteButton onClick={() => onDeleteButtonClick(tag.collectionID)}>
          <FontAwesomeIcon icon={faTrashCan} />
          </DeleteButton>
          </ButtonBox>
          </CardTitle>
          {/* <CardContent>카드 내용</CardContent> */}
      </ListCard>
      )}
    </ListCardsContainer>
    </>
  );
}

export default MyList;

const ListCardsContainer = styled.div`
  width: 23vw;
  height: auto;
  margin: 5vh auto;
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  overflow-y: scroll;
`;

const ListTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const ListTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: gray;
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
  background-image: url(${(props) => props.img});
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
`

const ToggleButton = styled.button`
  font-size: 18px;
  width: 30px;
  margin-left: 15px;
  border: none;
  background-color: white;
  color: gray;
  cursor: pointer;
`

const DeleteButton = styled.button`
  font-size: 14px;
  width: 30px;
  margin-left: 15px;
  border: none;
  background-color: white;
  color: gray;
  cursor: pointer;
`

const AddButton = styled.button`
  font-weight: bold;
  font-size: 15px;
  padding: 10px 15px;
  background-color: #FF4E50;
  color: white;
  border: none;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  &:hover {
    background-color:  #ff7337;
  }
`
const NewCollectionCover = styled.div`
  width: 80px;
  height: 80px;
  background-color: #c8c8c8;
  border-radius: 15px;
  background-image: url(${(props) => props.img});
`

const NewCollectionForm = styled.form`
  padding: 10px;
  width: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const CollectionTitleInput = styled.input`
  text-align: center;
  width: 80%;
  height: 30px;
  border: 1px solid #c8c8c8;
  border-radius: 10px;
`

const ImageUploadButton = styled.button`
  width: 80%;
  height: 30px;
  margin-top: 5px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: gray;
`