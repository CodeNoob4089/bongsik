import styled from "styled-components";

function MyList() {
  return (
    <ListCardsContainer>
      <ListTitle>List</ListTitle>
      <ListCard>
        <ImageBox></ImageBox>
        <TextBox>
          <CardTitle>카드 제목</CardTitle>
          <CardContent>카드 내용</CardContent>
        </TextBox>
      </ListCard>
      <ListCard>
        <ImageBox></ImageBox>
        <TextBox>
          <CardTitle>카드 제목</CardTitle>
          <CardContent>카드 내용</CardContent>
        </TextBox>
      </ListCard>
      <ListCard>
        <ImageBox></ImageBox>
        <TextBox>
          <CardTitle>카드 제목</CardTitle>
          <CardContent>카드 내용</CardContent>
        </TextBox>
      </ListCard>
    </ListCardsContainer>
  );
}

export default MyList;

const ListCardsContainer = styled.div`
  /* position: absolute; */
  width: 17vw;
  height: auto;
  margin: 5vh auto;
  /* top: 7vh; */
  /* right: 10vw; */
`;
const ListTitle = styled.h1`
  font-size: 40px;
`;

const ListCard = styled.div`
  display: flex;
  background-color: #c8c8c8;
  padding: 13px;
  margin-top: 20px;
`;
const ImageBox = styled.div`
  width: 100px;
  height: 100px;
  background-color: white;
`;
const TextBox = styled.div`
  padding: 10px;
  margin-left: 20px;
`;

const CardTitle = styled.h2`
  font-size: 20px;
`;

const CardContent = styled.p`
  position: absolute;
  margin-top: 20px;
`;
