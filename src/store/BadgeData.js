import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getBadgeData = async () => {
  const badgeCollection = collection(db, "badges");
  const querySnapshot = await getDocs(badgeCollection);
  const badges = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return badges;
};
