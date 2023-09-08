export const CustomArrowPrev = ({ onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide },
  } = rest;

  if (currentSlide === 0) {
    return null;
  }

  return (
    <button onClick={() => onClick()} className="carousel-button-left">
      Prev
    </button>
  );
};
