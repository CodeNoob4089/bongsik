import { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faStar } from "@fortawesome/free-solid-svg-icons";
import { Circle, Map, MapMarker } from "react-kakao-maps-sdk";
import useMapDataStore from "../store/mapdata";
import useClickedDataStore from "../store/modalData";
import proj4 from "proj4";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Skeleton from "../skeleton/MapSkeleton";
import { Description, DescriptionBox, DescriptionTitle } from "../shared/MainDescription";
import { useNavigate } from "react-router-dom";

const { kakao } = window;

function KakaoMap({ showModal, postData, user }) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [pagination, setPagination] = useState({});
  const [currentMouseOver, setCurrentMouseOver] = useState();
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [mapCenterPosition, setMapCenterPosition] = useState({
    lat: 35.6632102,
    lng: 128.556077,
  });
  const [userLocation, setUserLocation] = useState({
    lat: 35.6632102,
    lng: 128.556077,
  });
  const [myAddress, setMyAddress] = useState("현위치를 가져오는 중입니다...");
  const [dongNameArray, setDongNameArray] = useState([]);
 

  const data = useMapDataStore((state) => state.data);
  const setData = useMapDataStore((state) => state.setData);
  const setClickedData = useClickedDataStore((state) => (state ? state.setClickedData : []));
  const RealTimeMyPost = postData?.sort(
    (a, b) => b.timestamp?.toDate().getTime() - a.timestamp?.toDate().getTime()
  );
  const dongImgArray = [
    "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/RedDong.png?alt=media&token=eb74b27e-6eba-4711-95bb-4d9a2a5b0c37",
    "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/BlueDong.png?alt=media&token=7aaeb018-8ad8-4ccb-9b46-6b8a5227afca",
    "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/YellowDong.png?alt=media&token=345e360e-74a4-4d53-b28c-0e3b492a257f",
    "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/PinkDong.png?alt=media&token=e2ac44be-6dcc-49d2-ad30-8407fe22aa1d",
    "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/GreenDong.png?alt=media&token=6a0b4088-6fc0-4160-a787-d37feb4bb389",
    "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/PurpleDong.png?alt=media&token=86126453-0c8e-460b-82d7-28074840763b",
  ]

  const keywordInputChange = (e) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  const submitKeyword = (e) => {
    e.preventDefault();
    setSearchKeyword(inputValue);
  };

  const onMapDragged = (map) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(map.getCenter().getLng(), map.getCenter().getLat(), (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setMyAddress(result[0]?.road_address ? result[0].road_address.address_name : result[0].address.address_name);
      } else {
        console.error("주소 변환 실패:", status);
        return;
      }
    });
  };

  useEffect(() => {
    const geocoder = new kakao.maps.services.Geocoder();
    const getLocation = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      });
    });

    getLocation
      .then((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        setUserLocation({
          lat: userLat,
          lng: userLng,
        });
        setMapCenterPosition({
          lat: userLat,
          lng: userLng,
        });

        geocoder.coord2Address(userLng, userLat, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            setMyAddress(result[0]?.road_address?result[0].road_address.address_name:result[0].address.address_name)
          } else {
            console.error("주소 변환 실패:", status);
            return;
          }
        });
      })
      .catch((error) => console.error(error))
      .finally(() => setLoadingLocation(false));
  }, [user]);

  useEffect(() => {
    if (!map || !mapCenterPosition) return;

    map.setCenter(new kakao.maps.LatLng(mapCenterPosition.lat, mapCenterPosition.lng));
  }, [map, mapCenterPosition, user]);

  useEffect(() => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    const options = {
      location: new kakao.maps.LatLng(mapCenterPosition.lat, mapCenterPosition.lng),
    };
    //
    ps.keywordSearch(
      searchKeyword,
      (data, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          let markers = [];
          for (let i = 0; i < data.length; i++) {
            markers.push({
              position: {
                lat: data[i].y,
                lng: data[i].x,
              },
              content: data[i].place_name,
            });
          }
          setData(data);
          setMarkers(markers);
          setPagination(pagination);
          setMapCenterPosition({
            lat: data[0].y,
            lng: data[0].x,
          })
          map.setLevel(4);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          setData(null);
          alert("검색 결과가 존재하지 않습니다.");
          return;
        } else if (status === kakao.maps.services.Status.ERROR) {
          alert("검색 결과 중 오류가 발생했습니다.");
          return;
        }
      },
      options
    );
  }, [searchKeyword, map, user]);

  const findNeighborhood = (lng, lat) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      const callback = (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve(result[0].code);
        } else {
          reject(status);
        }
      };

      geocoder.coord2RegionCode(lng, lat, callback);
    });
  };

