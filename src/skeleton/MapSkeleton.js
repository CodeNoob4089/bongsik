import styled, { keyframes } from "styled-components";

const Loading = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const Skeleton = styled.div`
  height: ${(props) => props.height || "1rem"};
  width: ${(props) => props.width || "100%"};
  margin: ${(props) => props.margin || "0"};
  border-radius: ${(props) => props.radius || "4px"};
  background-image: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0);
  background-size: 200px;
  animation: ${Loading} 1.3s infinite linear;
`;

export default Skeleton;
