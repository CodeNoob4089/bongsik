import { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faStar } from "@fortawesome/free-solid-svg-icons";
import { Circle, Map, MapInfoWindow, MapMarker, Rectangle } from "react-kakao-maps-sdk";
import useMapDataStore from "../store/mapdata";
import useClickedDataStore from "../store/modalData";
import useAuthStore from "../store/auth";

import proj4 from "proj4";

const { kakao } = window;

function KakaoMap({ showModal, postData }) {
  let timerId = null;
  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [pagination, setPagination] = useState({});
  const [currentMouseOver, setCurrentMouseOver] = useState();
  const [mapCenterPosition, setMapCenterPosition] = useState({
    lat: 35.6632102,
    lng: 128.556077,
  });
  const [loadingLocation, setLoadingLocation] = useState(true);

  const data = useMapDataStore((state) => state.data);
  const setData = useMapDataStore((state) => state.setData);
  const setClickedData = useClickedDataStore((state) => (state ? state.setClickedData : []));
  const user = useAuthStore((state) => state.user);

  const keywordInputChange = (e) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  const submitKeyword = (e) => {
    e.preventDefault();
    setSearchKeyword(inputValue);
  };

  // const debounce = (delay) => {
  //   if (timerId) {
  //     clearTimeout(timerId);
  //   }
  //   timerId = setTimeout(() => {
  //     setCurrentMouseOver();
  //   }, delay);
  // };

  useEffect(() => {
    const getLocation = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      });
    });

    getLocation
      .then((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        setMapCenterPosition({
          lat: userLat,
          lng: userLng,
        });
      })
      .catch((error) => console.error(error))
      .finally(() => setLoadingLocation(false));
  }, []);

  useEffect(() => {
    if (!map || !mapCenterPosition) return;

    map.setCenter(new kakao.maps.LatLng(mapCenterPosition.lat, mapCenterPosition.lng));
  }, [map, mapCenterPosition]);

  useEffect(() => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    const options = {
      location: new kakao.maps.LatLng(mapCenterPosition.lat, mapCenterPosition.lng),
    };

    ps.keywordSearch(
      searchKeyword,
      (data, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다.
          const bounds = new kakao.maps.LatLngBounds();
          let markers = [];
          for (let i = 0; i < data.length; i++) {
            markers.push({
              position: {
                lat: data[i].y,
                lng: data[i].x,
              },
              content: data[i].place_name,
            });
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
          setData(data);
          setMarkers(markers);
          setPagination(pagination);
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds);
          // 지도의 크기 level 조절
          map.setLevel(5);
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
  }, [searchKeyword, map]);

  // -----------------폴리곤 그려주기-----------------
  useEffect(() => {
    const findNeighborhood = () => {
      return new Promise((resolve, reject) => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        const callback = (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            resolve(result[0].region_3depth_name);
          } else {
            reject(status);
          }
        };

        geocoder.coord2RegionCode(mapCenterPosition.lng, mapCenterPosition.lat, callback);
      });
    };

    const findNeighborhoodCoordinates = async (neighborhoodName) => {
      const response = await fetch("emd.zip.geojson", {
        headers: {
          Accept: "application / json",
        },
        method: "GET",
      });

      const data = await response.json();
      for (const feature of data.features) {
        if (neighborhoodName === feature.properties.EMD_KOR_NM) {
          return feature.geometry.coordinates;
        }
      }
      return false;
    };

    const addNeighborhoodPolygon = async () => {
      const neighborhoodName = await findNeighborhood();
      const coordinates = await findNeighborhoodCoordinates(neighborhoodName);
      const polygonPath = [];
      const utmk =
        "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";
      const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
      const transformer = proj4(utmk, wgs84);

      coordinates.forEach((coordinateArray) => {
        coordinateArray.forEach((coordinate) => {
          const [longi, lati] = transformer.forward(coordinate);
          polygonPath.push(new window.kakao.maps.LatLng(lati, longi));
        });
      });
      const polygon = new window.kakao.maps.Polygon({
        path: polygonPath,
        strokeColor: "#925CE9",
        fillColor: "#925CE9",
        fillOpacity: 0.7,
      });

      polygon.setMap(map);
    };
    if (map) {
      addNeighborhoodPolygon();
    }
  }, [mapCenterPosition, map]);

  if (loadingLocation) return <div>위치 정보를 가져오는 중...</div>;

  return (
    <>
      {loadingLocation ? (
        <div>위치 정보를 가져오는 중...</div>
      ) : (
        <>
          <MapBox>
            <DescriptionBox>
              <DescriptionTitle>다녀온 곳을 검색해보세요.</DescriptionTitle>
              <Description>검색창에 다녀온 곳을 검색하고 별점과 함께 게시물을 작성해보세요.</Description>
            </DescriptionBox>
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
            >
              <MapMarker
                position={{
                  lat: mapCenterPosition.lat,
                  lng: mapCenterPosition.lng,
                }}
                image={{
                  src: "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/free-icon-circle-button-458511.png?alt=media&token=a349691b-e938-41f6-95c0-38d20d8b968a", // 마커이미지의 주소입니다
                  size: {
                    width: 18,
                    height: 18,
                  }, // 마커이미지의 크기입니다
                  // options: {
                  //   offset: {
                  //     x: 27,
                  //     y: 69,
                  //   }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                  // },
                }}
              />
              {markers?.map((marker) => (
                <MapMarker
                  key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                  position={marker.position}
                  image={{
                    src: "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/location-pin%20(3).png?alt=media&token=10ecd6fb-cb31-44cc-9cf1-afc9f53d1428",
                    size: {
                      width: 40,
                      height: 40,
                    }, // 마커이미지의 크기입니다
                  }}
                  onMouseOver={() => setInfo(marker)}
                >
                  {info && info.content === marker.content && <MarkerInfo>{marker.content}</MarkerInfo>}
                </MapMarker>
              ))}
              {postData?.map((post) => (
                <div>
                  <Circle
                    key={post.postID}
                    center={{
                      lat: post.place.y,
                      lng: post.place.x,
                    }}
                    radius={100}
                    strokeWeight={2} // 선의 두께입니다
                    strokeColor={"#ff804e"} // 선의 색깔입니다
                    strokeOpacity={1} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle={"solid"} // 선의 스타일 입니다
                    fillColor={"#ff804e"} // 채우기 색깔입니다
                    fillOpacity={0.7} // 채우기 불투명도 입니다
                    onClick={() => setCurrentMouseOver(post)}
                  />
                  {post === currentMouseOver ? (
                    <MapMarker
                      key={currentMouseOver.postID}
                      position={{
                        lat: currentMouseOver.place.y,
                        lng: currentMouseOver.place.x,
                      }}
                      image={{
                        src: "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/location-pin.png?alt=media&token=521f1383-9b3f-453f-b60a-2d747ed36b7d",
                        size: {
                          width: 40,
                          height: 40,
                        }, // 마커이미지의 크기입니다
                      }}
                      // onMouseover={() => setCurrentMouseOver(post)}
                    >
                      <MarkerInfo>
                        {currentMouseOver.place.place_name}
                        <div>
                          {Array(currentMouseOver.star)
                            .fill()
                            .map((_, index) => (
                              <FontAwesomeIcon key={index} icon={faStar} style={{ color: "#ff4e50" }} />
                            ))}
                        </div>
                        {currentMouseOver.photo ? <MarkerImage src={currentMouseOver.photo}></MarkerImage> : null}
                      </MarkerInfo>
                    </MapMarker>
                  ) : null}
                </div>
              ))}
            </Map>
          </MapBox>
          <SearchArea>
            <SearchForm onSubmit={submitKeyword}>
              <SearchMapInput value={inputValue} onChange={keywordInputChange} />
              <SearchButton>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </SearchButton>
            </SearchForm>
            {!searchKeyword ? (
              <CurrentLocationContentsWrapper>
                <CurrentLocationInfo>
                  <div>
                    <p>
                      현재 나의 위치
                      <CurrentLocationButton
                        onClick={() =>
                          map.setCenter(new kakao.maps.LatLng(mapCenterPosition.lat, mapCenterPosition.lng))
                        }
                      ></CurrentLocationButton>
                    </p>
                    <p>기록한 가게 | 좋아요 누른 가게</p>
                  </div>
                </CurrentLocationInfo>
                <div>
                  <p>최근 리뷰</p>
                </div>
              </CurrentLocationContentsWrapper>
            ) : (
              <SearchResult id="result-wrapper">
                <ResultText className="result-keyword">
                  {searchKeyword}&nbsp; 검색 결과
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
                {data?.map((d, index) => (
                  <ResultList key={d.id}>
                    <span>{index + 1}</span>
                    <div onClick={() => window.open(`${d.place_url}`, "_blank")}>
                      <PlaceData>{d.place_name}</PlaceData>
                      <PlaceData>{d.address_name}</PlaceData>
                      <PhoneNum>{d.phone}</PhoneNum>
                    </div>
                    <ButtonContainer>
                      <PlaceLinkButton
                        onClick={() => {
                          setMapCenterPosition({ lat: d.y, lng: d.x });
                        }}
                      >
                        위치 보기
                      </PlaceLinkButton>
                      <PlaceLinkButton
                        onClick={() => {
                          if (user === null) {
                            return alert("글을 작성하려면 로그인해주세요!");
                          }
                          if (d.category_group_name === "음식점" || d.category_group_name === "카페") {
                            setClickedData(d);
                            showModal();
                          } else {
                            alert("해당 장소는 음식점이 아닙니다!");
                          }
                        }}
                      >
                        기록하기
                      </PlaceLinkButton>
                    </ButtonContainer>
                  </ResultList>
                ))}
                <PageNumber id="pagination">{console.log(pagination)}</PageNumber>
              </SearchResult>
            )}
          </SearchArea>
        </>
      )}
    </>
  );
}

