import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const updateUserDoc = async (userId, data) => {
  try {
    const usersCollection = collection(db, "users");
    await addDoc(usersCollection, {
      uid: userId,
      ...data,
    });
    return true;
  } catch (error) {
    console.error("Error in updating user doc:", error);
    return false;
  }
};

export const getUserBadges = async (userId) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("uid", "==", userId));
  const querySnapshot = await getDocs(q);

  let userData = {};
  querySnapshot.forEach((doc) => {
    userData = doc.data();
  });

  return userData.ownedBadges || [];
};
