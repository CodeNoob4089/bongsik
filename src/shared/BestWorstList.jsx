import styled from "styled-components";

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.7rem 0 1.7rem 1.7rem;
  width: 32.36vw;
  height: 57.5vh;
  background-color: white;
  border-radius: 7px;
  box-shadow: 1px 1px 1px #e7e7e7;
`;
export const ListTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  width: 100%;
  margin-bottom: 1.7rem;
`;

export const PostsContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`

export const PostCard = styled.div`
 width: 100%;
 display: flex;
 flex-direction: row;
 align-items: center;
 
`;
export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.8rem;
`;
export const ImageBox = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 10px;
  margin: 0.7rem 0.7rem;
  object-fit: cover;
`;
export const Star = styled.div`
  display: flex;
  margin-bottom: 5.5rem;
`;
export const PostTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 600;
`;

export const PostDescription = styled.p`
  font-size: 0.8rem;
`
export const NoBestWorstPost = styled.div`
  height: 100%;
  background-color: #ff4e5117;
  border: 1.5px dotted #ff4e50;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
`