export default KakaoMap;

const MapBox = styled.div`
  width: 56vw;
  height: 100%;
`;

const DescriptionBox = styled.div`
  line-height: 2.2rem;
  height: 20vh;
  padding: 8vh 1vw;
`;

const DescriptionTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff4e50;
`;
const Description = styled.p`
  font-size: 0.9rem;
`;

const MarkerInfo = styled.div`
  font-size: 0.8rem;
  line-height: 1.1rem;
  padding: 0.5rem;
  width: 13rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 3px solid white;
  box-shadow: 3px 3px 3px 3px gray;
`;

const MarkerImage = styled.img`
  width: 11rem;
  height: 11rem;
  object-fit: cover;
  margin: 0.5rem;
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
  box-shadow: 2px 2px 2px #d2d2d2;
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
  height: 90%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 0.9rem 1.2rem;
  box-shadow: 2px 2px 2px #d2d2d2;
`;
const CurrentLocationInfo = styled.div`
  display: flex;
  align-items: center;
  height: 4.2rem;
  border-bottom: 1px solid gray;
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

const SearchResult = styled.div`
  width: 100%;
  height: 53vh;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 0.7rem;
  overflow-y: scroll;
`;
const ResultText = styled.p`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  border-top: 1px solid gray;
  padding-top: 10px;
  line-height: 1.5rem;
  cursor: pointer;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  height: 15px;
  margin-top: 5px;
`;

const PlaceLinkButton = styled.button`
  background-color: white;
  border: 1px solid #d0d0de;
  border-radius: 30px;
  width: 70px;
  height: 30px;
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    background-color: #d0d0de;
  }
`;

const PlaceData = styled.p`
  text-decoration: none;
  color: black;
`;
const PhoneNum = styled.p`
  text-decoration: none;
  color: green;
  font-size: 15px;
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
