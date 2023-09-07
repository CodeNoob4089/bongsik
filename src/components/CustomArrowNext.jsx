export const CustomArrowNext = ({ onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide },
  } = rest;

  if (currentSlide === 0) {
    return null;
  }

  return (
    <button onClick={() => onClick()} className="carousel-button-right">
      Next
    </button>
  );
};
