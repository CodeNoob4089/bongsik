const getLevelImageUrl = (level) => {
  if (level < 3) {
    return "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/woodSpoon.png?alt=media&token=8465e3e4-ee5c-4a03-aeab-4a896fea1867";
  } else if (level < 6) {
    return "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/silverSpoon.png?alt=media&token=56e7a660-5413-42e1-a8d7-004bc21dbacb";
  } else if (level < 12) {
    return "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/goldSppon.png?alt=media&token=9068663c-063c-40a8-b256-2f7b4057eea9";
  } else {
    return "https://firebasestorage.googleapis.com/v0/b/kimbongsik-69c45.appspot.com/o/diamondSpoon.png?alt=media&token=ac9746a2-37dc-47b9-9765-e605b7e9940f";
  }
};

export default getLevelImageUrl;
