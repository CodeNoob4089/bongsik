import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import useMapDataStore from '../store/mapdata';
import useClickedDataStore from '../store/moduledata';
import useAuthStore from '../store/auth';

const { kakao } = window;

function KakaoMap({showModal}) {
  const [inputValue,setInputValue] = useState("")
  const [searchKeyword, setSearchKeyword] = useState("");
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [pagination, setPagination] = useState({});

  const data = useMapDataStore((state) => state.data)
  const setData = useMapDataStore((state) => state.setData)
  const setClickedData = useClickedDataStore((state) => state.setClickedData)
  const user = useAuthStore((state) => state.user)

  const keywordInputChange = (e) => {
    e.preventDefault();
    setInputValue(e.target.value);
  }

  const submitKeyword = (e) => {
    e.preventDefault();
    setSearchKeyword(inputValue)
  }

  useEffect(() => {
    if (!map) return
    const ps = new kakao.maps.services.Places()

    ps.keywordSearch(searchKeyword, (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds()
        let markers = []
        for (let i = 0; i < data.length; i++) {
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          })
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
        }
        setData(data)
        setMarkers(markers)
        setPagination(pagination)
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds)
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        setData(null)
        alert('검색 결과가 존재하지 않습니다.');
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
      }
    })
  }, [searchKeyword,map])

  return (
    <>
    <Map // 로드뷰를 표시할 Container
        center={{
          lat: 35.6632102,
          lng: 128.556077,
        }}
        style={{
          width: "67vw",
          height: "80vh",
          margin: "5vh 4vw",
          position: "relative",
          borderRadius: "15px",
        }}
        level={1}
        onCreate={setMap}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info &&info.content === marker.content && (
              <div style={{color:"#000"}}>{marker.content}</div>
            )}
          </MapMarker>
        ))}
    </Map>
    <SearchArea>
      <SearchForm
      onSubmit={submitKeyword}
      >
        <SearchMapInput
        value={inputValue}
        onChange={keywordInputChange}
        placeholder="검색어를 입력해주세요"
        />
        <SearchButton>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </SearchButton>
      </SearchForm>
      {!searchKeyword? null :(
        <SearchResult id="result-wrapper">
        <ResultText className="result-keyword">
          { searchKeyword }&nbsp;
        검색 결과
        </ResultText>
        {data?.map((d, index) => (
          <ResultList key={d.id}>
          <span>{index+1}</span>
          <div onClick={() => {
            if(user === null){return alert("글을 작성하려면 로그인해주세요!")}
            if(d.category_group_name === "음식점" || d.category_group_name === "카페")
            { setClickedData(d)
              showModal()
            } else {alert("해당 장소는 음식점이 아닙니다!")}
          }}>
            <PlaceData>{d.place_name}</PlaceData>
            <PlaceData>{d.address_name}</PlaceData>
            <PhoneNum>{d.phone}</PhoneNum>
          </div>
          <ButtonContainer>
          <PlaceLinkButton onClick={() => window.open(`${d.place_url}`, '_blank')}>가게 정보</PlaceLinkButton>
          </ButtonContainer>
          </ResultList>
        ))}
        <PageNumber id="pagination">
          {console.log(pagination)}
        </PageNumber>
        </SearchResult>
      )}
      </SearchArea>
    </>
  )
  }

export default KakaoMap;

const SearchArea = styled.div`
  position: absolute;
  margin: 6vh 4vw 0vh 4vw;
  top: 6rem;
  right: 23rem;
  width: 18rem;
`

const SearchForm = styled.form`
  width: 16.5rem;
  height: 2.5rem;
`

const SearchMapInput = styled.input`
  position: absolute;
  font-size: 17px;
  z-index: 2;
  padding-left: 1rem;
  width: 16.5rem;
  height: 2.2rem;
  border: 1.2px solid #696969;
  border-radius: 30px;
`

const SearchButton = styled.button`
  position: absolute;
  z-index: 3;
  color: #696969;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 18px;
  margin: 0.4rem 0 0 14rem;
`
const SearchResult = styled.div`
  position: absolute;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  width: 15rem;
  height: auto;
  max-height: 70vh;
  padding: 0.7rem;
  margin-left: 20px;
  overflow-y: scroll;
`
const ResultText = styled.p`
  margin-bottom: 10px;
`
const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  border-top: 1px solid gray;
  padding-top: 10px;
  line-height: 1.5rem;
  cursor: pointer;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  height: 15px;

`

const PlaceLinkButton = styled.button`
  background-color: white;
  border: 1px solid gray;
  border-radius: 30px;
  width: 4rem;
  height: 2rem;
  cursor: pointer;
`

const PlaceData = styled.p`
  text-decoration: none;
  color: black;
`
const PhoneNum = styled.p`
  text-decoration: none;
  color: green;
  font-size: 15px;
`

const PageNumber = styled.div`  
  display: flex;
  justify-content: center;

  a{
    font-weight: bold;
    font-size: 17px;
    color: #696969;
    margin-right: 20px;
  }

  .on{
    font-weight: bold;
    color: black;
  }
`
