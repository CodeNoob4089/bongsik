import React from "react";
import styled from "styled-components";

function Badge({ badges, ownedBadges }) {
  console.log(ownedBadges);
  return (
    <BadgeContainer>
      {badges.map((badge) => {
        return (
          <BadgeCard key={badge.id}>
            <Badgeimg
              src={
                ownedBadges.includes(badge.id) ? badge.colorsrc : badge.greysrc
              }
            />
            <BadgeName>{badge.name}</BadgeName>
          </BadgeCard>
        );
      })}
    </BadgeContainer>
  );
}

export default Badge;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`;

const BadgeCard = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  padding: 1rem;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  background-color: #fafafa;
`;

const Badgeimg = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const BadgeName = styled.p`
  font-size: 24px;
  padding-top: 1rem;
`;
