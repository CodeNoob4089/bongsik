import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const getMyTags = async () => {
  if (!auth.currentUser) {
    return [];
  }
  const tagRef = doc(db, "users", auth.currentUser?.uid);
  const tagSnap = await getDoc(tagRef);
  return tagSnap.data().myTags;
};

const getPosts = async () => {
  if (!auth.currentUser) {
    return [];
  }
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("uid", "==", auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
  }));
};
export { getMyTags, getPosts };