// 검색결과 리스트에서 기록하기 버튼 클릭 함수
  const onPostAddButtonClick = async (d) => {
    if (user === null) {
      return alert("글을 작성하려면 로그인해주세요!");
    }
    if (d.category_group_name === "음식점" || d.category_group_name === "카페") {
      setMapCenterPosition({
        lat: d.y,
        lng: d.x,
      });
      const neighborhoodName = await findNeighborhood(d.x, d.y);
      const dongCode = neighborhoodName.substr(0, 8);
      setClickedData({ ...d, dongCode });
      showModal();
    } else {
      alert("해당 장소는 음식점이 아닙니다!");
    }
  };

  const dongNameLists = [];
  // -----------------폴리곤 그려주기-----------------
  useEffect(() => {

    const result = user?.dongCounts?.reduce((acc, cur) => {
      if (acc[cur]) {
        acc[cur] += 1;
      } else {
        acc[cur] = 1; // acc.cur이 없으면 선언함
      }
      return acc;
    }, {});

    const keysOfResult = Object.keys(result || {});
    const coloredDongs = keysOfResult?.filter((key) => result[key] >= 3);
    console.log("coloredDongs", coloredDongs)
    const polygonList = [];

    coloredDongs?.map(async (dong) => {
      const dongRef = doc(db, "location", dong);
      const dongSnap = await getDoc(dongRef);
      const coordinates = JSON.parse(dongSnap.data().coordinates);
      const dongName = dongSnap.data().dong;
  
      // 동 이름 배열추가 
      dongNameLists.push(dongName);
      setDongNameArray(dongNameLists)

      const polygonPath = [];
      const utmk =
        "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";
      const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
      const transformer = proj4(utmk, wgs84);

      coordinates?.forEach((coordinateArray) => {
        coordinateArray.forEach((coordinate) => {
          const [longi, lati] = transformer.forward(coordinate);
          polygonPath?.push(new window.kakao.maps.LatLng(lati, longi));
        });
      });
      const polygon = new window.kakao.maps.Polygon({
        path: polygonPath,
        strokeColor: "#f96a23",
        fillColor: "#f96a23",
        fillOpacity: 0.6,
      });
      polygonList?.push(polygon);
      polygon.setMap(map);
    });

    return () => {
      polygonList.forEach((polygon) => {
        polygon.setMap(null);
      });
    };
  }, [postData, map]);


  return (
    <>
      <MapBox>
        <DescriptionBox>
          <DescriptionTitle>다녀온 곳을 검색해보세요.</DescriptionTitle>
          <Description>검색창에 다녀온 곳을 검색하고 별점과 함께 게시물을 작성해보세요.</Description>
        </DescriptionBox>
        {loadingLocation ? (
          <Skeleton height="60vh" width="100%" />
        ) : (
          <Map // 로드뷰를 표시할 Container
            center={mapCenterPosition}
            style={{
              width: "56vw",
              height: "61vh",
              position: "relative",
              borderRadius: "15px",
            }}
            level={5}
            onCreate={setMap}
            onDragEnd={(map) => {
              onMapDragged(map);
            }}
          >
            <MapMarker
              position={{
                lat: userLocation.lat,
                lng: userLocation.lng,
              }}
              image={{
                src: "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/free-icon-circle-button-458511.png?alt=media&token=a349691b-e938-41f6-95c0-38d20d8b968a",
                size: {
                  width: 18,
                  height: 18,
                },
              }}
            />
            {markers?.map((marker) => (
              <MapMarker
                key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                position={marker.position}
                image={{
                  src: "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/location-pin%20(10).png?alt=media&token=486aedd9-fe52-41ed-8c57-9c6a83a1a4c7",
                  size: {
                    width: 40,
                    height: 40,
                  },
                }}
                onMouseOver={() => setInfo(marker)}
                onClick={() =>
                 {const clickedPlaceData = data?.filter((d) => d.place_name === marker.content)[0]
                  onPostAddButtonClick(clickedPlaceData)
                }}
              >
                {info && info.content === marker.content && <MarkerInfo>{marker.content}</MarkerInfo>}
              </MapMarker>
            ))}
            {postData?.map((post, idx) => (
              <div key={idx}>
                <Circle
                  zIndex={500}
                  key={post.postID}
                  center={{
                    lat: post.place.y,
                    lng: post.place.x,
                  }}
                  radius={100}
                  strokeWeight={2} // 선의 두께입니다
                  strokeColor={"#f96a23"} // 선의 색깔입니다
                  strokeOpacity={0} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                  strokeStyle={"solid"} // 선의 스타일 입니다
                  fillColor={"#f96a23"} // 채우기 색s깔입니다
                  fillOpacity={0.6} // 채우기 불투명도 입니다
                  onMousedown={() => {
                    if(searchKeyword) return;
                    map.setCenter(new kakao.maps.LatLng(post.place.y, post.place.x));
                    currentMouseOver === post ? setCurrentMouseOver() : setCurrentMouseOver(post);
                  }}
                />
                {post === currentMouseOver && !searchKeyword ? (
                  <MapMarker
                    zIndex={0}
                    key={currentMouseOver.postID}
                    position={{
                      lat: currentMouseOver.place.y,
                      lng: currentMouseOver.place.x,
                    }}
                    image={{
                      src: "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/location-pin%20(6).png?alt=media&token=ba55bfb5-4ba2-4196-bc6b-031c6b3d5fdd",
                      size: {
                        width: 40,
                        height: 40,
                      }, // 마커이미지의 크기입니다
                    }}
                    onClick={() => {
                      setCurrentMouseOver();
                    }}
                  >
                    <MarkerInfo>
                      {currentMouseOver.place.place_name}
                      <div>
                        <FontAwesomeIcon icon={faStar} style={{ color: "#ff4e50" }} />
                        {currentMouseOver.star}
                      </div>
                      {currentMouseOver.photo ? <MarkerImage src={currentMouseOver.photo}></MarkerImage> : null}
                    </MarkerInfo>
                  </MapMarker>
                ) : null}
              </div>
            ))}
          </Map>
        )}
      </MapBox>
      <SearchArea>
        <SearchForm onSubmit={submitKeyword}>
          <SearchMapInput value={inputValue} onChange={keywordInputChange} />
          <SearchButton>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </SearchButton>
        </SearchForm>
        <CurrentLocationContentsWrapper>
          {!searchKeyword ? (
            <div>
              <CurrentLocationInfo>
                <div>
                  <p style={{ fontSize: "1rem", fontWeight: "bold" }}>{myAddress}</p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "gray",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      map.setCenter(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
                      onMapDragged(map);
                    }}
                  >
                    <CurrentLocationButton />내 위치로
                  </p>
                </div>
              </CurrentLocationInfo>
              <CurrentLocationReviews>
                <RealtTimePostListsTitle onClick={() => navigate("/mypage")}>
                  <p>최근 리뷰</p><img
                  src="https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/right_button.png?alt=media&token=eaf76923-992b-40bf-a90b-aa2c80e8de8f"
                  style={{width: "1rem"}}
                  />
                </RealtTimePostListsTitle>
                <PostsLists>
                {RealTimeMyPost?.slice(0,3).map((post, idx) => 
                <RealTimePostCard key={idx} onClick={() => navigate("/mypage")}>
                  <RealTimePostImg src={post.photo || "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%8A%A4%ED%8C%8C%EA%B2%8C%ED%8B%B0%20ETG.png?alt=media&token=a16fadeb-f562-4c12-ad73-c4cc1118a108"}/>
                  <p>{post.place.place_name}</p>
                  <p>
                  {Array(post.star)
                      .fill()
                      .map((_, index) => (
                        <FontAwesomeIcon key={index} icon={faStar} style={{ color: "#ff4e50" }}/>
                      ))}
                    {Array(5 - post.star)
                      .fill()
                      .map((_, index) => (
                        <FontAwesomeIcon key={index} icon={faStar} style={{ color: "gray" }}/>
                      ))}
                  </p>
                </RealTimePostCard>
                )}
                </PostsLists>
              </CurrentLocationReviews>
              <CurrentLocationReviews>
                <p>도장깨기 완료한 동</p>
                {console.log("여기에용", dongNameArray)}
                <DongLists>
                {dongNameArray?.slice(0,6).map((dong, i) =>
                (
                  <RealTimePostCard key={i}>
                    <RealTimePostImg src={dongImgArray[i]}/>
                    <p>{dong}</p>
                  </RealTimePostCard>
                  ))
                  }
                </DongLists>
              </CurrentLocationReviews>
            </div>
          ) : (
            <>
              <ResultText className="result-keyword">
                <p>
                  <CurrentLocationButton
                    onClick={() => {
                      map.setCenter(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
                    }}
                  ></CurrentLocationButton>
                  &nbsp;<span style={{color: "#ff4e50", fontWeight:"600"}}>{searchKeyword}</span>&nbsp; 검색 결과
                </p>
                <button
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSearchKeyword("");
                    setInputValue("");
                    setMarkers([]);
                  }}
                >
                  X
                </button>
              </ResultText>
              <div style={{overflowY: "scroll"}}>
              {data?.map((d, index) => (
                <ResultList key={d.id}>
                  <div onClick={() => window.open(`${d.place_url}`, "_blank")}>
                    <PlaceData>{d.place_name}</PlaceData>
                    <PlaceAddressData>{d.road_address_name || d.address_name}</PlaceAddressData>
                    <PhoneNum>{d.phone}</PhoneNum>
                  </div>
                  <ButtonContainer>
                    <PlaceLinkButton
                      onClick={() => {
                        setMapCenterPosition({ lat: d.y, lng: d.x });
                      }}
                    >
                      위치보기
                    </PlaceLinkButton>
                    <PlaceLinkButton onClick={() => onPostAddButtonClick(d)}>기록하기</PlaceLinkButton>
                  </ButtonContainer>
                </ResultList>
              ))}
              <PageNumber id="pagination">{console.log(pagination)}</PageNumber>
              </div>
            </>
          )}
        </CurrentLocationContentsWrapper>
      </SearchArea>
    </>
  );
}

