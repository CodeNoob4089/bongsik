import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { ImageBox, InfoBox, ListContainer, ListTitle, NoBestWorstPost, PostCard, PostDescription, PostsContainer, PostTitle } from "../shared/BestWorstList"

function WorstList({postData}) {
  const worstPosts = postData?.filter((post) => post.star === 0);
  const starArray = [0, 1, 2, 3, 4]
  return (
    <ListContainer>
      <ListTitle>별로였어요 &nbsp;
      {starArray.map((s, i) => <FontAwesomeIcon key={i} icon={faStar} color={"gray"}/>)}
      </ListTitle>
      <PostsContainer>
        {worstPosts?.length !== 0?
          worstPosts?.map((post) => {
            return (
              <PostCard key={post.postId}>
                <ImageBox src={post.photo ? post.photo : "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%8A%A4%ED%8C%8C%EA%B2%8C%ED%8B%B0%20ETG.png?alt=media&token=a16fadeb-f562-4c12-ad73-c4cc1118a108"} />
                <InfoBox>
                  <PostTitle>{post.place.place_name}</PostTitle>
                  <PostDescription>{post.place.road_address_name || post.place.address_name}</PostDescription>
                </InfoBox>
              </PostCard>
            );
          })
        : <NoBestWorstPost>아직 별점 0점을 준 맛집이 없어요!</NoBestWorstPost>
        }
        </PostsContainer>
    </ListContainer>
  );
}

export default WorstList;