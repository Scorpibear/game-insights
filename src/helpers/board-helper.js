export default {
  identifyOrientation: (chess, username) => {
    return username
      ? chess.header()?.White?.toLowerCase() == username?.toLowerCase()
        ? "white"
        : "black"
      : chess.turn() == "w"
      ? "white"
      : "black";
  },
};