export default KakaoMap;

const MapBox = styled.div`
  width: 56vw;
  height: 100%;
`;

const MarkerInfo = styled.div`
  width: 9rem;
  font-size: 0.8rem;
  line-height: 1rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  box-shadow: 3px 3px 3px 3px #c8c8c8;
`;

const MarkerImage = styled.img`
  width: 8rem;
  height: 8rem;
  object-fit: cover;
  border-radius: 10px;
`;

const SearchArea = styled.div`
  width: 22vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: auto;
`;

const SearchForm = styled.form`
  width: 100%;
  height: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: right;
  padding-top: 9.5vh;
`;

const SearchMapInput = styled.input`
  font-size: 0.9rem;
  padding-left: 1rem;
  width: 100%;
  height: 1.9rem;
  border: none;
  border-radius: 30px;
  box-shadow: 2px 2px 2px #c8c8c8;
`;

const SearchButton = styled.button`
  position: absolute;
  right: 10vw;
  margin-top: 0.3rem;
  color: #696969;
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
`;

const CurrentLocationContentsWrapper = styled.div`
  width: 100%;
  height: 70vh;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 0.9rem 1.2rem;
  box-shadow: 2px 2px 2px #c8c8c8;
  overflow: hidden;
`;
const CurrentLocationInfo = styled.div`
  display: flex;
  align-items: center;
  height: 4.2rem;
  line-height: 1.3rem;
`;

