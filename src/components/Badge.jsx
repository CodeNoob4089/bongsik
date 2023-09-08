import React from "react";
import styled from "styled-components";

function Badge({ badges, ownedBadges }) {
  console.log("뱃지",ownedBadges);
  return (
    <BadgeContainer>
      <Title>뱃지</Title>
      <GridContainer>
        {badges.map((badge) => {
          return (
            <BadgeCard key={badge.id}>
              <Badgeimg src={ownedBadges.includes(badge.id) ? badge.colorsrc : badge.greysrc} />
              <BadgeName>{badge.name}</BadgeName>
            </BadgeCard>
          );
        })}
      </GridContainer>
    </BadgeContainer>
  );
}

export default Badge;

const BadgeContainer = styled.div`
  margin: 5vh auto;
  padding: 2.4rem;
  display: grid;
  flex-direction: column;
  width: 95%;
  height: 100%;
  border-radius: 1.8rem;
  background-color: white;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: bold;
  color: gray;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  overflow-y: scroll;
`;

const BadgeCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: rgb(0, 0, 0, 0);
`;

const Badgeimg = styled.img`
  width: 8rem;
  height: 8rem;
  margin: 0.7rem;
  object-fit: contain;
  border-radius: 30%;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const BadgeName = styled.p`
  font-size: 20px;
`;
