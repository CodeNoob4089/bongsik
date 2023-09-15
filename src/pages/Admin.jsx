import React, { useEffect, useState } from "react";
import useAuthStore from "../store/auth";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { uploadImage, addBadge } from "../store/UserService";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

function Admin() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [colorSrcFile, setColorSrcFile] = useState(null);
  const [greySrcFile, setGreySrcFile] = useState(null);
  const [badgeName, setBadgeName] = useState("");
  const [badgeCondition, setBadgeCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  // function handleFileChange(e, setFunc) {
  //   if (e.target.files[0]) {
  //     setFunc(e.target.files[0]);
  //   }
  // }

  const handleAddBadge = async () => {
    setIsLoading(true);
    try {
      let colorSrcUrl;
      let greySrcUrl;

      if (colorSrcFile) {
        colorSrcUrl = await uploadImage(colorSrcFile);
      }

      if (greySrcFile) {
        greySrcUrl = await uploadImage(greySrcFile);
      }

      await addBadge({
        name: badgeName,
        condition: badgeCondition,
        colorsrc: colorSrcUrl,
        greysrc: greySrcUrl,
      });

      alert("뱃지가 성공적으로 추가되었습니다.");

      setBadgeName("");
      setBadgeCondition("");
      setColorSrcFile(null);
      setGreySrcFile(null);
    } catch (error) {
      alert("뱃지 추가에 실패했습니다. 다시 시도해주세요.");
      // console.log("이미지 업로드 에러", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAllUserBadges = async () => {
    const badgesRef = collection(db, "badges");
    const badgesSnapshot = await getDocs(badgesRef);
    const allBadgeIds = badgesSnapshot.docs.map((doc) => doc.id);

    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    for (const userDoc of usersSnapshot.docs) {
      let ownedBadgesUpdateNeeded = false;
      let updatedOwnedBadges = {};

      if (userDoc.data().ownedBadges) {
        updatedOwnedBadges = { ...userDoc.data().ownedBadges };
      }

      for (const badgeId of allBadgeIds) {
        if (!updatedOwnedBadges[badgeId]) {
          updatedOwnedBadges[badgeId] = { isOwned: false };
          ownedBadgesUpdateNeeded = true;
        }
      }

      if (ownedBadgesUpdateNeeded) {
        await updateDoc(userDoc.ref, { ownedBadges: updatedOwnedBadges });
      }
    }
  };

  const handleUpdateAllUserBadges = async () => {
    try {
      await updateAllUserBadges();
      alert("모든 유저의 뱃지 정보가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      alert("유저 뱃지 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
      // console.log("error updating user badges", error);
    }
  };

  return user && user.isAdmin ? (
    <>
      <Adminbox>
        <h1>뱃지 추가</h1>
        <label>
          이름:
          <input value={badgeName} onChange={(e) => setBadgeName(e.target.value)} />
        </label>
        <label>
          조건:
          <input value={badgeCondition} onChange={(e) => setBadgeCondition(e.target.value)} />
        </label>
        <label>
          Color Image:
          <input type="file" onChange={(e) => setColorSrcFile(e.target.files[0])} />
        </label>
        <label>
          Grey Image:
          <input type="file" onChange={(e) => setGreySrcFile(e.target.files[0])} />
        </label>
        <button onClick={handleAddBadge} disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Badge"}
        </button>
        <button onClick={handleUpdateAllUserBadges}>모든 유저 뱃지 정보 업데이트</button>
      </Adminbox>
    </>
  ) : null;
}

export default Admin;

const Adminbox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90vw;
  height: 100vh;
  margin-left: 100px;

  h1 {
    color: #333;
    margin-bottom: 20px;
    font-size: 24px;
  }

  label {
    color: #555;
    margin-bottom: 10px;

    input {
      padding: 10px;
      margin-left: 10px;
      border-radius: 5px;
    }
  }

  button {
    padding: 15px;
    background-color: #ff4e50;
    color: white;
    border: none;
    margin: 20px;

    &:disabled {
      background-color: #ccc;
    }

    &:hover {
      cursor: pointer;
      background-color: #ff2e30;
    }
  }
`;
