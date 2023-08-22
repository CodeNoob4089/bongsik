import { useEffect } from "react";
import styled from "styled-components";

const { kakao } = window;

const Map = () => {
  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      const map = new kakao.maps.Map(container, options);
    });
  }, []);
  return <MapArea id="map"></MapArea>;
};

export default Map;

const MapArea = styled.div`
  width: 500px;
  height: 400px;
`;
