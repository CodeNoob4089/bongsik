import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';

const { kakao } = window;

function Map() {
  let markers = [];
  const [inputValue,setInputValue] = useState("")
  const [searchKeyword, setSearchKeyword] = useState("");

  const keywordInputChange = (e) => {
    e.preventDefault();
    setInputValue(e.target.value);
  }

  const submitKeyword = (e) => {
    e.preventDefault();
    setSearchKeyword(inputValue)
  }

  useEffect(() => {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          const options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
          };
          const map = new kakao.maps.Map(container, options)
          const ps = new kakao.maps.services.Places();
          const infowindow = new kakao.maps.InfoWindow({zIndex:2});

          searchPlaces();
          // 키워드 검색을 요청하는 함수
          function searchPlaces() {
            if(!searchKeyword.replace(/^\s+|\s+$/g, "")){
              console.log("키워드를 입력해주세요!");
              console.log("키워드", searchKeyword )
              return false;
            }
            // 장소검색 객체를 통해 키워드로 장소검색을 요청
            ps.keywordSearch(searchKeyword, placesSearchCB)
          }
          // 장소검색이 완료됐을 때 호출되는 콜백함수
          function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
              // 정상적으로 검색이 완료됐으면
              // 검색 목록과 마커를 표출
              displayPlaces(data);
              // 페이지 번호를 표출
              displayPagination(pagination);
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
              alert('검색 결과가 존재하지 않습니다.');
              return;
            } else if (status === kakao.maps.services.Status.ERROR) {
              alert('검색 결과 중 오류가 발생했습니다.');
              return;
            }
          }
    // 검색 결과 목록과 마커를 표출하는 함수
    function displayPlaces(places) {
      const listEl = document.getElementById('places-list'), 
            resultEl = document.getElementById('result-wrapper'),
            fragment = document.createDocumentFragment(), 
            bounds = new kakao.maps.LatLngBounds();
            
    // 검색 결과 목록에 추가된 항목들을 제거
    // removeAllChildNods(listEl);
    listEl && removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거
    removeMarker();

    for ( var i=0; i<places.length; i++ ) {
      // 마커를 생성하고 지도에 표시
      let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
          marker = addMarker(placePosition, i, undefined), 
          itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가
      bounds.extend(placePosition);

      // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시
      // mouseout 했을 때는 인포윈도우를 닫기
      (function(marker, title) {
        kakao.maps.event.addListener(marker, 'mouseover', function() {
          displayInfowindow(marker, title);
        });

        kakao.maps.event.addListener(marker, 'mouseout', function() {
          infowindow.close();
        });

        itemEl.onmouseover =  function () {
          displayInfowindow(marker, title);
        };

        itemEl.onmouseout =  function () {
          infowindow.close();
        };
      })(marker, places[i].place_name);

      fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Element에 추가
    listEl && listEl.appendChild(fragment);
    if (resultEl) {
      resultEl.scrollTop = 0;
    }

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정
    map.setBounds(bounds);
  }

  // 검색결과 항목을 Element로 반환하는 함수
  function getListItem(index, places) {

    const el = document.createElement('li');
    let itemStr = `
        <div class="info">
          <span class="marker marker_${index+1}">
            📍${index+1}
          </span>
          <button style="margin-left:90px;" class="add-button">추가하기</button>
          <a style="text-decoration:none;color:black;" href="${places.place_url}">
            <h5 class="info-item place-name">${places.place_name}</h5>
            ${
              places.road_address_name
              ? `<span class="info-item road-address-name">
                  ${places.road_address_name}
                </span>
                <br/>
                <span class="info-item address-name">
                  ${places.address_name}
                  </span>`
              : `<span class="info-item address-name">
                  ${places.address_name}
                </span>`
            }
            <br/>
            <span class="info-item tel">
              ${places.phone}
            </span>
          </a>
          <br/>
          </div>
          <br/>
        `

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
  }

  // 마커를 생성하고 지도 위에 마커를 표시하는 함수
  function addMarker(position, idx, title) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions =  {
          spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage 
        });

    marker.setMap(map); // 지도 위에 마커를 표출
    markers.push(marker);  // 배열에 생성된 마커를 추가

    return marker;
  }

  // 지도 위에 표시되고 있는 마커를 모두 제거합니다
  function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  // 검색결과 목록 하단에 페이지번호를 표시는 함수
  function displayPagination(pagination) {
    const paginationEl = document.getElementById('pagination');
    let fragment = document.createDocumentFragment();
    let i; 

    // 기존에 추가된 페이지번호를 삭제
    while (paginationEl.hasChildNodes()) {
      paginationEl.lastChild &&
        paginationEl.removeChild(paginationEl.lastChild);
    }

    for (i=1; i<=pagination.last; i++) {
      const el = document.createElement('a');
      el.href = "#";
      el.innerHTML = i.toString();

      if (i===pagination.current) {
        el.className = 'on';
      } else {
        el.onclick = (function(i) {
          return function() {
            pagination.gotoPage(i);
          }
        })(i);
      }

      fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
  }

  // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
  // 인포윈도우에 장소명을 표시
  function displayInfowindow(marker, title) {
    const content = '<div style="padding:5px;z-index:1;" class="marker-title">' + title + '</div>';

    infowindow.setContent(content);
    infowindow.open(map, marker);
  }

  // 검색결과 목록의 자식 Element를 제거하는 함수
  function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
      // el.lastChild &&
        el.removeChild (el.lastChild);
    }
  }

  })}, [searchKeyword])

  return (
    <>
    <MapArea id='map'></MapArea>
    <SearchArea>
      <SearchBox
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
      </SearchBox>
      {!searchKeyword? null :(
        <SearchResult id="result-wrapper">
        <div className="result-text">
        <ResultText className="result-keyword">
          { searchKeyword }&nbsp;
        검색 결과
        </ResultText>
        <div className="scroll-wrapper">
          <ul id="places-list"></ul>
        </div>
        <PageNumber id="pagination"></PageNumber>
        </div>
    </SearchResult>
      )}
  
      </SearchArea>
      {/* <AddButton>+</AddButton> */}
    </>
  )
  }

export default Map;

const MapArea = styled.div`
  width: 67vw;
  height: 86vh;
  margin: 7vh 4vw;
  position: fixed;
`
const SearchArea = styled.div`
  position: absolute;
  margin: 6vh 4vw 0vh 4vw;
  top: 1.2rem;
  right: 24vw;
  width: 18rem;
`

const SearchBox = styled.form`
  width: 16.5rem;
  height: 2.5rem;
`

const SearchMapInput = styled.input`
  position: fixed;
  font-size: 17px;
  z-index: 2;
  padding-left: 1rem;
  width: 16.5rem;
  height: 2.2rem;
  border: 1.2px solid #696969;
  border-radius: 30px;
`

const SearchButton = styled.button`
  position: fixed;
  z-index: 3;
  color: #696969;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 18px;
  margin: 0.4rem 0 0 14rem;
`
const SearchResult = styled.div`
  position: fixed;
  z-index: 3;
  background-color:rgba(255, 255, 255, 0.6);
  width:15rem;
  height: 70vh;
  padding: 0.7rem;
  margin-left: 20px;
  overflow: scroll;
`
const ResultText = styled.p`
  margin-bottom: 10px;
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