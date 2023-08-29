import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const getMyTags = async () => {
  if (!auth.currentUser) {
    return [];
  }
  const tagRef = doc(db, "users", auth.currentUser.uid);
  const tagSnap = await getDoc(tagRef);
  return tagSnap.data().myTags;
};

export { getMyTags };
