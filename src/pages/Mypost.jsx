//마이포스트
import React from "react";
import styled from "styled-components";
import useAuthStore from "../store/auth";
import { getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { collection } from "firebase/firestore";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen, faHeart, faRectangleList } from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
function Mypost() {
  const user = useAuthStore((state) => state.user);

  const getPosts = async () => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
  };
  const { data: postData } = useQuery(`fetchPostData`, getPosts);
  console.log("postData",postData);

  const [currentCategory, setCurrentCategory] = useState("맛집")
  const categories = ["맛집", "술집", "카페"]

  console.log("여기에유!!!!!!!!!!");

  const categoryButtonClickHandler = (category) => {
    setCurrentCategory(category)
    console.log(category, currentCategory)
  }
  //로그인한 유저 상태확인해서 그걸로 그 유저가 작성한 글만 가져와야함
  return (
    <PostCardsContainer>
      <MyPostsTitle>
        <PostTitle><FontAwesomeIcon icon={faRectangleList}/> 나의 기록 <span style={{color: "#D0D0DE" }}>{postData?.length}</span></PostTitle>
        {categories.map((category) => 
        <CategoryButton onClick={() => categoryButtonClickHandler(category)} id={category} currentCategory={currentCategory}>{category}</CategoryButton>
        )}
      </MyPostsTitle>
      {postData?.filter((post)=> post.category === currentCategory).map((post) => (
        <PostCard key={post.postID}>
          <TimeLine>
            <Circle/>
            <Line/>
          </TimeLine>
          <Post>
          <Date>{post.timestamp?.toDate().toLocaleDateString()}</Date>
          <ImageAndContents>
          <PostImage src={post.photo?post.photo:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUWFRgWFhUYGBgYGRgYGBUYGBgYGBgVGBgZGRgVGBgcIS4lHB4rIRgYJjgmLC8xNTU1GiQ7QDs0Pzw0NTEBDAwMEA8QGBIRHDEhGB4xMTExMTExNDQxNDE0ND8xNDE0NDQ0PzQ0NDQ/MTQ0MTExPzExMTQ0NDE0MTExMTExMf/AABEIAOAA4QMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAADBAIFAAEGBwj/xAA4EAACAQMDAwMDAgQEBgMAAAABAgADBBESITEFQVEGE2EicYEykRQVQrFSocHRByMkcvDxU2Kz/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAIBEBAQEBAAICAwEBAAAAAAAAAAERAhIhAzETIkFxBP/aAAwDAQACEQMRAD8AM1YGKXNwOBKype9piPmc9jvphmidcRkQFXmS5+yTLNFMcCTM0W2kyucIUs7xu3tGbAA3MDTUnjvPSvSVovtqXUh12z8eZpzNpz252w9J1zuy4Hn4nWdM6AqDBH3zg5M6BBCgCbTmRWK+36einZcR1KcJkSWZUNipMmZkWaIJqZsiDE3qhp42rQjwazbtDRiLrmVfVKTBCKa/UeP95aZkWgTil6Tc5yzDcbDvqPOfgSk9QdSe3bQMt5+Np6awnH+tbBWTOBnOf/BFYTzi/vnqbsJVtTJaX9WwOBtzsPxzFxbYaZW0g3pAJkjcwfSroU6wY8R2rwB4idxb7qQOd8/naLnoa7i29QJpx3zHf53SOn6pwCU2yPiDuQdUfmUr0r+aUv8AF/mJueZ6D5/zmQ84ZejULGW9EbSus7fG8tEEVdk+hEMhUTeSTmbc9hItYd0lXg0TUcR00AeZedA9OGp9TfSvnO8Oeb1fTA/6Y6FTwGdCzc5bgfYTtbeiqjYY+0X6faCkgVSTjueY2HnTJkXIMpmFoItIa4WqH1TZeLF5JWi08FzN5g9U2Gi0YKJsSCtNho9GJkSUgGkyIaMRmETc3mOUUIiI39trwCuR3PiWU1iNLkOq+my4UJwoIIGxJJzOV6z0apS3KNjHOMr+4nqdxVKjZSx8CKLTd1IqIAp/pO8nrnSx5Va2LP8AUdl7seP/AHCdTpqMKo/SBknn7TvL/oyMAqMFCngDE5bq3Qa5ZiFGnsM842mfXOT0mubZ4EHJjlxZsuzDB8QC08TL2TNEya1zURJIuIdDAsIxbpNdd9voVRNKMGEQRinbljgczK+7kcvfW0bplrqbDKSD3HIPmd3YUdAC52HaVXSbQoPJ8y5Rp08c+MKQzmQLQL1YIHPeVaqQ21QSCNkwYWaaqBtkZ5x3xJtPDMkpiXuEmG9zyItUOGktUWFWS9yAMhpIGLq8kHgDCNJhsQCyWY5SH1SOqDJig6lR9wUfcT3CCRT1DXgcnTzGD6yeYDVCqZSWyYvUGdskfaHMC6Qwgiqgefkyg63dNpIDooHg5aWt7q448zlur3qIdOrJ8BQf3J2zJ6vounL31TJz37nz8xFWOTLG+uA5yF04HxufO0QxOXrpkjn4mobSJkjaMFVBzCJvJInmaEfXf8bdd/yD0m8y36cUYgacsf6h/rOdLlROk9PKew3I/YS/im1ErqaS6RCFz4itJiOZupUPmdVrSRlRzNoNsmKl2zzGmcESVJ02zPKPUnqi5S8uBTYBKTfpOkZChVJGRknPgz0xbjHach6q9FJcs1amxSo2Cw5VmA5x/tHLCspHpn/EonGum+BywKv+SoAP7TtOi+pKFyfodSf8Od/nKncTxPqHpy5ondCwH9SZYfkDdfyIha39Sm6ujFXQ5Vu/2PkR+MqdsfShxJKZzXprry3VIOD9QADjcYbAz/nmXXuTOtIeB3+JMMBE/d22xCJUXSCYA1TfMjfdTpUVLVKiIBuS7Af3lbeXwQEjJ+3M+eusVHes5ZmYl2wXJLYLHHJl8wurjufWn/EmpVY0rRilMZBqjao//af6V/zM530DUf8AmNu31ElyGO5JDKwOo9+Yv0n03Vq4JQqDwW2z+Of2H7T1z0d6dpWwDYBf/F3z4+B8D8kx2yIktuuxzCo8XAzCrFF0yIN2M0rSYEpNUHX61QIdO3zjJx8GecXLEsd/vmew3KnScqGGNxOD6xYWzFihZG3+kgkH7TH5ObYjqOZTeQYSSUyhIP4M3UTInNYjC+qZJe0ZkRDrV1bCFdcTVugEtun2Ws/VxDnnyuKxnSunK/OTjk9hOqtrdUXC/vIUUVFwBgSb1ABk89hO3nmcxc5aLgGK1rgZgHrHJmkQYLR2rgnvDvDa4iF7n9ocITv5kKTVwTiSepjYSKgASr6tehEJ+IYGX97TX9en84lLU6bZVmyaahs5yp0Nnztz+Zx99cu7lnbk7DOwEjq0YZWwe280kuIten9KopSXQn6c57Zz84EtqNXM4Lp3U3+kNye87Ho+XxjJPmTY0n0thbZGxxI06D8R+jZEcmESxOc6j9osOKi4TA3E5u/saAOsoMj5P38ztL+mVQ4GfvOE69WOG22HJ8yixUXHX0pthVG3ZRwJb9G9VI5AJwfB2nB1qgHYkk7n/SSo6WIIGMbx3nIjfb2+0uwwG8eDzjfT1csin/zadLRfaRqrFgrxqk0rA0NScypSsPu2JVdW6UtRSR9LeR3j+vMwMRHU48y6haMpwRwYkF4nceobFTl+PxmcXX+kmcvyc5WXU9s0rMgd5kz2EPRpEnYZzOlsaARRtuRuf9JUdKtGJDEcbjO2T2l5b0WA+o5M6Ph4z3V8z+jo8FWbOcwrU8RS5ft5m1XClV41bNqXAi1an28f3humrgfcmRFsXc/aMCqMYkKyaT94u3eICXFfAwJQ9Rps6mWwp5ML/DDuIg8ovKbKSG7QdtSydlzvPSb3oCOcjH2jnS/TKY3Az2yJrOixylmmplBGAMCelen7cIgwMZm7LoFNOVBlvQtlGwGBErZmCKsOoEiqTVQ7Sk6g4DbdpznXvTwdThvxidFTqgxjAMD3Hilz6QrFsIhOTsJuj6OuQwV1AHgbme1qg7CQeiOwipON6f0001C4wAOJa06RHYy1W0OcyS0FHI3k+J+St0/M2rsN+0fNNTINSxDxGl1uYyj+YjXTDRq2OR8iLfZYPVpqwKkZBGJ5/wCo+mGmxKj6f7H/AGnoays6zaa1JAyQMY7EdwYdc+UR1PTy7WZk6P8Alw/+L/OZMPx1nlXltYBByT9zGAoA4jLJ8gRS5Yeczq+mkgdVxK47vnxDOpmImO2TFavAnTY/M1bHG3iFqiLgED7mTBVhc40gxB03hRU4gzuSYqIPQAMZShn4Hkxa35/vLClhvsI4dEs6CIMk6j9toylXUd8CKuwE0lTeVKmrZXXEVuOoKODE6tyAOZT3d0ee0NGOhp9RCjLNtFq3qKmdtQnmfW+tMWIBIA+ZSfzP/wC0qQrXqrdeQHOqWVl15X4OZ4weonu0teidZ0uMHkwsGvaaN6DD+7mcraVywBG0taFyRycydNaJUMmX8xRawxmRNUGPQaZhIBswO8ilQZ3jFD6gn05HIgbG6B55jtXcSmZMN+Zn16OOhpVAe8jWp/mIUGI8x2ncfEqUqW9oeJkd1CZHiVE7Rdhk7fvNByftGaUV9qiBobQJp4jjN4gmXmFMuxHYbxG6OTiOOdieJX133zJCdNMgQyUSTB2riPJUAGBDAnRpooxjMbSlkeBEqLZO8nVu/qx2lQGWpASvr1MHaGqV9pU3FffA5k0ha9fESuXJUzGcDnmQd8jEUvs3nPW0IcynCkTtOuWYJJHM5K5Rgd8zWfSLEDk8RzpVs+te28QTOdp1vpyzOQz5hfoR3vTiVRftLBbnzK+iRiTqNtM60WtO6BGJJapB+JR03jK1+0UpOiSuCNoCtWPxK1Kh7TBVYmXCq0RziKtUIaYK0CagLRdCLOlcjG4jCOvaV6DIkqb4MUOrHX9pkT92ZL1KiFSM06mBv3iXEzWTgkxGsxWAEBWux/TEamcZ7QaiLThqs50Z8mVLtktntxLW5Oyr43lJ1Gpo37d4sBi2cgyyR9pQ0LjOCDG1uTxmMlqKgH3MXr18DMEHyIndVYwbqXX05iH8RF69xkYitKrM7QaevvINdCJXVTEU0O/EU+zFurtTKe7AO+0aq9MqHgxap0qqZrymwpaIobM6O2rheJVUOivmXFt0Yjkx0YtKV9tzJC/8xJ7EgZBgUQg7zHrVrqjcZMZFWVNF8RhHhyS9RtszervEraseIzXqhVM0n0kKr1EcZkravk7znLlyXyDtmXFhVHeTacdPakY5hLtdsiAtWGMydV9sGVDL+9MgtImRkpq1ycZ7Rqg4Kj7SgoXWsKv7yxFzpAAj6ln2mXT9aqAn5i4qHOO/eJV7rP7xm13Go95KzAYnOYl1JBoOY6XA2iXU32AEAprSqf04jivK9NiZB7vwYoS7e5wNoqauYklUtMBxGQtcRXVGnbaAQSbDRWlqO/EbUAbCC9zHEH7kQ0/r7SS4iSPCipK0HFMKKkSWpMNXeGjT4YGSWmrbRJHMYFTEQ0rXolTN0lIjWNUWZ+YsGnrZ5Hql0FQjuYClU22iV8+v8R3rE6DTfMsbZpV0eZZUNpM9qXVpeMoljTuNU5xa+NuY/bViJpKNW2iZE/4r5mR7C2OBtapBEtxW1Cc+tTiN0q5nV3x5f6w56xbooG5k3uiBgRFKpIzINUnL1JLjadSrJLvH37wdeuScmJrUEjc1e0WHpW5YsdjFWXEcTaAYZMchGbF4yYigI4hqdQ43EAOzzSmLu8wVMRAV2gQ03qmsCRQKHk1MBphqREDFQmTSRQEGHJBhAYKbCaaRpvtIu2TiPAItbAMQdyTJ1R2mkSKlg1qTkY8wt5QKnV/SfEy0pkmXd1QRqOMbqNorNhVza08xhAYqqnsfxN62HczL8mF5HlqKvMDUvj2EXZtoBKnxxM+vl6v0m9WnPfeZAfxPxMi/J0WqBEh6UgnBk6Q2nvYzN0nxCUl1NxxFlbaWFBxoz3nB/wBXOftF81FUy20b/l64zmCsgCwG+8snYYxM/i2za1lUlxSwYuUlnUUQLUprYuExDqRiY1IzYpxDEXpZETemRH9OBF2QxFgIEE6GMaZL24jKgtDUwRDpThlpRYMCp1Gj1M7bwKpCoI5BguuETMgqxhFgMACDMmlKHSlvDKkWG3bLiWaUyykdiIjTSWNIYErCscjc0nRyCO/E0m5wZa9bJDLnGSCR5x8yoL7E9zxOLuZ1jCh1ny2BJgADfvBoCGBIhQmScyBiOlPEySyJkeBRipJod4uLgfEKHyPxPfZjoY3ZHfHmV6PLDp6FnGATMfm58ubD5+1z0y3xkn8QtwozHaNHAxFLlBvic3PPjMdEnoi6zQSbuq2jQNLMzsERUGSzEE4H7Ra6NcMi+09JWdFepURTpVzoVghcFvqIzjtmVfZ6m9M+ZipFri4dHZHanlK1Si1V2anSzTJAZjhimrG2ds94zSp12qpRBtdbojopr1BrWopZWX/l77KSfHeTlF6iTBYBkkrW5DUfeYaFCszf1YCkgkY5G2YP27t6bMlvv9WmmyVxUIzhWA0aGyMN+oc4hmnsRKwtFPpyYCorU2RXYv7lNHQCnocO7sntMmphqBU75mVbhtBADIyOqVQ6ZemNsnQWGTuO/EMpbDKjEKEgdbJVei4NR6dRqY9qmxLhUVtQQEkbN5Mx6ddicIaKKaeWqo/uFXcUw9OmdIZQ7KD9QPxDxo8oYROT4hadLbMhaF/+Yj6WalUekzICA2g416STj94m3WiMjNBcMwCO9c1NIOzlUpNsRuCDiPD8os1pxinSlW/VjTdBUCEPSStTaizsWWo+hF0uqnJO8P1G/r06buttVUqCdVRUVQF3Y4Lgtgb4EXjR5RaJT5hUSV/Tbly7I7q49qjWRwhpkpWUsFZNTYIx2PeMUOqhwGWhcOG/Qy0WKv8A9p7wwbFjSSGZDxOc6T1KuzUWcrprVK9JqZplHpPRGSNWtgw7cCdUuI8KXVP6jRSqv3zj8Tm2TPPE6nq9tlS2dhuB/rObbecny8/trLqewzU30qOBB1Ce3JjFHCod/qP9oJX8cZ3+0y9b6LQfYeZDfzBJkeUOdNi43xN6SO2J0lSjEntsz1efkadfFhK2TUQAO87XpNroQfTg/beU3RenfVq4nUINoddaXPOfYdUxCsseeL19pnVxSdaqJ7YRwmXOhS+NCnBJdyeFUAt52wN4ldNQqG2066fsG3pW4qqCtxRFZC1RDjNOrklip5Uj5l7Upq36lBHOCM7j7wV3QDqVyVOzKwwSrqQysB3wQDEV50l1SkHuLlkoDT71wjqlepSd21/rctrQ8cBRsYU1VVre4S3PvFqtuqm4YU0W1pe0rKQmSdLtyOTD2tsUU5cuzu7u5ABZ3YsxwONzxAJZlXDl2KqXZEONKPV062G2STpHPGTFo8QLe39ilVZ1C0gMrRV2q6EC4ZdbAEgnfB4jNpa6LUe8iU9FN1NCq1qBde4X0VhWd9SBBp2HGkaYdmJHx3iVLp9FDlaSAnuEGYToXkn1q0Bo21NUR6iWdNveSq5BVarnQir9LZwdzCdTuKNSrWdbgmnWqB2VbWuXUYRcFn0IP087w1vaFNy5fSi00BAGimrMwTbndzv9oa8p6kKEn6hjPcfMNKc0l6koJVvK2BTo6K9RWqa6gLfQparUJfSoVW4UAk4EfsL3U1Rgn/TpRtaVuj6gTTS6pr7rKCCGZiW58ZkKNipBNXFR3c1Hd1XdzgZC8DYD9oa/sS+CruhGn9GMNocOgYEHIDKpx8R6fiWqUi9W7XJAa5rqceC2IPpdrTx7lW3oNTVqlLCWlBQzoCqsaj1B9WcMVwOPBzHrS0ZAzM+tnd3d8Yy7nJwo4EnUsGbOio6KzBmQLTdC4AXXpdGAbAAyMcRaLz6UPW93Wi9ShWRKdu6aKNCmSxOhLdnVmCIvDfVjGYW8aiLemi6VW3Ws9OpUX/p7uq4zWCAkFGBGKbHIIEtKfTNT66jtVYKUGtUChMgkaUVQdwOfEs2oAjSwyOMY2+IaU5J9EUe4M8/wXT//AMmilyiGpbpioDa3FWqUS3dwyVKqVFKuMKM4Yd+TLPpXTvayWcudKICQBpp0l0Im3OB375ltTMXl7V4+nKNQNSjSp+2uurd3xV6nuI9IsA+oKjA6sEbEztLaiUREZy7KiqztyxAALH5Mrx0cLXFY1GKqXZKWAFV6iqrtq5OyDbtky0Zto7S5mIVKeoHIyPE5C/xrONgPidrTO857rtppfWB9Lc+MzD5pvJdOersAmRzx+ZrBCY894a4p6gFA7wt0gGAeBvObmMlZ/BD5/eZLD3Um5Qf/2Q=="} />
          <PostContents>
          
          <PostTitle>{post.place.place_name}</PostTitle>
          {post.isPublic?
          <IsPublic><FontAwesomeIcon icon={faLockOpen} style={{ color: "gray" }} /> 공개</IsPublic>:
          <IsPublic><FontAwesomeIcon icon={faLock} style={{ color: "gray" }} /> 비공개</IsPublic>}
          {/* <PostContent>{post.content}</PostContent> */}
          <LikesCount><FontAwesomeIcon icon={faHeart} style={{color: "gray"}} />&nbsp;{post.likeCount}</LikesCount>
          </PostContents>
          </ImageAndContents>
          </Post>
        </PostCard>
      ))}
    </PostCardsContainer>
  );
  //map함수를 쓰는 이유 : 대량 데이터를 처리하기 위함
}

