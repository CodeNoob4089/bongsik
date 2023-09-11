import styled from "styled-components";
export const CommunityPosting = styled.div`
  /* background-color: #bd6767; */
  /* height: 80vh;
  width: 60vw; */
  margin-bottom: 1.5rem;
  margin-left: 4.2em;
  border-radius: 0.3rem;
  display: flex;
`;
export const PostContainer = styled.div`
  height: 31.5vh;
  width: 60vw;
  border-radius: 0.7rem;
  background-color: white;
  display: flex;
  box-shadow: 2px 2px 2px #bbbbbb;
  cursor: pointer;
`;
export const PostImgBox = styled.div`
  /* background-color: black; */
  /* height: 54vh;
  width: 53vw; */
  display: flex;
  border-radius: 0.7rem;
  margin-top: 1.9rem;
  margin-left: 2.4rem;
`;
export const PostImgUrl = styled.img`
  /* background-color: #3511a3; */
  height: 22vh;
  width: 13.5vw;
  margin-top: 2rem;
  border-radius: 0.7rem;
  display: block;
  margin: 0 auto;
  object-fit: cover;
`;
export const PostContent = styled.div`
  /* background-color: #5e44ad; */
  width: 20vw;
  margin-top: 3.3rem;
  margin-left: 1.7rem;
  h2 {
    font-weight: bold;
    font-size: 1.1rem;
    color: #2d2d30;
  }
  p {
    margin-top: 1rem;
  }
  hr {
    margin-top: 1.2rem;
  }
`;
export const PostBottomBar = styled.div`
  /* background-color: #1f961f; */
  margin-top: 1rem;
`;
export const ButtonSet = styled.div`
  display: flex;
`;
export const Button = styled.button`
  max-width: 8vw;
  max-height: 5vh;
  border: none;
  font-size: 1rem;
  margin-left: 2.5rem;
  background-color: transparent;
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
  z-index: 50;
  height: 100vh;
  overflow-y: auto;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  width: 50vw;
  height: 95vh;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 100;
  object-fit: cover;

  h2 {
    margin-bottom: 10px;
    text-align: center;
  }

  img {
    width: 40vw;
    height: 23.75rem;
    margin-bottom: 10px;
    margin: auto;
    display: block;
    border-radius: 0.35rem;
  }
`;
export const SubmitButton = styled.button`
  color: white;
  font-weight: bold;
  background-color: #ff4e50;
  width: 3rem;
  height: 2.3rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 0.2rem;
  margin: 0.7rem;
`;
export const InputBox = styled.input`
  font-weight: bold;
  text-align: center;
  width: 30rem;
  height: 2.3rem;
  border-radius: 10px;
  background-color: #f2f2f5;
  border: none;
  float: left;
  margin-top: 0.8rem;
`;
export const Form = styled.form`
  text-align: center;
`;
export const CommentWrap = styled.div`
  color: black;
  margin-top: 1rem;
  width: 45vw;
  height: auto;
  border-radius: 10px;
`;
export const Like = styled.button`
  cursor: pointer;
  margin-top: 0.2rem;
  background-color: transparent;
  border: none;
  margin-right: 0.2rem;
  color: ${(props) => (props.isLiked ? "red" : "black")};
`;
export const LikeCount = styled.div`
  width: 0.6rem;
  margin-top: 0.2rem;
  margin-right: 0.1rem;
  color: #7c7c89;
`;
export const CommentButton = styled.button`
  color: #7c7c89;
  font-size: 0.8rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition-duration: 0.3s;
  &:hover {
    color: #ff4e50;
  }
`;
export const CloseButton = styled.button`
  color: black;
  font-size: 1rem;
  width: 3rem;
  height: 2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  float: right;
`;
export const CommentInput = styled.input`
  font-weight: bold;
  text-align: center;
  height: 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: #f2f2f5;
  margin-top: 1rem;
  margin-left: 1rem;
`;
export const ContentArea = styled.div`
  max-width: 40vw;
  height: auto;
  margin-left: 2.8rem;
  margin-bottom: 1rem;
  margin-top: 1rem;

  hr {
    margin-top: 2rem;
  }
`;
export const UserInfo = styled.div`
  background-color: white;
  border-radius: 10px;
  margin-left: 2.8rem;
  margin-bottom: 1.5rem;
  flex-direction: column;
`;

export const UserProfile = styled.div`
  flex-direction: row;
  display: flex;
`;
export const UserNameAndLevel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 63%;
`;

export const Nickname = styled.p`
  margin-left: 15px;
  margin-top: 5px;
  font-size: 1rem;
  p {
    color: #7c7c89;
    font-size: 0.9rem;
  }
`;

export const ProfileCircle = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 70%; /*둥그런 원으로 만들기 위함*/
  overflow: hidden;
  text-align: center;
  line-height: center;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-position: center center;
  background-size: 3rem;
  margin: 0 auto;
`;
export const ModalLocation = styled.div`
  width: 40vw;
  height: 5rem;
  background-color: #f2f2f5;
  border-radius: 0.35rem;
  /* display: block; */
  margin-bottom: 3rem;
  margin-left: 2.8rem;
  p {
    margin-left: 1rem;
    margin-top: 1rem;
    line-height: 1.5rem;
    text-align: center;
    float: left;
  }
`;

export const InputArea = styled.div`
  display: flex;
`;
export const DetailLocation = styled.span`
  color: #5a5a68;
  font-size: 0.9rem;
  float: left;
  margin-left: 0.2rem;
`;
export const Place = styled.div`
  float: left;
`;
