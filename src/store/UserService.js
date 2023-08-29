import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";

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
