import { addDoc, arrayUnion, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useQuery } from "react-query";
import { db } from "../firebase";

function Dongdong() {
  const getData = async () => {
    const response = await fetch("emd.zip.geojson", {
      headers: {
        Accept: "application / json",
      },
      method: "GET",
    });
    const data = await response.json();
    return data.features;
  };

  const { data: jsonData } = useQuery("getData", getData);

  // console.log("f데이터",jsonData)

  const addDataToFirestore = async (jsonData) => {
    for (const item of jsonData) {
      // console.log(item);
      await setDoc(doc(db, "location", item.properties.EMD_CD), {
        coordinates: JSON.stringify(item.geometry.coordinates),
        dong: item.properties.EMD_KOR_NM,
      });
    }
    alert("끝!");
  };

  return (
    <div>
      <button onClick={() => addDataToFirestore(jsonData)}>Upload JSON to Firestore</button>
    </div>
  );
}

export default Dongdong;
