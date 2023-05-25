import { Chess } from "chess.js";

export default {
  getGames: (initGame, moves) => {
    const chessCopy = new Chess();
    chessCopy.load_pgn(initGame.pgn);
    return moves.map((move) => {
      chessCopy.move(move);
      const game = { ...initGame, pgn: chessCopy.pgn() };
      chessCopy.undo();
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
