import { faFaceSadTear, faRoadBarrier } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

function Intro() {
  const navigate = useNavigate();
  return (
    <div style={{width:"100%", height:"100%", backgroundColor:"#95ddfb", display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
    <Button onClick={() => navigate("/main") }>시작하기</Button>
    <h1 style={{fontSize: "30px", fontWeight:"bold", marginTop:"3rem"}}>사이트 설명 추가중입니다. 이용에 불편을 드려 죄송합니다..!
    <br/>위 버튼을 눌러 사이트를 구경해보세요!</h1>
    <br/>
    <br/>
    <div>
    {/* <FontAwesomeIcon icon={faFaceSadTear} style={{color:"#a2ff55ff", fontSize: "3rem"}}/>
    <FontAwesomeIcon icon={faFaceSadTear} style={{color:"#479d57ff", fontSize: "3rem"}}/> */}
    <img src='https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%E1%84%8B%E1%85%AE%E1%84%82%E1%85%B3%E1%86%AB%E1%84%86%E1%85%A9%E1%84%8F%E1%85%A9%E1%84%8F%E1%85%A9.png?alt=media&token=15e7eb3e-70ec-49fe-b26c-92947515336c'/>
    </div>
    {/* <img src='https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EA%B3%B5%EC%82%AC%EC%A4%91.png?alt=media&token=421f8af2-36da-44ff-b20b-f18028689b66'/> */}
    </div>
  )
}

export default Intro

const Button = styled.button`
  font-size: 2rem;
  font-weight: bold;
  margin: 5rem;
  width: 20rem;
  height: 5rem;
  background-color: #fe4c4f;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition-duration: 0.5s;
  &:hover{
    background-color: #fdb9ba;
    color: white;
  }
`