const CurrentLocationButton = styled.button`
  width: 1.2rem;
  height: 1.2rem;
  background-color: white;
  background-image: url("https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/gps_fixed.png?alt=media&token=8cbc006a-93b0-4506-917b-168d95d94a80");
  object-fit: contain;
  background-size: 1rem;
  background-position: center center;
  border: 1px solid white;
  border-radius: 50%;
  margin: 0.2rem;
  cursor: pointer;
`;

const ResultText = styled.p`
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e7e7e7;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ResultList = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e7e7e7;
  line-height: 1.4rem;
  padding-bottom: 0.5rem;
  margin: 0.5rem auto;
  cursor: pointer;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  height: 100%;
  margin-top: 0.2rem;
`;

const PlaceLinkButton = styled.button`
  background-color: white;
  border: 1px solid #c6c6c6;
  border-radius: 30px;
  width: 70px;
  height: 30px;
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f2f2f5;
  }
`;

const PlaceData = styled.p`
  text-decoration: none;
  color: black;
  font-size: 1rem;
`;

const PlaceAddressData = styled.p`
  text-decoration: none;
  color: gray;
  font-size: 0.85rem;
`

const PhoneNum = styled.p`
  text-decoration: none;
  color: #ff4e50;
  font-size: 0.8rem;
`;

const PageNumber = styled.div`
  display: flex;
  justify-content: center;

  a {
    font-weight: bold;
    font-size: 17px;
    color: #696969;
    margin-right: 20px;
  }

  .on {
    font-weight: bold;
    color: black;
  }
`;

const CurrentLocationReviews = styled.div`
  height: 10rem;
  padding-top: 1rem;
  border-top: 1px solid #e7e7e7;
  font-size: 0.8rem;
  font-weight: 600;
`;

const RealtTimePostListsTitle = styled.div`
  display:flex;
  justify-content: space-between;
  cursor: pointer;
`

const PostsLists = styled.div`
  display: flex;
  flex-direction: row;
`

const RealTimePostCard = styled.div`
  margin-top: 0.5rem;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  width: 100%;
  line-height: 0.8rem;
  cursor: pointer;
`
const RealTimePostImg = styled.img`
  height: 4.5rem;
  width: 4.5rem;
  object-fit: cover;
  margin-bottom: 0.5rem;
  border-radius: 10px;
`

const DongLists = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`