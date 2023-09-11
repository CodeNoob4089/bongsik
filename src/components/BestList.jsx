import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { ImageBox, InfoBox, ListContainer, ListTitle, PostCard, PostDescription, PostsContainer, PostTitle } from "../shared/BestWorstList";

function BestList({postData}) {
  const bestPosts = postData?.filter((post) => post.star === 5);
  const starArray = [0, 1, 2, 3, 4]

  return (
    <ListContainer>
      <ListTitle>최고였어요 &nbsp;
      {starArray.map((s) => <FontAwesomeIcon icon={faStar} color={"#ff4e50"}/>)}
      </ListTitle>
      <PostsContainer>
          {bestPosts?.map((post) => {
            return (
              <PostCard key={post.postId}>
                <ImageBox src={post.photo ? post.photo : "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/%EC%8A%A4%ED%8C%8C%EA%B2%8C%ED%8B%B0%20ETG.png?alt=media&token=a16fadeb-f562-4c12-ad73-c4cc1118a108"} />
                <InfoBox>
                  <PostTitle>{post.place.place_name}</PostTitle>
                  <PostDescription>{post.place.road_address_name || post.place.address_name}</PostDescription>
                  {/* <div>{post.timestamp?.toDate().toLocaleDateString()}</div> */}
                </InfoBox>
              </PostCard>
            );
          })}
          </PostsContainer>
    </ListContainer>
  );
}

export default BestList;

