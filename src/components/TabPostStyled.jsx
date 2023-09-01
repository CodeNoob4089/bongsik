import styled from "styled-components";
export const CommunityPosting = styled.div`
  background-color: #f3f1f1;
  height: 80vh;
  width: 60.5vw;
  margin-top: 0.8rem;
  border-radius: 0.3rem;
`;
export const PostImgBox = styled.div`
  background-color: #f3f1f1;
  height: 55vh;
  width: 56.5vw;
  display: flex;
  margin-left: 1.7rem;
  border-radius: 0.3rem;
  margin: 0 auto;
`;
export const PostImgUrl = styled.img`
  /* background-color: #3511a3; */
  height: 50vh;
  width: 48vw;
  margin-top: 1.5rem;
  margin-left: 3.2rem;
  border-radius: 0.35rem;
  display: block;
  margin: 0 auto;
  object-fit: cover;
`;
export const PostContent = styled.div`
  /* background-color: #5e44ad; */
  /* height: 8vh; */
  width: 48vw;
  margin-left: 6rem;
  p {
    margin-top: 0.5rem;
  }
`;
export const PostBottomBar = styled.div`
  /* background-color: #1f961f; */
  width: 48vw;
  margin-left: 5.5rem;
  margin-top: 1rem;
  /* display: flex;
  text-align: center;
  justify-content: center; */
`;
export const ButtonSet = styled.div`
  display: flex;
`;
export const Button = styled.button`
  max-width: 8vw;
  max-height: 5vh;
  border: none;
  font-size: 1rem;
  margin-left: 3rem;
  /* margin-right: 3rem; */
`;
export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  max-height: 100vh;
  overflow-y: auto; // 모달 스크롤 표시
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  width: 64vw;
  height: 100vh;
  overflow-y: auto;

  h2 {
    margin-bottom: 10px;
    text-align: center;
  }

  img {
    width: 60vw;
    height: 70vh;
    margin-bottom: 10px;
    margin: auto;
    display: block;
  }
`;
export const SubmitButton = styled.button`
  color: white;
  font-weight: bold;
  background-color: #ff4e50;
  width: 4rem;
  height: 2.3rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 1rem;
`;
export const InputBox = styled.input`
  color: black;
  font-weight: bold;
  text-align: center;
  width: 15rem;
  height: 2.3rem;
  border-radius: 10px;
`;
export const Form = styled.form`
  text-align: center;
`;
export const CommentWrap = styled.div`
  color: black;
  margin-top: 1rem;
  width: 60vw;
  height: auto;
  border-radius: 10px;
`;
export const Like = styled.span`
  padding: 0.5rem;
  border-radius: 100%;
  cursor: pointer;
  color: ${(props) => (props.isLiked ? "red" : "black")};
`;
export const LikeCount = styled.div`
  width: 0.6rem;
  margin-top: 0.6rem;
  margin-right: 0.3rem;
  color: #7c7c89;
`;
export const CommentButton = styled.button`
  color: white;
  font-weight: bold;
  background-color: #ff4e50;
  width: 3rem;
  height: 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 0.5rem;
`;
export const CloseButton = styled.button`
  color: white;
  font-weight: bold;
  background-color: #ff4e50;
  width: 3rem;
  height: 2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 26rem;
  margin-top: 1rem;
`;
export const CommentInput = styled.input`
  color: black;
  font-weight: bold;
  text-align: center;
  width: 15rem;
  height: 1.5rem;
  border-radius: 10px;
`;
export const ContentArea = styled.div`
  max-width: 60vw;
  height: auto;
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
  margin-top: 0.3rem;
`;
