import { collection, doc, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
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
    docID: doc.id,
  }));
};
const deletePost = async (postID) => {
  const q = query(collection(db, "posts"), where("postID", "==", postID));
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error deleting post: ", error);
  }
};
export { getMyTags, getPosts, deletePost };
