import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";

export const getUserBadges = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data().ownedBadges || [];
  } else {
    console.log("No such document!");
    return [];
  }
};

export const addBadge = async (badgeData) => {
  const badgesRef = collection(db, "badges");

  await addDoc(badgesRef, badgeData);
};

export const uploadImage = async (file) => {
  const storageRef = ref(storage, "badges/" + file.name);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
