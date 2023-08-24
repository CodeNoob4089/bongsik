import React from "react";
import { getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { collection } from "firebase/firestore";
import { useQuery } from "react-query";

function Mypost() {
  const getPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const fetchedData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return fetchedData;
  };
  const { data: postData } = useQuery(`fetchPostData`, getPosts);

  // const posts = postData.map(Mypost(Element), {});
  // return <div>Mypost</div>;
  //map함수를 쓰는 이유 : 대량 데이터를 처리하기 위함
}

export default Mypost;