export default Mypost;

// 스타일컴포넌트
const PostCardsContainer = styled.div`
  margin: 5vh auto;
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 100%;
  border-radius: 18px;
  background-color: white;
  overflow-y: scroll;
  // flex-basis: 100px;
`;

const MyPostsTitle = styled.div`
  width: 100%;
  padding: 2rem;
  /* background-color: green; */
`
const CategoryButton = styled.button`
  margin-top: 2rem;
  margin-right: 1rem;
  font-weight: bold;
  width: 5rem;
  height: 2.5rem;
  border: 1px solid #D0D0DE;
  border-radius: 10px;
  color: ${(props) => props.id === props.currentCategory? "white" : "gray"};
  background-color: ${(props) => props.id === props.currentCategory? "#FF4E50" : "white"};
  cursor: pointer;
`

const PostCard = styled.div`
  width: 100%;
  height: 20rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Post = styled.div`
  height: 100%;
`
const Date = styled. div`
  height: 30px;
  line-height: 30px;
  color: gray;
  font-size: 20px;
  
`
const ImageAndContents = styled. div`
  display: flex;
  flex-direction: row;
  padding-top: 10px;
  margin-bottom: 10rem;
  height: 12rem;
`

const TimeLine = styled.div`
  width: 4rem;
  margin-left: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Circle = styled. div`
  width: 23px;
  height: 23px;
  background-color: #D0D0DE;
  border-radius: 50%;
`
const Line = styled.div`
  width: 3px;
  height: 100%;
  background-color: #D0D0DE;
`

const PostTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
`;


const IsPublic = styled.div`
  color: gray;
  font-size: 17px;
`

const PostImage = styled.img`
  width: 20rem;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
`;

const PostContents = styled. div`
  padding: 15px;
  line-height: 2rem;
`
const LikesCount = styled. div`
  margin-top: 2.5rem;
  color: gray;
  font-size: 18px;
`