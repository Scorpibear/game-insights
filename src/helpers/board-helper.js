import { Chess } from "chess.js";

export default {
  getGames: (pgn, moves, username, orientation) => {
    return moves.map((move) => {
      const chessCopy = new Chess();
      chessCopy.load_pgn(pgn);
      chessCopy.move(move);
      const game = {
        pgn: chessCopy.pgn(),
        username,
        orientation,
      };
      return game;
    });
  },
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
