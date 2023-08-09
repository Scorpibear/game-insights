import { pgn2chessObject } from "./pgn-manipulations";
import SplitStrategy from "../helpers/split-strategy";

export default class BoardHelper {
  constructor(backend) {
    this.splitStrategy = new SplitStrategy(backend);
  }
  getGamesFromMoves(initGame, moves) {
    const chessCopy = pgn2chessObject(initGame.pgn);
    return moves.map((move) => {
      chessCopy.move(move);
      const game = { ...initGame, pgn: chessCopy.pgn() };
      chessCopy.undo();
      return game;
    });
  }
  async getTopGames(initGame, count) {
    const pgnList = await this.splitStrategy.split2top(count, initGame.pgn);
    const games = pgnList.map((pgn) => ({ ...initGame, pgn }));
    return games;
  }
  identifyOrientation(chess, username) {
    return username
      ? chess.header()?.White?.toLowerCase() == username?.toLowerCase()
        ? "white"
        : "black"
      : chess.turn() == "w"
      ? "white"
      : "black";
  }
  getGameInfo(props, board, openingInfoRef, chessObject) {
    return {
      username: props.game.username,
      orientation: board.orientation(),
      openingInfo: openingInfoRef.value,
      pgn: chessObject.pgn(),
    };
  }
}
