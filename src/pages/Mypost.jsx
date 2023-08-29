import React from "react";
import useAuthStore from "../store/auth";
import { getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { collection } from "firebase/firestore";
import { useQuery } from "react-query";

function Mypost() {
  const user = useAuthStore((state) => state.user);
  console.log(user.uid);

  const getPosts = async () => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
  };
  const { data: postData } = useQuery(`fetchPostData`, getPosts);
  console.log(postData);

  //로그인한 유저 상태확인해서 그걸로 그 유저가 작성한 글만 가져와야함

  return (
    <>
      {postData?.map((post) => {
        return (
          <div key={post.id}>
            <div>{post.title}</div>
            <div>{post.content}</div>
            <img src={post.photo} />
          </div>
        );
      })}
    </>
  );

  //map함수를 쓰는 이유 : 대량 데이터를 처리하기 위함
}

export default Mypost;
